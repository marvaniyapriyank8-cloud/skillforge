import express from "express";
import {
  createSkill, getSkills, updateSkill, deleteSkill
} from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createSkill);
router.get("/", isAuthenticated, getSkills);
router.put("/:id", isAuthenticated, updateSkill);
router.delete("/:id", isAuthenticated, deleteSkill);

export default router;
