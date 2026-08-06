import express from "express";
import Event from "../models/Event.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ createdAt: 1 });
  res.json(events);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, date, location, desc, image, tag, tagColor, icon } = req.body;
  if (!title || !date) return res.status(400).json({ message: "Title and date required" });
  const event = await Event.create({ title, date, location, desc, image, tag, tagColor, icon });
  res.status(201).json(event);
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, date, location, desc, image, tag, tagColor, icon } = req.body;
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { title, date, location, desc, image, tag, tagColor, icon },
    { new: true },
  );
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ success: true });
});

export default router;