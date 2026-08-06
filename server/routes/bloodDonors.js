import express from "express";
import BloodDonorRegistration from "../models/BloodDonorRegistration.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ message: "Name, phone and email are required" });
  }
  const donor = await BloodDonorRegistration.create(req.body);
  res.status(201).json(donor);
});

router.get("/", requireAuth, async (req, res) => {
  const donors = await BloodDonorRegistration.find().sort({ createdAt: -1 });
  res.json(donors);
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  const donor = await BloodDonorRegistration.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!donor) return res.status(404).json({ message: "Not found" });
  res.json(donor);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const donor = await BloodDonorRegistration.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;