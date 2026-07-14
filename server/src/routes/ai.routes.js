import express from "express";
import upload from "../config/multer.js";
import {
  analyzeResume, analyzeSkillGap,
  generateInterviewQuestions, generateRoadmap
} from "../controllers/ai.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// analyze-resume: POST with file upload
router.post("/analyze-resume", isAuthenticated, upload.single("file"), analyzeResume);
// skill-gap: POST with { targetRole } in body
router.post("/skill-gap", isAuthenticated, analyzeSkillGap);
// interview-questions: POST with { role } in body
router.post("/interview-questions", isAuthenticated, generateInterviewQuestions);
// roadmap: POST with { targetRole } in body
router.post("/roadmap", isAuthenticated, generateRoadmap);

export default router;
