import express from "express";
import TeamMember from "../models/TeamMember.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
  res.json(team);
});

router.post("/", requireAuth, async (req, res) => {
  const { name, role, image } = req.body;
  if (!name || !role) return res.status(400).json({ message: "Name and role required" });
  const member = await TeamMember.create({ name, role, image });
  res.status(201).json(member);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { name, role, image } = req.body;
  const member = await TeamMember.findByIdAndUpdate(
    req.params.id,
    { name, role, image },
    { new: true },
  );
  if (!member) return res.status(404).json({ message: "Member not found" });
  res.json(member);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ message: "Member not found" });
  res.json({ success: true });
});

export default router;