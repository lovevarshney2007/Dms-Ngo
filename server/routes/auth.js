import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const admin = await Admin.findOne({ username: username.trim() });
  if (!admin) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, username: admin.username });
});

// Lets the frontend verify a stored token is still valid on app load
router.get("/me", requireAuth, (req, res) => {
  res.json({ username: req.admin.username });
});

export default router;