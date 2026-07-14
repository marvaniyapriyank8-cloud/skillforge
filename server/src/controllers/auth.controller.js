import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../services/mail.service.js";

// Only these roles can self-register - admin must be set manually in DB
const ALLOWED_REGISTER_ROLES = ["student", "recruiter", "mentor"];

export const register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // SECURITY FIX: block admin self-registration
    if (role && !ALLOWED_REGISTER_ROLES.includes(role)) {
      return res.status(403).json({ success: false, message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: ALLOWED_REGISTER_ROLES.includes(role) ? role : "student"
    });

    const token = user.generateToken();
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });

    sendEmail(user.email, "Welcome to SkillForge 🎉", `Hi ${user.fullName}, welcome to SkillForge! Start building your profile today.`).catch(() => {});

    res.status(201).json({ success: true, message: "Account created successfully", token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (user.isBlocked) return res.status(403).json({ success: false, message: "Your account has been blocked. Contact support." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = user.generateToken();
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.status(200).json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: "Logout successful" });
};
