import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, ArrowRight } from 'lucide-react';
import { mentorApi } from '../../api/mentorApi';
import { StatCard } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const MentorDashboard = () => {
  const { user } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mentorApi.getFeedbacks()
      .then(({ data }) => setFeedbacks(data.feedbacks || []))
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  // Derive stats from feedbacks list
  const uniqueStudents = new Set(feedbacks.map(f => f.student?._id)).size;
  const recentFeedbacks = feedbacks.filter(f => {
    const d = new Date(f.createdAt);
    const week = new Date(); week.setDate(week.getDate() - 7);
    return d >= week;
  }).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">
          Mentor Dashboard
        </h1>
        <p className="text-white/40 text-sm mt-1">
          Welcome back, <span className="text-indigo-400">{user?.name}</span>
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Feedbacks" value={feedbacks.length} icon={MessageSquare} color="indigo" />
          <StatCard label="Students Helped" value={uniqueStudents} icon={Users} color="cyan" />
          <StatCard label="This Week" value={recentFeedbacks} icon={Clock} color="green" />
        </div>
      )}

      {/* Recent feedback list */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-white/6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Recent Feedback</h3>
          <Link to="/mentor/feedback" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {feedbacks.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">
            No feedback given yet.{' '}
            <Link to="/mentor/feedback" className="text-indigo-400 hover:text-indigo-300">Add your first →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.slice(0, 5).map((fb, i) => (
              <motion.div key={fb._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {fb.student?.fullName?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{fb.student?.fullName || 'Student'}</div>
                  <div className="text-xs text-white/40 truncate">{fb.message}</div>
                </div>
                <span className={`badge shrink-0 ${
                  fb.type === 'resume' ? 'badge-info' : fb.type === 'project' ? 'badge-cyan' : 'badge-success'
                }`}>{fb.type}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
