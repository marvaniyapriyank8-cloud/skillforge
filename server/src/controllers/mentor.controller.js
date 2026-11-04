import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Project from "../models/project.model.js";
import Skill from "../models/skill.model.js";

export const getAssignedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student", assignedMentor: req.user._id })
      .select("fullName email createdAt")
      .sort({ fullName: 1 });
    return res.status(200).json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignedStudentDetails = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id, role: "student", assignedMentor: req.user._id
    }).select("fullName email createdAt");

    if (!student) {
      return res.status(404).json({ success: false, message: "Assigned student not found" });
    }

    const [profile, skills, projects] = await Promise.all([
      Profile.findOne({ user: student._id }),
      Skill.find({ user: student._id }).sort({ createdAt: -1 }),
      Project.find({ user: student._id }).sort({ createdAt: -1 })
    ]);

    return res.status(200).json({
      success: true,
      student: {
        ...student.toObject(),
        profile: profile || null,
        skills,
        projects
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
