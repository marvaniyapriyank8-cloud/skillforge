import express from "express";
import { getAssignedStudents, getAssignedStudentDetails } from "../controllers/mentor.controller.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(isAuthenticated, authorizeRoles("mentor"));
router.get("/students", getAssignedStudents);
router.get("/students/:id", getAssignedStudentDetails);
export default router;
