import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Filter, Building2, ChevronDown } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import { applicationApi } from '../../api/applicationApi';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const JobCard = ({ job, onApply, applying }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-5 border border-white/6 hover-card group">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
        <Building2 size={20} className="text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{job.title}</h3>
        <p className="text-sm text-white/50 mt-0.5">{job.company}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/40">
          <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
          {job.salary && <span>💰 {job.salary}</span>}
          <span className="flex items-center gap-1">
            <Clock size={11} />{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
          </span>
        </div>
        {job.skillsRequired?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skillsRequired.slice(0, 5).map(s => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-xs text-white/40">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/6">
      <span className="text-xs text-white/30">{job.applicants?.length || 0} applicants</span>
      <Button onClick={() => onApply(job._id)} size="sm" loading={applying === job._id}>
        Apply Now
      </Button>
    </div>
  </motion.div>
);

export const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await jobApi.getJobs();
      const list = data.jobs || [];
      setAllJobs(list);
      setJobs(list);
    } catch { toast.error('Failed to load jobs'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let filtered = allJobs;
    if (search) filtered = filtered.filter(j =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.skillsRequired?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
    if (locationFilter) filtered = filtered.filter(j =>
      j.location?.toLowerCase().includes(locationFilter.toLowerCase())
    );
    setJobs(filtered);
  }, [search, locationFilter, allJobs]);

  const applyJob = async (jobId) => {
    setApplying(jobId);
    try {
      // Step 1: Add student to job.applicants[]  (POST /jobs/apply/:id)
      await jobApi.applyJob(jobId);
      // Step 2: Create an Application document so it appears in /applications
      await applicationApi.createApplication(jobId);
      toast.success('Application submitted!');
      load(); // refresh applicant counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Browse Jobs</h1>
        <p className="text-white/40 text-sm mt-1">{jobs.length} opportunities available</p>
      </motion.div>

      <div className="flex gap-3">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search jobs, companies, skills..." />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white' : 'glass border-white/8 text-white/60 hover:text-white'}`}>
          <Filter size={14} /> Filters <ChevronDown size={14} className={showFilters ? 'rotate-180' : ''} />
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 border border-white/6 flex gap-4">
          <input value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
            placeholder="Filter by location..." className="input-field flex-1 text-sm" />
          <button onClick={() => { setLocationFilter(''); setSearch(''); }}
            className="text-sm text-white/40 hover:text-white px-3">Clear</button>
        </motion.div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your search or check back later." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map(job => <JobCard key={job._id} job={job} onApply={applyJob} applying={applying} />)}
        </div>
      )}
    </div>
  );
};
