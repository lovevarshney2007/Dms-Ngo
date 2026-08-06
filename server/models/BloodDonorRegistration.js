import mongoose from "mongoose";

const bloodDonorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    age: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    weight: { type: String, default: "" },
    city: { type: String, default: "" },
    lastDonationDate: { type: String, default: "" },
    preferredCamp: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "verified"], default: "new" },
  },
  { timestamps: true },
);

export default mongoose.model("BloodDonorRegistration", bloodDonorSchema);