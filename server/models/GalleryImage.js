import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    // "home" or an initiative slug e.g. "blood-donation"
    initiative: { type: String, required: true, index: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("GalleryImage", galleryImageSchema);