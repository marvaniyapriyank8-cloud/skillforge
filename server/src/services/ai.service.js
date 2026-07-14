import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chat = async (content) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content }],
    temperature: 0.7,
    max_tokens: 1500
  });
  return completion.choices[0].message.content;
};

export const analyzeResumeWithAI = async (resumeText) => {
  return chat(`
Analyze this resume and provide:
1. ATS Score (out of 100)
2. Key Skills Found
3. Missing Important Skills
4. Top 3 Improvement Suggestions
5. Overall Summary

Resume Text:
${resumeText.slice(0, 3000)}
  `);
};

export const analyzeSkillGapWithAI = async (currentSkills, targetRole) => {
  return chat(`
I want to become a ${targetRole}.

My current skills: ${currentSkills.join(", ") || "None listed yet"}

Please provide:
1. Skills I am missing for this role
2. Skills I should improve
3. Top 5 learning recommendations with resources
4. Estimated time to be job-ready
  `);
};

export const generateInterviewQuestionsWithAI = async (role, skills, projects) => {
  return chat(`
Generate 10 interview questions for a ${role} candidate.

Candidate Skills: ${skills.join(", ") || "General"}
Candidate Projects: ${projects.join(", ") || "Not specified"}

Include:
1. 4 Technical Questions (based on skills)
2. 3 Project-Based Questions
3. 2 Problem-Solving Questions
4. 1 HR/Behavioral Question

Format each question clearly numbered.
  `);
};

export const generateRoadmapWithAI = async (currentSkills, targetRole) => {
  return chat(`
Create a 6-week learning roadmap to become a ${targetRole}.

Current Skills: ${currentSkills.join(", ") || "Beginner"}

For each week provide:
- Week number and focus topic
- Key concepts to learn
- Recommended resource (free)
- Mini project to build

Keep it practical and actionable.
  `);
};
