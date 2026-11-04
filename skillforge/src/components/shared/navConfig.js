
import {
  LayoutDashboard, User, Code2, FolderGit2, FileText, Briefcase,
  ClipboardList, Users, MessageSquare,
} from 'lucide-react';

export const navConfig = {
  student: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'Profile' },
    { to: '/student/skills', icon: Code2, label: 'Skills' },
    { to: '/student/projects', icon: FolderGit2, label: 'Projects' },
    { to: '/student/resume', icon: FileText, label: 'Resume & AI tools' },
    { to: '/student/jobs', icon: Briefcase, label: 'Browse jobs' },
    { to: '/student/applications', icon: ClipboardList, label: 'Applications' },
    { to: '/student/feedback', icon: MessageSquare, label: 'Mentor Feedback' },
  ],

  recruiter: [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/jobs', icon: Briefcase, label: 'Manage jobs' },
    { to: '/recruiter/applicants', icon: Users, label: 'Applicants' },
  ],

  mentor: [
    { to: '/mentor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/mentor/feedback', icon: MessageSquare, label: 'Feedback' },
  ],

  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
  ],
};
