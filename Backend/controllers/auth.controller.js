import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { cookieOptions } from "../utils/cookie.js";
import { generateSaltBase64 } from "../utils/crypto.js";

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  if (password.length < 8) return res.status(400).json({ message: "Password must be 8+ characters" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const kdfSalt = generateSaltBase64();

  const user = await User.create({ name, email, passwordHash, kdfSalt });

  return res.status(201).json({
    message: "Registered",
    user: { id: user._id, name: user.name, email: user.email }
  });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie(process.env.COOKIE_NAME, token, cookieOptions());

  return res.json({
    message: "Logged in",
    user: { id: user._id, name: user.name, email: user.email }
  });
}

export async function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME, cookieOptions());
  return res.json({ message: "Logged out" });
}

export async function me(req, res) {
  const user = await User.findById(req.user.id).select("_id name email createdAt");
  return res.json({ user });
}
