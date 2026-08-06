import express from "express";
import GalleryImage from "../models/GalleryImage.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:initiative", async (req, res) => {
  const images = await GalleryImage.find({ initiative: req.params.initiative }).sort({
    order: 1,
    createdAt: 1,
  });
  res.json(images);
});

router.post("/:initiative", requireAuth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: "Image url required" });
  const image = await GalleryImage.create({ initiative: req.params.initiative, url });
  res.status(201).json(image);
});

router.delete("/:initiative/:id", requireAuth, async (req, res) => {
  const image = await GalleryImage.findOneAndDelete({
    _id: req.params.id,
    initiative: req.params.initiative,
  });
  if (!image) return res.status(404).json({ message: "Image not found" });
  res.json({ success: true });
});

export default router;