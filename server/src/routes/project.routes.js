import express from "express";
import {
  createProject, getProjects, getSingleProject,
  updateProject, deleteProject
} from "../controllers/project.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createProject);
router.get("/", isAuthenticated, getProjects);
router.get("/:id", isAuthenticated, getSingleProject);
router.put("/:id", isAuthenticated, updateProject);
router.delete("/:id", isAuthenticated, deleteProject);

export default router;
