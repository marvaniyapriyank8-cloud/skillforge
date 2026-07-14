import express from "express";
import {
  createApplication, getApplications,
  updateApplicationStatus, deleteApplication
} from "../controllers/application.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Student creates application
router.post("/", isAuthenticated, authorizeRoles("student"), createApplication);

// GET: students see their own, recruiters/admins see all (handled in controller)
router.get("/", isAuthenticated, getApplications);

// Recruiter updates status
router.put("/:id", isAuthenticated, authorizeRoles("recruiter"), updateApplicationStatus);

// Student withdraws (deletes) their application
router.delete("/:id", isAuthenticated, authorizeRoles("student"), deleteApplication);

export default router;
