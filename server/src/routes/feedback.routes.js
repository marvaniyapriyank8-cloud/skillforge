import express from "express";
import {
  createFeedback, getFeedbacks,
  updateFeedback, deleteFeedback
} from "../controllers/feedback.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, authorizeRoles("mentor"), createFeedback);
// Students can also see their feedback
router.get("/", isAuthenticated, getFeedbacks);
router.put("/:id", isAuthenticated, authorizeRoles("mentor"), updateFeedback);
router.delete("/:id", isAuthenticated, authorizeRoles("mentor"), deleteFeedback);

export default router;
