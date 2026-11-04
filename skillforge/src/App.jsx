import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { ScrollToTop } from './routes/ScrollToTop';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LogoMark } from './components/ui/Logo';

// Each page is its own chunk, so the first load only downloads what it needs
// (the charting library, for example, is only fetched by dashboards).
const page = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const Landing = page(() => import('./pages/Landing'), 'Landing');
const Login = page(() => import('./pages/auth/Login'), 'Login');
const Register = page(() => import('./pages/auth/Register'), 'Register');
const NotFound = page(() => import('./pages/NotFound'), 'NotFound');

const StudentDashboard = page(() => import('./pages/student/Dashboard'), 'StudentDashboard');
const StudentProfile = page(() => import('./pages/student/Profile'), 'StudentProfile');
const StudentSkills = page(() => import('./pages/student/Skills'), 'StudentSkills');
const StudentProjects = page(() => import('./pages/student/Projects'), 'StudentProjects');
const ResumeCenter = page(() => import('./pages/student/Resume'), 'ResumeCenter');
const StudentJobs = page(() => import('./pages/student/Jobs'), 'StudentJobs');
const StudentApplications = page(() => import('./pages/student/Applications'), 'StudentApplications');
const StudentFeedback = page(() => import('./pages/student/Feedback'), 'StudentFeedback');

const RecruiterDashboard = page(() => import('./pages/recruiter/Dashboard'), 'RecruiterDashboard');
const RecruiterJobs = page(() => import('./pages/recruiter/Jobs'), 'RecruiterJobs');
const RecruiterApplicants = page(() => import('./pages/recruiter/Applicants'), 'RecruiterApplicants');

const MentorDashboard = page(() => import('./pages/mentor/Dashboard'), 'MentorDashboard');
const MentorFeedback = page(() => import('./pages/mentor/Feedback'), 'MentorFeedback');
import { MentorStudentProfile } from './pages/mentor/StudentProfile';

const AdminDashboard = page(() => import('./pages/admin/Dashboard'), 'AdminDashboard');
const AdminUsers = page(() => import('./pages/admin/Users'), 'AdminUsers');
const AdminJobs = page(() => import('./pages/admin/Jobs'), 'AdminJobs');
const AdminApplications = page(() => import('./pages/admin/Applications'), 'AdminApplications');

// Full-screen loader while the saved session is verified / a page chunk loads
const AppLoader = () => (
  <div role="status" aria-label="Loading" className="flex min-h-screen items-center justify-center bg-canvas">
    <LogoMark size={36} className="animate-pulse" />
  </div>
);

const toastOptions = {
  duration: 3500,
  style: {
    background: 'var(--surface)',
    color: 'var(--fg)',
    border: '1px solid var(--line)',
    borderRadius: '10px',
    boxShadow: 'var(--shadow-pop)',
    fontSize: '14px',
    fontWeight: 500,
    padding: '10px 14px',
  },
  success: { iconTheme: { primary: 'var(--success-fg)', secondary: 'var(--surface)' } },
  error: { iconTheme: { primary: 'var(--danger-fg)', secondary: 'var(--surface)' } },
};

function App() {
  const [initializing, setInitializing] = useState(true);

  // Verify the persisted session once on startup
  useEffect(() => {
    const { token, fetchMe } = useAuthStore.getState();
    Promise.resolve(token ? fetchMe() : null).then(() => setInitializing(false));
  }, []);

  if (initializing) return <AppLoader />;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={toastOptions} />

      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Signed-in users are redirected to their dashboard */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/skills" element={<StudentSkills />} />
              <Route path="/student/projects" element={<StudentProjects />} />
              <Route path="/student/resume" element={<ResumeCenter />} />
              <Route path="/student/jobs" element={<StudentJobs />} />
              <Route path="/student/applications" element={<StudentApplications />} />
              <Route path="/student/feedback" element={<StudentFeedback />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
              <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/mentor/feedback" element={<MentorFeedback />} />
              <Route path="/mentor/students/:id" element={<MentorStudentProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              {/* Old sidebar link – kept so bookmarks don't hit a 404 */}
              <Route path="/admin/analytics" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
