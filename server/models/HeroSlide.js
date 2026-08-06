import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    initiative: { type: String, required: true, index: true }, // "home" or a slug
    image: { type: String, required: true },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("HeroSlide", heroSlideSchema);