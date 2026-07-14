import express from "express";
import upload from "../config/multer.js";
import {
  uploadResume, uploadProfilePhoto, uploadCertificate
} from "../controllers/upload.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// FIX: field name is "file" in all (matches multer single("file"))
router.post("/resume", isAuthenticated, upload.single("file"), uploadResume);
router.post("/profile-photo", isAuthenticated, upload.single("file"), uploadProfilePhoto);
router.post("/certificate", isAuthenticated, upload.single("file"), uploadCertificate);

export default router;
