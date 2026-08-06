import express from "express";
import VolunteerRegistration from "../models/VolunteerRegistration.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public — the website's volunteer form submits here
router.post("/", async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ message: "Name, phone and email are required" });
  }
  const volunteer = await VolunteerRegistration.create(req.body);
  res.status(201).json(volunteer);
});

// Admin only
router.get("/", requireAuth, async (req, res) => {
  const volunteers = await VolunteerRegistration.find().sort({ createdAt: -1 });
  res.json(volunteers);
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  const volunteer = await VolunteerRegistration.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  if (!volunteer) return res.status(404).json({ message: "Not found" });
  res.json(volunteer);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const volunteer = await VolunteerRegistration.findByIdAndDelete(req.params.id);
  if (!volunteer) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;