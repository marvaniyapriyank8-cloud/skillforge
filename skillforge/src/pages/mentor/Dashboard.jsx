
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Clock,
  ArrowRight,
  UserRound,
  GraduationCap
} from 'lucide-react';
import { mentorApi } from '../../api/mentorApi';
import { StatCard } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const MentorDashboard = () => {
  const { user } = useAuthStore();

  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [studentsRes, feedbackRes] = await Promise.all([
          mentorApi.getStudents(),
          mentorApi.getFeedbacks()
        ]);

        setStudents(studentsRes.data.students || []);
        setFeedbacks(feedbackRes.data.feedbacks || []);
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentFeedbacks = feedbacks.filter((feedback) => {
    const date = new Date(feedback.createdAt);
    const week = new Date();
    week.setDate(week.getDate() - 7);
    return date >= week;
  }).length;

  return (
    <div className="space-y-8">

      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Mentor Dashboard
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Welcome back,{' '}
          <span className="text-indigo-600 font-medium">
            {user?.fullName || user?.name || 'Mentor'}
          </span>
        </p>
      </motion.div>

      {/* Statistics */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Assigned Students"
            value={students.length}
            icon={Users}
            color="indigo"
          />

          <StatCard
            label="Total Feedbacks"
            value={feedbacks.length}
            icon={MessageSquare}
            color="cyan"
          />

          <StatCard
            label="This Week"
            value={recentFeedbacks}
            icon={Clock}
            color="green"
          />
        </div>
      )}

      {/* Assigned Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <GraduationCap size={19} className="text-indigo-600" />
            My Assigned Students
          </h3>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No students assigned yet.
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                  <UserRound size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    {student.fullName}
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    {student.email}
                  </div>
                </div>

                <Link
                  to={`/mentor/students/${student._id}`}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  View Profile <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900">
            Recent Feedback
          </h3>

          <Link
            to="/mentor/feedback"
            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton />
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No feedback given yet.
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.slice(0, 5).map((feedback) => (
              <div
                key={feedback._id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {feedback.student?.fullName?.[0]?.toUpperCase() || 'S'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    {feedback.student?.fullName || 'Student'}
                  </div>

                  <div className="text-xs text-slate-500 truncate">
                    {feedback.message}
                  </div>
                </div>

                <span
                  className={`badge shrink-0 ${
                    feedback.type === 'resume'
                      ? 'badge-info'
                      : feedback.type === 'project'
                      ? 'badge-cyan'
                      : 'badge-success'
                  }`}
                >
                  {feedback.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
};
