import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Trash2, MapPin, Users, Calendar } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getAllJobs();
      setAll(data.jobs || []); setJobs(data.jobs || []);
    } catch { toast.error('Failed to load jobs'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setJobs(all); return; }
    setJobs(all.filter(j =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, all]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">All Jobs</h1>
        <p className="text-white/40 text-sm mt-1">{all.length} total job postings on the platform</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {[['Total Jobs', all.length, 'text-white'], ['Active', all.length, 'text-emerald-400'],
          ['Total Apps', all.reduce((s, j) => s + (j.applicants?.length || 0), 0), 'text-indigo-400']].map(([l, v, c]) => (
          <div key={l} className="glass rounded-xl p-4 border border-white/6 text-center">
            <div className={`text-2xl font-bold ${c}`}>{v}</div>
            <div className="text-xs text-white/35 mt-1">{l}</div>
          </div>
        ))}
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by title or company..." />
      {loading ? <TableSkeleton /> : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="No jobs match your search." />
      ) : (
        <div className="glass rounded-2xl border border-white/6 overflow-hidden">
          <table className="premium-table">
            <thead><tr><th>Job</th><th>Recruiter</th><th>Location</th><th>Applicants</th><th>Posted</th></tr></thead>
            <tbody>
              {jobs.map((job, i) => (
                <motion.tr key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Briefcase size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{job.title}</div>
                        <div className="text-xs text-white/35">{job.company}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-sm text-white/55">{job.recruiter?.fullName || '—'}</span></td>
                  <td><span className="flex items-center gap-1 text-sm text-white/50"><MapPin size={11} />{job.location}</span></td>
                  <td><span className="flex items-center gap-1 text-sm text-white/50"><Users size={11} />{job.applicants?.length || 0}</span></td>
                  <td><span className="text-sm text-white/40">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
