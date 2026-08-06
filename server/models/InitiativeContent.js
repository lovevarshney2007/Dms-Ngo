import mongoose from "mongoose";

const initiativeContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    heroTitle: { type: String, default: "" },
    heroTagline: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    aboutText: { type: String, default: "" }, // paragraphs joined by \n
    ctaTitle: { type: String, default: "" },
    ctaBody: { type: String, default: "" },
    ctaButtonLabel: { type: String, default: "" },
     aboutImage: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("InitiativeContent", initiativeContentSchema);
