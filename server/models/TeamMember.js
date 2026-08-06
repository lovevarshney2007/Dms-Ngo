import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("TeamMember", teamMemberSchema);