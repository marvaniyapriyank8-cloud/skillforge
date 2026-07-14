import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Briefcase, Users } from 'lucide-react';
import { recruiterApi } from '../../api/recruiterApi';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const RecruiterJobs = () => {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    try {
      const { data } = await recruiterApi.getJobs();
      // Filter to only this recruiter's jobs
      const all = data.jobs || [];
      const mine = all.filter(j => j.recruiter?._id === user?._id || j.recruiter === user?._id);
      setJobs(mine);  // backend: { success, jobs }
    } catch { toast.error('Failed to load jobs'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); reset({}); setOpen(true); };
  const openEdit = (j) => {
    setEditing(j);
    // Map skillsRequired array back to comma-separated string for the form
    reset({ ...j, skillsRequired: j.skillsRequired?.join(', ') });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    // Backend expects skillsRequired as array
    const payload = {
      ...data,
      skillsRequired: data.skillsRequired
        ? data.skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editing) {
        await recruiterApi.updateJob(editing._id, payload);
        toast.success('Job updated!');
      } else {
        await recruiterApi.createJob(payload);
        toast.success('Job posted!');
      }
      setOpen(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await recruiterApi.deleteJob(id); toast.success('Job deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Jobs</h1>
          <p className="text-white/40 text-sm mt-1">{jobs.length} postings</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Post Job</Button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs posted yet" description="Create your first job posting."
          action={<Button onClick={openAdd}><Plus size={16} /> Post First Job</Button>} />
      ) : (
        <AnimatePresence>
          {jobs.map((job, i) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-white/6 hover-card group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <p className="text-sm text-white/40 mt-0.5">{job.company} • {job.location}</p>
                    <p className="text-sm text-white/55 mt-2 line-clamp-2">{job.description}</p>
                    {/* backend field: skillsRequired */}
                    {job.skillsRequired?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skillsRequired.slice(0, 4).map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-xs text-white/40">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => openEdit(job)} variant="secondary" size="sm"><Pencil size={12} /></Button>
                    <Button onClick={() => deleteJob(job._id)} variant="danger" size="sm"><Trash2 size={12} /></Button>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Users size={13} />{job.applicants?.length || 0} applicants
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit Job' : 'Post New Job'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Job Title" placeholder="e.g. Frontend Engineer" error={errors.title?.message}
              {...register('title', { required: 'Title required' })} />
            <Input label="Company" placeholder="e.g. Acme Corp" error={errors.company?.message}
              {...register('company', { required: 'Company required' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" placeholder="Mumbai / Remote" error={errors.location?.message}
              {...register('location', { required: 'Location required' })} />
            <Input label="Salary (optional)" placeholder="e.g. ₹8-12 LPA" {...register('salary')} />
          </div>
          <Textarea label="Job Description" placeholder="Describe the role..." error={errors.description?.message}
            {...register('description', { required: 'Description required' })} rows={4} />
          {/* Backend field: skillsRequired */}
          <Input label="Skills Required (comma-separated)" placeholder="React, Node.js, MongoDB"
            {...register('skillsRequired')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Post'} Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
