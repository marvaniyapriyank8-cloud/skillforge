import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';

import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { NotFound } from './pages/NotFound';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { StudentDashboard } from './pages/student/Dashboard';
import { StudentProfile } from './pages/student/Profile';
import { StudentSkills } from './pages/student/Skills';
import { StudentProjects } from './pages/student/Projects';
import { ResumeCenter } from './pages/student/Resume';
import { StudentJobs } from './pages/student/Jobs';
import { StudentApplications } from './pages/student/Applications';

import { RecruiterDashboard } from './pages/recruiter/Dashboard';
import { RecruiterJobs } from './pages/recruiter/Jobs';
import { RecruiterApplicants } from './pages/recruiter/Applicants';

import { MentorDashboard } from './pages/mentor/Dashboard';
import { MentorFeedback } from './pages/mentor/Feedback';

import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminJobs } from './pages/admin/Jobs';

// Full-screen loader while checking auth on app start
const AppLoader = () => (
  <div className="min-h-screen mesh-bg flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center animate-pulse shadow-xl shadow-indigo-500/30">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L4.09 12.37a1 1 0 0 0 .77 1.63H12l-1 8 8.91-10.37A1 1 0 0 0 19 10h-7l1-8z" fill="white"/>
        </svg>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

function App() {
  const { token, fetchMe } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check if token is valid on app mount
    const init = async () => {
      if (token) await fetchMe();
      setInitializing(false);
    };
    init();
  }, []);

  if (initializing) return <AppLoader />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        duration: 3500,
        style: {
          background: 'rgba(10,10,20,0.95)',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          backdropFilter: 'blur(24px)',
          fontSize: '13.5px',
          fontWeight: '500',
          padding: '12px 16px',
        },
        success: { iconTheme: { primary: '#4ade80', secondary: '#0a0a14' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#0a0a14' } },
      }} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard"    element={<StudentDashboard />} />
            <Route path="/student/profile"      element={<StudentProfile />} />
            <Route path="/student/skills"       element={<StudentSkills />} />
            <Route path="/student/projects"     element={<StudentProjects />} />
            <Route path="/student/resume"       element={<ResumeCenter />} />
            <Route path="/student/jobs"         element={<StudentJobs />} />
            <Route path="/student/applications" element={<StudentApplications />} />
          </Route>
        </Route>

        {/* Recruiter */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/recruiter/dashboard"  element={<RecruiterDashboard />} />
            <Route path="/recruiter/jobs"       element={<RecruiterJobs />} />
            <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
          </Route>
        </Route>

        {/* Mentor */}
        <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/feedback"  element={<MentorFeedback />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
            <Route path="/admin/users"      element={<AdminUsers />} />
            <Route path="/admin/jobs"       element={<AdminJobs />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
