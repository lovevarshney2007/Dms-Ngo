import express from "express";
import InitiativeContent from "../models/InitiativeContent.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {
  let content = await InitiativeContent.findOne({ slug: req.params.slug });
  if (!content) {
    // Return an empty shape rather than 404 so the frontend can
    // fall back to its own hardcoded defaults until an admin saves.
    return res.json(null);
  }
  res.json(content);
});

router.put("/:slug", requireAuth, async (req, res) => {
  const { heroTitle, heroTagline, aboutText, ctaTitle, ctaBody, ctaButtonLabel, aboutImage } = req.body;
  const content = await InitiativeContent.findOneAndUpdate(
    { slug: req.params.slug },
    { heroTitle, heroTagline, aboutText, ctaTitle, ctaBody, ctaButtonLabel, aboutImage },
    { new: true, upsert: true },
  );
  res.json(content);
});

export default router;
