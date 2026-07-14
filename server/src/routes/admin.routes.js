import express from "express";
import {
  getAllUsers, getAllJobs, getAllApplications,
  blockUser, deleteUser, getAnalytics
} from "../controllers/admin.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);

// FIX: toggle block/unblock via same route
router.put("/block-user/:id", blockUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
