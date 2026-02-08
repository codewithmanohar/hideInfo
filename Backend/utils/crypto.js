import crypto from "crypto";

/**
 * Derive a 32-byte key from master password using scrypt.
 * (For production, Argon2id is even better, but scrypt is solid and built-in.)
 */
export function deriveKey(masterPassword, saltBase64) {
  const salt = Buffer.from(saltBase64, "base64");
  const key = crypto.scryptSync(masterPassword, salt, 32); // 32 bytes for AES-256
  return key;
}

export function generateSaltBase64() {
  return crypto.randomBytes(16).toString("base64");
}

/**
 * Encrypt plaintext using AES-256-GCM
 * returns { iv, authTag, ciphertext } as base64 strings
 */
export function encryptText(plaintext, key) {
  const iv = crypto.randomBytes(12); // recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final()
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    ciphertext: ciphertext.toString("base64")
  };
}

export function decryptText({ iv, authTag, ciphertext }, key) {
  const ivBuf = Buffer.from(iv, "base64");
  const tagBuf = Buffer.from(authTag, "base64");
  const ctBuf = Buffer.from(ciphertext, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuf);
  decipher.setAuthTag(tagBuf);

  const plaintext = Buffer.concat([decipher.update(ctBuf), decipher.final()]);
  return plaintext.toString("utf8");
}
