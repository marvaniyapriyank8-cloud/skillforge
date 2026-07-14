import express from "express";
import {
  createJob, getJobs, getJobById,
  updateJob, deleteJob, applyJob
} from "../controllers/job.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// IMPORTANT: /apply/:id must come BEFORE /:id to avoid route conflict
router.post("/apply/:id", isAuthenticated, authorizeRoles("student"), applyJob);

router.post("/", isAuthenticated, authorizeRoles("recruiter"), createJob);
router.get("/", isAuthenticated, getJobs);
router.get("/:id", isAuthenticated, getJobById);
router.put("/:id", isAuthenticated, authorizeRoles("recruiter"), updateJob);
router.delete("/:id", isAuthenticated, authorizeRoles("recruiter"), deleteJob);

export default router;
