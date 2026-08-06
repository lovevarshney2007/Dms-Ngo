import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    age: { type: String, default: "" },
    city: { type: String, default: "" },
    occupation: { type: String, default: "" },
    availability: { type: String, default: "" },
    mode: { type: String, default: "" },
    heardFrom: { type: String, default: "" },
    interestArea: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "onboarded"], default: "new" },
  },
  { timestamps: true },
);

export default mongoose.model("VolunteerRegistration", volunteerSchema);