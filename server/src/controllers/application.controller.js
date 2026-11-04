import mongoose from "mongoose";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { sendEmail } from "../services/mail.service.js";

// CREATE APPLICATION
export const createApplication = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required"
      });
    }

    let application;

    await session.withTransaction(async () => {
      const job = await Job.findById(jobId).session(session);

      if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
      }

      const existing = await Application.findOne({
        student: req.user._id,
        job: jobId
      }).session(session);

      if (existing) {
        const error = new Error("You have already applied to this job");
        error.statusCode = 409;
        throw error;
      }

      const [createdApplication] = await Application.create(
        [{
          student: req.user._id,
          job: job._id
        }],
        { session }
      );

      await Job.updateOne(
        { _id: job._id },
        { $addToSet: { applicants: req.user._id } },
        { session }
      );

      application = createdApplication;
    });

    sendEmail(
      req.user.email,
      "Application Submitted",
      "Your job application has been submitted successfully."
    ).catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error) {
    console.error("Create application error:", error.message);

    const statusCode =
      error.statusCode ||
      (error.code === 11000 ? 409 :
      error.name === "CastError" ? 400 : 500);

    return res.status(statusCode).json({
      success: false,
      message: error.code === 11000
        ? "You have already applied to this job"
        : error.message
    });

  } finally {
    await session.endSession();
  }
};


// GET APPLICATIONS
export const getApplications = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "student") {
      query = { student: req.user._id };

    } else if (req.user.role === "recruiter") {
      const recruiterJobIds = await Job.find({
        recruiter: req.user._id
      }).distinct("_id");

      query = { job: { $in: recruiterJobIds } };

    } else if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view applications"
      });
    }

    const applications = await Application.find(query)
      .populate("student", "fullName email")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Selected"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    const job = await Job.findById(application.job).select("recruiter");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Associated job not found"
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this application"
      });
    }

    const previousStatus = application.status;

    application.status = status;
    await application.save();

    await application.populate("student", "fullName email");
    await application.populate("job", "title company location");

    if (status === "Shortlisted" && previousStatus !== "Shortlisted") {
      sendEmail(
        application.student.email,
        "You are Shortlisted!",
        `Congratulations ${application.student.fullName}! Your application has been shortlisted.`
      ).catch(() => {});
    }

    if (status === "Selected" && previousStatus !== "Selected") {
      sendEmail(
        application.student.email,
        "You are Selected!",
        `Great news ${application.student.fullName}! You have been selected.`
      ).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      application
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// WITHDRAW APPLICATION
export const deleteApplication = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const application = await Application.findOne({
        _id: req.params.id,
        student: req.user._id
      }).session(session);

      if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
      }

      if (application.status !== "Applied") {
        const error = new Error(
          "You can only withdraw applications with Applied status"
        );
        error.statusCode = 400;
        throw error;
      }

      await Application.deleteOne(
        { _id: application._id },
        { session }
      );

      await Job.updateOne(
        { _id: application.job },
        { $pull: { applicants: req.user._id } },
        { session }
      );
    });

    return res.status(200).json({
      success: true,
      message: "Application withdrawn successfully"
    });

  } catch (error) {
    console.error("Withdraw application error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });

  } finally {
    await session.endSession();
  }
};