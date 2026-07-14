import Application from "../models/application.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required" });
    }

    // FIX: Prevent duplicate applications
    const existing = await Application.findOne({ student: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    const application = await Application.create({ student: req.user._id, job: jobId });

    // Send email non-blocking
    sendEmail(req.user.email, "Application Submitted", "Your job application has been submitted successfully.").catch(() => {});

    res.status(201).json({ success: true, application });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    let query = {};

    // FIX: Students see only their own applications; recruiters/admins see all
    if (req.user.role === "student") {
      query = { student: req.user._id };
    }

    const applications = await Application.find(query)
      .populate("student", "fullName email")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Selected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("student", "fullName email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Send email on shortlist non-blocking
    if (status === "Shortlisted") {
      sendEmail(
        application.student.email,
        "You are Shortlisted!",
        `Congratulations ${application.student.fullName}! Your application has been shortlisted.`
      ).catch(() => {});
    }

    if (status === "Selected") {
      sendEmail(
        application.student.email,
        "You are Selected!",
        `Great news ${application.student.fullName}! You have been selected.`
      ).catch(() => {});
    }

    res.status(200).json({ success: true, application });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    // FIX: Only allow student to delete their own application
    const application = await Application.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Application withdrawn successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
