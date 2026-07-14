import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { recruiterApi } from '../../api/recruiterApi';
import { useAuthStore } from '../../store/authStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const map = {
    Applied: 'badge-info', Shortlisted: 'badge-success',
    Rejected: 'badge-danger', Selected: 'badge-cyan',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
};

export const RecruiterApplicants = () => {
  const { user } = useAuthStore();
  const [applicants, setApplicants] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [myJobIds, setMyJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.allSettled([
        recruiterApi.getJobs(),
        recruiterApi.getApplicants(),
      ]);

      let jobIds = new Set();
      if (jobsRes.status === 'fulfilled') {
        const jobs = jobsRes.value.data.jobs || [];
        // Filter to THIS recruiter's jobs using recruiter._id
        const myJobs = jobs.filter(j =>
          j.recruiter?._id === user?._id ||
          j.recruiter === user?._id
        );
        jobIds = new Set(myJobs.map(j => j._id));
        setMyJobIds(jobIds);
      }

      if (appsRes.status === 'fulfilled') {
        const allApps = appsRes.value.data.applications || [];
        // Only show applications for this recruiter's jobs
        const mine = allApps.filter(a =>
          jobIds.has(a.job?._id) || jobIds.has(a.job)
        );
        setAllApplicants(mine);
        setApplicants(mine);
      }
    } catch { toast.error('Failed to load applicants'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setApplicants(allApplicants); return; }
    setApplicants(allApplicants.filter(a =>
      a.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, allApplicants]);

  const updateStatus = async (appId, status) => {
    try {
      await recruiterApi.updateApplicantStatus(appId, status);
      toast.success(`Marked as ${status}`);
      load();
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Applicants</h1>
        <p className="text-white/40 text-sm mt-1">{applicants.length} applications for your jobs</p>
      </motion.div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or job title..." />

      {loading ? <TableSkeleton /> : applicants.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet"
          description="Applications to your jobs will appear here." />
      ) : (
        <div className="glass rounded-2xl border border-white/6 overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied For</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app, i) => (
                <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {app.student?.fullName?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{app.student?.fullName || '—'}</div>
                        <div className="text-xs text-white/40">{app.student?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-white">{app.job?.title || '—'}</div>
                    <div className="text-xs text-white/40">{app.job?.company}</div>
                  </td>
                  <td>
                    <span className="text-sm text-white/50">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td><StatusBadge status={app.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      {app.status === 'Applied' && (
                        <>
                          <Button onClick={() => updateStatus(app._id, 'Shortlisted')} variant="success" size="sm">
                            <CheckCircle2 size={12} /> Shortlist
                          </Button>
                          <Button onClick={() => updateStatus(app._id, 'Rejected')} variant="danger" size="sm">
                            <XCircle size={12} /> Reject
                          </Button>
                        </>
                      )}
                      {app.status === 'Shortlisted' && (
                        <Button onClick={() => updateStatus(app._id, 'Selected')} size="sm">
                          ✓ Select
                        </Button>
                      )}
                    </div>
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
