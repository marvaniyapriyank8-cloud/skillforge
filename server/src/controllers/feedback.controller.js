import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";

export const createFeedback = async (req, res) => {
  try {
    const { student, type, message, project } = req.body;

    if (!type || !message) {
      return res.status(400).json({ success: false, message: "type and message are required" });
    }

    // FIX: Accept student by email OR by ObjectId
    let studentId = student;
    if (student && student.includes("@")) {
      const studentUser = await User.findOne({ email: student, role: "student" });
      if (!studentUser) {
        return res.status(404).json({ success: false, message: "Student not found with that email" });
      }
      studentId = studentUser._id;
    }

    if (!studentId) {
      return res.status(400).json({ success: false, message: "student is required" });
    }

    const feedback = await Feedback.create({
      mentor: req.user._id,
      student: studentId,
      type,
      message,
      project: project || undefined
    });

    const populated = await Feedback.findById(feedback._id)
      .populate("mentor", "fullName email")
      .populate("student", "fullName email");

    res.status(201).json({ success: true, feedback: populated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    // FIX: Mentor sees only their own feedbacks; students see feedbacks about them
    let query = {};
    if (req.user.role === "mentor") {
      query = { mentor: req.user._id };
    } else if (req.user.role === "student") {
      query = { student: req.user._id };
    }

    const feedbacks = await Feedback.find(query)
      .populate("mentor", "fullName email")
      .populate("student", "fullName email")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, feedbacks });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    // FIX: Only mentor who created it can update
    const feedback = await Feedback.findOne({ _id: req.params.id, mentor: req.user._id });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found or unauthorized" });
    }

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { type: req.body.type, message: req.body.message },
      { new: true }
    ).populate("mentor", "fullName email").populate("student", "fullName email");

    res.status(200).json({ success: true, feedback: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    // FIX: Only mentor who created it can delete
    const feedback = await Feedback.findOne({ _id: req.params.id, mentor: req.user._id });

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found or unauthorized" });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Feedback deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
