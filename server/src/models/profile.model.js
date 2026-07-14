import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    bio: { type: String, default: "" },
    college: { type: String, default: "" },
    experience: { type: String, default: "" },
    skills: [String],
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" }
    },
    profilePhoto: { type: String, default: "" },
    resume: { type: String, default: "" },
    certificates: [{ type: String }]
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
