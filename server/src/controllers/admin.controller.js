import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // FIX: support search query
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } }
        ]
      };
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "fullName email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "fullName email")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // FIX: Toggle block/unblock
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: !user.isBlocked },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: updated.isBlocked ? "User blocked" : "User unblocked",
      user: updated
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    // FIX: Clean up related data on delete
    await Application.deleteMany({ student: req.params.id });
    await Job.deleteMany({ recruiter: req.params.id });

    res.status(200).json({ success: true, message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, studentCount, recruiterCount, mentorCount] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "recruiter" }),
        User.countDocuments({ role: "mentor" }),
      ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalJobs,
        totalApplications,
        studentCount,
        recruiterCount,
        mentorCount
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
