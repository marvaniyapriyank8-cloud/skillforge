import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, skillsRequired, salary } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({ success: false, message: "title, company, location and description are required" });
    }

    // FIX: Parse skillsRequired if sent as comma-separated string
    let skills = skillsRequired;
    if (typeof skillsRequired === "string") {
      skills = skillsRequired.split(",").map(s => s.trim()).filter(Boolean);
    }

    const job = await Job.create({
      title, company, location, description, salary,
      skillsRequired: skills || [],
      recruiter: req.user._id
    });

    res.status(201).json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    // FIX: populate recruiter with correct field (fullName not name)
    const jobs = await Job.find()
      .populate("recruiter", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "fullName email");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    // FIX: Only allow the recruiter who created the job to update it
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
    }

    // FIX: Parse skillsRequired if sent as comma-separated string
    if (req.body.skillsRequired && typeof req.body.skillsRequired === "string") {
      req.body.skillsRequired = req.body.skillsRequired.split(",").map(s => s.trim()).filter(Boolean);
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, job: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    // FIX: Only allow the recruiter who created the job to delete it
    const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
    }

    await Job.findByIdAndDelete(req.params.id);

    // FIX: Also delete all applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({ success: true, message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // FIX: Check if already applied
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    job.applicants.push(req.user._id);
    await job.save();

    res.status(200).json({ success: true, message: "Applied successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
