import Skill from "../models/skill.model.js";

export const createSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ success: false, message: "name and level are required" });
    }

    // FIX: Prevent duplicate skill names per user
    const existing = await Skill.findOne({ user: req.user._id, name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already have this skill" });
    }

    const skill = await Skill.create({ name, level, user: req.user._id });

    res.status(201).json({ success: true, skill });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({ success: true, skill });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({ success: true, message: "Skill deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
