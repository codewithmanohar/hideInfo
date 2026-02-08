import bcrypt from "bcrypt";
import User from "../models/User.js";
import VaultItem from "../models/VaultItem.js";
import { deriveKey, encryptText, decryptText } from "../utils/crypto.js";

// List items (NO decrypted password)
export async function listVault(req, res) {
  const items = await VaultItem.find({ userId: req.user.id })
    .sort({ updatedAt: -1 })
    .select("-passwordCiphertext -passwordIv -passwordAuthTag");

  return res.json({ items });
}

// Create item (encrypt password)
export async function createVaultItem(req, res) {
  const { siteName, siteUrl, loginUsername, loginEmail, passwordPlain, masterPassword } = req.body || {};

  if (!siteName || !passwordPlain || !masterPassword) {
    return res.status(400).json({ message: "siteName, passwordPlain, masterPassword required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Verify master password for encryption
  const ok = await bcrypt.compare(masterPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Master password incorrect" });

  const key = deriveKey(masterPassword, user.kdfSalt);
  const enc = encryptText(passwordPlain, key);

  const item = await VaultItem.create({
    userId: user._id,
    siteName,
    siteUrl,
    loginUsername,
    loginEmail,
    passwordCiphertext: enc.ciphertext,
    passwordIv: enc.iv,
    passwordAuthTag: enc.authTag
  });

  return res.status(201).json({
    message: "Saved",
    item: {
      id: item._id,
      siteName: item.siteName,
      siteUrl: item.siteUrl,
      loginUsername: item.loginUsername,
      loginEmail: item.loginEmail,
      createdAt: item.createdAt
    }
  });
}

// Update item (optionally re-encrypt password if provided)
export async function updateVaultItem(req, res) {
  const { id } = req.params;
  const { siteName, siteUrl, loginUsername, loginEmail, passwordPlain, masterPassword } = req.body || {};

  const item = await VaultItem.findOne({ _id: id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (siteName !== undefined) item.siteName = siteName;
  if (siteUrl !== undefined) item.siteUrl = siteUrl;
  if (loginUsername !== undefined) item.loginUsername = loginUsername;
  if (loginEmail !== undefined) item.loginEmail = loginEmail;

  if (passwordPlain !== undefined) {
    if (!masterPassword) return res.status(400).json({ message: "masterPassword required to update password" });

    const user = await User.findById(req.user.id);
    const ok = await bcrypt.compare(masterPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Master password incorrect" });

    const key = deriveKey(masterPassword, user.kdfSalt);
    const enc = encryptText(passwordPlain, key);

    item.passwordCiphertext = enc.ciphertext;
    item.passwordIv = enc.iv;
    item.passwordAuthTag = enc.authTag;
  }

  await item.save();
  return res.json({ message: "Updated" });
}

export async function deleteVaultItem(req, res) {
  const { id } = req.params;
  const deleted = await VaultItem.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Item not found" });
  return res.json({ message: "Deleted" });
}

// Reveal password (re-auth with master password)
export async function revealPassword(req, res) {
  const { id } = req.params;
  const { masterPassword } = req.body || {};
  if (!masterPassword) return res.status(400).json({ message: "masterPassword required" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const ok = await bcrypt.compare(masterPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Master password incorrect" });

  const item = await VaultItem.findOne({ _id: id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: "Item not found" });

  const key = deriveKey(masterPassword, user.kdfSalt);

  try {
    const passwordPlain = decryptText(
      {
        iv: item.passwordIv,
        authTag: item.passwordAuthTag,
        ciphertext: item.passwordCiphertext
      },
      key
    );

    return res.json({ passwordPlain });
  } catch (e) {
    return res.status(500).json({ message: "Decryption failed (wrong key or corrupted data)" });
  }
}
