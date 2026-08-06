import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    desc: { type: String, default: "" },
    image: { type: String, default: "" },
    tag: { type: String, default: "Event" },
    tagColor: { type: String, default: "bg-coral" },
    icon: { type: String, default: "📅" },
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);