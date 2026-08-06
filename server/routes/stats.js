import express from "express";
import TeamMember from "../models/TeamMember.js";
import GalleryImage from "../models/GalleryImage.js";
import Event from "../models/Event.js";
import VolunteerRegistration from "../models/VolunteerRegistration.js";
import BloodDonorRegistration from "../models/BloodDonorRegistration.js";

const router = express.Router();

const INITIATIVE_KEYS = [
  "home",
  "blood-donation",
  "child-education",
  "beti-bachao",
  "cloth-distribution",
  "senior-citizen",
  "environment",
];

router.get("/", async (req, res) => {
  const [teamCount, eventsCount, galleryCounts, volunteersCount, bloodDonorsCount] = await Promise.all([
    TeamMember.countDocuments(),
    Event.countDocuments(),
    GalleryImage.aggregate([{ $group: { _id: "$initiative", count: { $sum: 1 } } }]),
    VolunteerRegistration.countDocuments(),
    BloodDonorRegistration.countDocuments(),
  ]);

  const galleryByInitiative = INITIATIVE_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  galleryCounts.forEach((g) => {
    if (galleryByInitiative[g._id] !== undefined) galleryByInitiative[g._id] = g.count;
  });

  const totalGalleryImages = Object.values(galleryByInitiative).reduce((a, b) => a + b, 0);

  res.json({ teamCount, eventsCount, galleryByInitiative, totalGalleryImages, volunteersCount, bloodDonorsCount });
});

export default router;