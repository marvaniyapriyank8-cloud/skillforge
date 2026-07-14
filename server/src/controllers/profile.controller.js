import Profile from "../models/profile.model.js";

export const createProfile = async (req, res) => {
  try {
    // FIX: Prevent duplicate profiles - upsert instead
    const existing = await Profile.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "Profile already exists. Use PUT to update." });
    }

    const profile = await Profile.create({ ...req.body, user: req.user._id });

    const populated = await Profile.findById(profile._id).populate("user", "fullName email role");

    res.status(201).json({ success: true, profile: populated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate("user", "fullName email role");

    // FIX: Return null profile gracefully instead of error
    res.status(200).json({ success: true, profile: profile || null });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // FIX: upsert - create if not exists, update if exists
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "fullName email role");

    res.status(200).json({ success: true, profile });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
