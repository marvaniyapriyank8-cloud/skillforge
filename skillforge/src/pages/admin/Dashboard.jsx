import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Briefcase, ClipboardList, Shield } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { StatCard } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#22d3ee', '#4ade80', '#f472b6'];

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([adminApi.getDashboard(), adminApi.getUsers()])
      .then(([analyticsRes, usersRes]) => {
        // backend /admin/analytics returns { success, analytics: { totalUsers, totalJobs, totalApplications } }
        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data.analytics);
        }
        if (usersRes.status === 'fulfilled') {
          setUsers(usersRes.value.data.users || []);
        }
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // Derive role distribution from users list
  const roleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length },
    { name: 'Recruiters', value: users.filter(u => u.role === 'recruiter').length },
    { name: 'Mentors', value: users.filter(u => u.role === 'mentor').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Shield size={18} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-sm">Platform overview & management</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* backend analytics fields: totalUsers, totalJobs, totalApplications */}
          <StatCard label="Total Users" value={analytics?.totalUsers ?? users.length} icon={Users} color="indigo" />
          <StatCard label="Total Jobs" value={analytics?.totalJobs ?? 0} icon={Briefcase} color="cyan" />
          <StatCard label="Applications" value={analytics?.totalApplications ?? 0} icon={ClipboardList} color="green" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Role distribution pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-white/6">
          <h3 className="font-semibold text-white mb-5">User Distribution</h3>
          {roleData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e1e32', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {roleData.map(({ name, value }, i) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-white/60 flex-1">{name}</span>
                    <span className="text-sm font-semibold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">No users yet</div>
          )}
        </motion.div>

        {/* Recent users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-white/6">
          <h3 className="font-semibold text-white mb-5">Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((u, i) => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {u.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{u.fullName}</div>
                  <div className="text-xs text-white/40 truncate">{u.email}</div>
                </div>
                <span className={`badge shrink-0 ${
                  u.role === 'admin' ? 'badge-danger' : u.role === 'recruiter' ? 'badge-info' :
                  u.role === 'mentor' ? 'badge-success' : 'badge-cyan'
                }`}>{u.role}</span>
              </div>
            ))}
            {users.length === 0 && <div className="text-center text-white/30 text-sm py-4">No users yet</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
