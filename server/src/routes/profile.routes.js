import express from "express";
import {
  createProfile, getProfile,
  updateProfile, deleteProfile
} from "../controllers/profile.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createProfile);
router.get("/", isAuthenticated, getProfile);
router.put("/", isAuthenticated, updateProfile);
router.delete("/", isAuthenticated, deleteProfile);

export default router;
