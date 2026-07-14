import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Briefcase, Users, CheckCircle2, Plus, ArrowRight } from 'lucide-react';
import { recruiterApi } from '../../api/recruiterApi';
import { StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const RecruiterDashboard = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([recruiterApi.getJobs(), recruiterApi.getApplicants()])
      .then(([jobRes, appRes]) => {
        if (jobRes.status === 'fulfilled') setJobs(jobRes.value.data.jobs || []);
        if (appRes.status === 'fulfilled') setApplicants(appRes.value.data.applications || []);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const shortlisted = applicants.filter(a => a.status === 'Shortlisted').length;

  // Chart: applicants per job
  const chartData = jobs.slice(0, 6).map(j => ({
    name: j.title.length > 15 ? j.title.slice(0, 15) + '…' : j.title,
    applicants: j.applicants?.length || 0,
  }));

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage your job postings and candidates</p>
        </div>
        <Link to="/recruiter/jobs"><Button><Plus size={16} /> Post Job</Button></Link>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Jobs Posted" value={jobs.length} icon={Briefcase} color="indigo" />
          <StatCard label="Total Applications" value={applicants.length} icon={Users} color="cyan" />
          <StatCard label="Shortlisted" value={shortlisted} icon={CheckCircle2} color="green" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Applicants per Job</h3>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e1e32', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                <Bar dataKey="applicants" fill="url(#barGrad)" radius={[6,6,0,0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">Post jobs to see analytics</div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/6">
          <h3 className="font-semibold text-white mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { to: '/recruiter/jobs', label: 'Manage job postings', icon: Briefcase },
              { to: '/recruiter/applicants', label: 'Review all applicants', icon: Users },
            ].map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center justify-between p-4 rounded-xl glass border border-white/6 hover-card group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Icon size={16} className="text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
