import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack: [{ type: String, trim: true }],
    githubLink: { type: String, default: "" },
    liveDemo: { type: String, default: "" }   // field is liveDemo not liveLink
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
