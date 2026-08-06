import express from "express";
import HeroSlide from "../models/HeroSlide.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:initiative", async (req, res) => {
  const slides = await HeroSlide.find({ initiative: req.params.initiative }).sort({ order: 1, createdAt: 1 });
  res.json(slides);
});

router.post("/:initiative", requireAuth, async (req, res) => {
  const { image, title, subtitle } = req.body;
  if (!image) return res.status(400).json({ message: "Image required" });
  const slide = await HeroSlide.create({ initiative: req.params.initiative, image, title, subtitle });
  res.status(201).json(slide);
});

router.put("/:initiative/:id", requireAuth, async (req, res) => {
  const { image, title, subtitle } = req.body;
  const slide = await HeroSlide.findOneAndUpdate(
    { _id: req.params.id, initiative: req.params.initiative },
    { image, title, subtitle },
    { new: true },
  );
  if (!slide) return res.status(404).json({ message: "Slide not found" });
  res.json(slide);
});

router.delete("/:initiative/:id", requireAuth, async (req, res) => {
  const slide = await HeroSlide.findOneAndDelete({ _id: req.params.id, initiative: req.params.initiative });
  if (!slide) return res.status(404).json({ message: "Slide not found" });
  res.json({ success: true });
});

export default router;