import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Code2, FolderGit2, Briefcase, FileText, TrendingUp, ArrowRight, Zap, Clock, Sparkles, Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { StatCard } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { skillApi } from '../../api/skillApi';
import { projectApi } from '../../api/projectApi';
import { applicationApi } from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';

const activityData = [
  { day: 'Mon', views: 4 }, { day: 'Tue', views: 9 }, { day: 'Wed', views: 5 },
  { day: 'Thu', views: 14 }, { day: 'Fri', views: 8 }, { day: 'Sat', views: 19 }, { day: 'Sun', views: 11 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="glass-strong rounded-xl px-3 py-2 border border-white/10 text-xs">
      <div className="text-white/50 mb-0.5">{label}</div>
      <div className="font-bold text-indigo-300">{payload[0].value} views</div>
    </div>
  );
  return null;
};

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ skills: 0, projects: 0, applications: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([skillApi.getSkills(), projectApi.getProjects(), applicationApi.getApplications(), jobApi.getJobs()])
      .then(([s, p, a, j]) => {
        setStats({
          skills: s.status === 'fulfilled' ? (s.value.data.skills?.length || 0) : 0,
          projects: p.status === 'fulfilled' ? (p.value.data.projects?.length || 0) : 0,
          applications: a.status === 'fulfilled' ? (a.value.data.applications?.length || 0) : 0,
        });
        if (j.status === 'fulfilled') setJobs(j.value.data.jobs?.slice(0, 4) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-white/35 font-medium">{greeting}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Hey, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-white/35 text-sm mt-1">Here's your career progress overview</p>
          </div>
          <Link to="/student/resume">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 border border-indigo-400/20">
              <Sparkles size={14} /> AI Tools
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Skills Added" value={stats.skills} icon={Code2} color="indigo" change={stats.skills > 0 ? `${stats.skills} active` : undefined} />
          <StatCard label="Projects" value={stats.projects} icon={FolderGit2} color="cyan" />
          <StatCard label="Applications" value={stats.applications} icon={Briefcase} color="green" />
          <StatCard label="Resume AI" value="Ready" icon={FileText} color="purple" />
        </div>
      )}

      {/* Charts + quick actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-5 border border-white/7 lg:col-span-2 card-shine">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-semibold text-white text-sm">Profile Activity</div>
              <div className="text-xs text-white/35 mt-0.5">Profile views this week</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
              <TrendingUp size={11} /> +24%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views" stroke="#818cf8" strokeWidth={2.5} fill="url(#actGrad)" dot={false} activeDot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 border border-white/7">
          <div className="font-semibold text-white text-sm mb-4">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { to: '/student/skills',   icon: Code2,       label: 'Add Skill',    grad: 'from-indigo-500/15', border: 'border-indigo-500/20', iconC: 'text-indigo-400' },
              { to: '/student/projects', icon: FolderGit2,  label: 'Add Project',  grad: 'from-cyan-500/15',   border: 'border-cyan-500/20',   iconC: 'text-cyan-400' },
              { to: '/student/jobs',     icon: Briefcase,   label: 'Browse Jobs',  grad: 'from-emerald-500/15',border: 'border-emerald-500/20',iconC: 'text-emerald-400' },
              { to: '/student/resume',   icon: FileText,    label: 'Resume AI',    grad: 'from-violet-500/15', border: 'border-violet-500/20', iconC: 'text-violet-400' },
            ].map(({ to, icon: Icon, label, grad, border, iconC }) => (
              <Link key={to} to={to}>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className={`flex flex-col gap-2.5 p-3.5 rounded-xl border ${border} bg-gradient-to-br ${grad} to-transparent cursor-pointer transition-all`}>
                  <Icon size={18} className={iconC} />
                  <span className="text-xs font-semibold text-white/70 leading-tight">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent jobs */}
      {jobs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-white">Latest Opportunities</div>
              <div className="text-xs text-white/35 mt-0.5">Jobs posted recently</div>
            </div>
            <Link to="/student/jobs" className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="glass rounded-xl p-4 border border-white/7 hover-card card-shine group flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Briefcase size={15} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{job.title}</div>
                  <div className="text-xs text-white/35 truncate">{job.company} · {job.location}</div>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[10px] text-white/25">
                  <Clock size={10} />
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'New'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
