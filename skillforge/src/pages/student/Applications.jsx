import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Building2, Trash2, MapPin, Calendar } from 'lucide-react';
import { applicationApi } from '../../api/applicationApi';
import { useAuthStore } from '../../store/authStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

// Backend status: "Applied" | "Shortlisted" | "Rejected" | "Selected"
const StatusBadge = ({ status }) => {
  const map = {
    Applied: 'badge-info',
    Shortlisted: 'badge-success',
    Rejected: 'badge-danger',
    Selected: 'badge-cyan',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
};

export const StudentApplications = () => {
  const { user } = useAuthStore();
  const [apps, setApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await applicationApi.getApplications();
      const list = data.applications || [];
      // Backend returns ALL applications - filter to current student only
      // student field is populated with { _id, fullName, email }
      const mine = list.filter(a =>
        a.student?._id === user?._id ||
        a.student?.email === user?.email
      );
      setAllApps(mine);
      setApps(mine);
    } catch { toast.error('Failed to load applications'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setApps(allApps); return; }
    setApps(allApps.filter(a =>
      a.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.company?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, allApps]);

  const withdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return;
    try {
      await applicationApi.withdrawApplication(id);
      toast.success('Application withdrawn');
      load();
    } catch { toast.error('Failed to withdraw'); }
  };

  const counts = {
    total: apps.length,
    applied: apps.filter(a => a.status === 'Applied').length,
    shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
    rejected: apps.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <p className="text-white/40 text-sm mt-1">Track your job applications</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        {[
          ['Total', counts.total, 'text-white'],
          ['Applied', counts.applied, 'text-indigo-400'],
          ['Shortlisted', counts.shortlisted, 'text-green-400'],
          ['Rejected', counts.rejected, 'text-red-400'],
        ].map(([label, val, color]) => (
          <div key={label} className="glass rounded-xl p-4 border border-white/6 text-center">
            <div className={`text-2xl font-bold ${color}`}>{val}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search company or role..." />

      {loading ? <TableSkeleton /> : apps.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No applications yet"
          description="Browse jobs and apply — they'll appear here." />
      ) : (
        <div className="glass rounded-2xl border border-white/6 overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Company & Role</th>
                <th>Location</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Building2 size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{app.job?.title || '—'}</div>
                        <div className="text-xs text-white/40">{app.job?.company || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-sm text-white/50">
                      <MapPin size={12} />{app.job?.location || '—'}
                    </span>
                  </td>
                  <td>
                    <span className="flex items-center gap-1 text-sm text-white/50">
                      <Calendar size={12} />
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    {app.status === 'Applied' && (
                      <Button onClick={() => withdraw(app._id)} variant="danger" size="sm">
                        <Trash2 size={12} /> Withdraw
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
