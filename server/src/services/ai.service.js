import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chat = async (content) => {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content }],
    temperature: 0.7,
    max_tokens: 3000
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

export const analyzeSkillGapWithAI = async (
  currentSkills,
  targetRole,
  studentContext = {}
) => {
  const context = {
    skills: studentContext.skills || [],
    projects: studentContext.projects || [],
    profile: studentContext.profile || null
  };

  return chat(`
You are a professional MERN Stack career mentor.

Your task is to analyze a student's existing skills and identify
what they genuinely need to improve for their target role.

TARGET ROLE:
${targetRole}

STUDENT'S SAVED SKILLS:
${JSON.stringify(context.skills, null, 2)}

STUDENT'S PROJECTS:
${JSON.stringify(context.projects, null, 2)}

STUDENT PROFILE:
${JSON.stringify(context.profile, null, 2)}

IMPORTANT ACCURACY RULES:

1. Carefully examine all supplied skills and projects.

2. Never classify a skill as missing if it appears in the
   student's saved skills or project technology stack.

3. Distinguish between:
   - Already listed skills
   - Skills demonstrated through projects
   - Skills that need improvement
   - Skills not demonstrated in the available information

4. A skill not mentioned in the profile does NOT necessarily
   mean the student does not know it.

5. Use the saved proficiency level (Beginner, Intermediate,
   Advanced) when evaluating existing skills.

6. Project descriptions and technology stacks are evidence
   of practical exposure, not proof of expert-level mastery.

7. Do not invent student experience, achievements,
   certifications, projects or proficiency levels.

8. Recommend technologies relevant to the target role.
   Do not recommend every popular technology unnecessarily.

9. Do not invent course names, URLs or learning resources.
   If you cannot verify a specific resource, recommend
   an official documentation source by name without
   generating a fake URL.

10. If information is insufficient, clearly mention it.

11. Never assume that an Intermediate proficiency level
    means weak, shallow, or incomplete knowledge.

12. Never claim that a student lacks specific concepts
    unless there is actual evidence supporting that claim.

13. Do not automatically assume that CRUD, Hooks,
    authentication, middleware, or other concepts are
    missing based only on a proficiency label.

14. For every improvement recommendation, explain that
    it is a recommended next step, not a confirmed weakness,
    unless the available evidence proves the weakness.

15. Include all relevant projects provided in the student
    context. Do not focus on only one project.

16. Separate role requirements into:
    - Core requirements
    - Important additional skills
    - Optional advanced technologies

17. Do not classify optional technologies as critical
    skill gaps for an entry-level MERN developer.

18. Every personalized claim must be supported by the
    supplied student skills, proficiency levels, or projects.

19. Do not invent project implementation details.
Only describe features explicitly supported by the supplied
project descriptions and technology stacks.

20. Never assume a student lacks a skill because it is
not mentioned in their profile.

21. Missing evidence means "Not demonstrated in supplied
information", not "Definitely missing".

22. Consider every project supplied in the student context.
Do not focus on only one project.

23. Every project-based claim must be supported by the
actual project information provided.

24. Avoid repeating the same learning recommendation
under multiple skill categories.

25. Always complete every section of the response.
Never end with an unfinished sentence, table, heading,
or quotation.

26. Before returning the response, verify that all sections
are complete and the final sentence is finished.

RESPONSE FORMAT:

## 1. Target Role Overview
Explain the important skills generally expected for this role.

## 2. Skills Already Present
List the student's existing skills and proficiency levels.
Mention relevant projects that demonstrate practical exposure.

## 3. Skills to Improve
Identify existing skills that need deeper knowledge.
Explain why and what topics should be studied.

## 4. Skills Not Yet Demonstrated
List relevant role requirements that are not found in
the supplied profile or projects.
Label these as "Not demonstrated", NOT "Definitely missing".

## 5. Top 5 Learning Recommendations
Give practical, prioritized learning recommendations.
Avoid recommending skills the student already demonstrates
unless deeper mastery is needed.

## 6. Personalized Action Plan
Give a realistic sequence of learning steps based on
the student's current knowledge.

## 7. Overall Assessment
Summarize the student's strengths and development areas.

Be specific, evidence-based, honest and beginner-friendly.
Do not make unsupported claims about job readiness.
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
