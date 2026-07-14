import imagekit from "../config/imagekit.js";
import Profile from "../models/profile.model.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `resume_${req.user._id}_${Date.now()}_${req.file.originalname}`,
      folder: "/skillforge/resumes"
    });

    // FIX: Auto-save resume URL to profile
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { resume: response.url, user: req.user._id },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, url: response.url });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `photo_${req.user._id}_${Date.now()}_${req.file.originalname}`,
      folder: "/skillforge/profile-photos"
    });

    // FIX: Auto-save photo URL to profile
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { profilePhoto: response.url, user: req.user._id },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, url: response.url });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `cert_${req.user._id}_${Date.now()}_${req.file.originalname}`,
      folder: "/skillforge/certificates"
    });

    // FIX: Auto-push certificate URL to profile's certificates array
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { certificates: response.url }, user: req.user._id },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, url: response.url });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
