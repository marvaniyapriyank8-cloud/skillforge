# 🚀 SkillForge

# AI-Powered Career Development Platform

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq-F55036)
![License](https://img.shields.io/badge/License-MIT-blue)

SkillForge is a full-stack MERN web application that helps students build their professional profiles, analyze resumes using AI, identify skill gaps, prepare for interviews, and connect with recruiters and mentors through a role-based platform.

The platform provides dedicated dashboards for Students, Recruiters, Mentors, and Administrators, making the recruitment and career development process more organized and efficient.

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [AI Features](#-ai-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [License](#-license)


---

# 📖 About

SkillForge is a full-stack AI-powered career development platform designed to help students prepare for internships and placements while simplifying the hiring process for recruiters.

Unlike traditional job portals, SkillForge combines career development tools with recruitment features in a single platform. Students can build professional profiles, upload resumes, showcase projects and skills, receive AI-powered career insights, and apply for jobs. Recruiters can post job opportunities and manage applicants, mentors can provide guidance and feedback, while administrators can monitor and manage the entire platform.

The project was built to demonstrate real-world full-stack development using the MERN stack, secure authentication, role-based authorization, cloud file management, and AI integration.


---

# ✨ Features

## 🔐 Authentication & Security

- JWT-based Authentication
- Role-Based Access Control (Student, Recruiter, Mentor, Admin)
- Protected Routes
- Secure Password Hashing
- Persistent Login Sessions

---

## 👨‍🎓 Student Features

- Create and manage professional profile
- Upload and manage resume
- Manage skills and projects
- Upload certificates
- AI-powered resume analysis
- AI skill gap analysis
- AI interview question generation
- AI learning roadmap generation
- Browse available jobs
- Apply for jobs
- Track submitted applications

---

## 🏢 Recruiter Features

- Recruiter Dashboard
- Create job postings
- Update job postings
- Delete job postings
- View applicants
- Manage job listings

---

## 👨‍🏫 Mentor Features

- Mentor Dashboard
- Review student profiles
- Provide feedback
- Edit feedback
- Delete feedback

---

## 🛡️ Admin Features

- Admin Dashboard
- User Management
- Job Management
- Platform Analytics
- Block/Unblock Users
- Delete Users
- Monitor Platform Activity

---

## 🤖 AI Features

- Resume Analysis
- Skill Gap Analysis
- Personalized Learning Roadmap
- Interview Question Generator

---

## ☁️ Additional Features

- Cloud File Uploads
- Responsive Design
- Modern UI/UX
- Search & Filtering
- Loading Skeletons
- Toast Notifications
- Form Validation
- Dashboard Analytics


---

# 🛠️ Tech Stack

## 🎨 Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- Axios
- React Hook Form
- Framer Motion
- Recharts
- Lucide React
- React Hot Toast

---

## ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Multer
- Nodemailer
- Cookie Parser
- CORS

---

## 🤖 AI Integration

- Groq API
- Llama 3 (via Groq)
- AI-powered Resume Analysis
- AI Skill Gap Analysis
- AI Interview Question Generation
- AI Learning Roadmap Generation

---

## ☁️ Cloud Services

- Cloudinary (File Storage)

---

## 🗄️ Database

- MongoDB Atlas

---

## 🔧 Development Tools

- Git
- GitHub
- VS Code
- Postman
- npm


---

# 📂 Project Structure

SkillForge/
│
├── skillForge/                 # React Frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   └── server.js
├── package.json
└── .env
│
├── README.md
└── .gitignore
```