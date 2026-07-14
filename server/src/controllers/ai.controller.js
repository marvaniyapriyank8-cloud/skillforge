import PDFParser from "pdf2json";

import {
  analyzeResumeWithAI,
  analyzeSkillGapWithAI,
  generateInterviewQuestionsWithAI,
  generateRoadmapWithAI
} from "../services/ai.service.js";
import Skill from "../models/skill.model.js";
import Project from "../models/project.model.js";

// pdf-parse is a CommonJS module, must use createRequire in ESM

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const pdfParser = new PDFParser(null, true);

    const pdfText = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => {
        reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();

        

        resolve(text);
      });

      pdfParser.parseBuffer(req.file.buffer);
    });

    

    if (!pdfText || pdfText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: "Could not extract enough text"
      });
    }

    const analysis = await analyzeResumeWithAI(pdfText);


    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    console.log("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ success: false, message: "targetRole is required in request body" });
    }

    const skills = await Skill.find({ user: req.user._id });
    const currentSkills = skills.map(s => s.name);

    const analysis = await analyzeSkillGapWithAI(
      currentSkills.length > 0 ? currentSkills : ["No skills added yet"],
      targetRole
    );

    res.status(200).json({ success: true, analysis });

  } catch (error) {
    console.error("Skill gap error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: "role is required in request body" });
    }

    const [skills, projects] = await Promise.all([
      Skill.find({ user: req.user._id }),
      Project.find({ user: req.user._id })
    ]);

    const skillNames = skills.map(s => s.name);
    const projectNames = projects.map(p => p.title);

    const questions = await generateInterviewQuestionsWithAI(role, skillNames, projectNames);

    res.status(200).json({ success: true, questions });

  } catch (error) {
    console.error("Interview questions error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateRoadmap = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ success: false, message: "targetRole is required in request body" });
    }

    const skills = await Skill.find({ user: req.user._id });
    const currentSkills = skills.map(s => s.name);

    const roadmap = await generateRoadmapWithAI(
      currentSkills.length > 0 ? currentSkills : ["Beginner"],
      targetRole
    );

    res.status(200).json({ success: true, roadmap });

  } catch (error) {
    console.error("Roadmap error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
