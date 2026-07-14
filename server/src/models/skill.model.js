import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    }
  },
  { timestamps: true }
);

// FIX: Prevent duplicate skill names per user (case-insensitive handled in controller)
skillSchema.index({ user: 1, name: 1 });

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
