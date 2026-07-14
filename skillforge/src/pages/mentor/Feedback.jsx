import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { mentorApi } from '../../api/mentorApi';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

// Backend feedback model fields: student (ObjectId), type (resume|project|general), message
export const MentorFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    try {
      const { data } = await mentorApi.getFeedbacks();
      // backend: { success, feedbacks: [{ mentor, student: {fullName,email}, type, message }] }
      const list = data.feedbacks || [];
      setAllFeedbacks(list);
      setFeedbacks(list);
    } catch { toast.error('Failed to load feedback'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setFeedbacks(allFeedbacks); return; }
    setFeedbacks(allFeedbacks.filter(f =>
      f.student?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      f.student?.email?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, allFeedbacks]);

  const openAdd = () => { setEditing(null); reset({ type: 'general', message: '' }); setOpen(true); };
  const openEdit = (f) => {
    setEditing(f);
    reset({ student: f.student?._id, type: f.type, message: f.message });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    // Backend expects: { student (user id or email), type, message }
    try {
      if (editing) {
        await mentorApi.updateFeedback(editing._id, { type: data.type, message: data.message });
        toast.success('Feedback updated!');
      } else {
        await mentorApi.createFeedback(data);
        toast.success('Feedback sent!');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save feedback');
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    try { await mentorApi.deleteFeedback(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const typeColors = { resume: 'badge-info', project: 'badge-cyan', general: 'badge-success' };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Feedback</h1>
          <p className="text-white/40 text-sm mt-1">{feedbacks.length} feedback entries</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Feedback</Button>
      </motion.div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by student name..." />

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : feedbacks.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No feedback yet" description="Start reviewing students."
          action={<Button onClick={openAdd}><Plus size={16} /> Add Feedback</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {feedbacks.map((fb, i) => (
              <motion.div key={fb._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5 border border-white/6 hover-card group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                      {fb.student?.fullName?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      {/* backend: student.fullName */}
                      <div className="font-medium text-white text-sm">{fb.student?.fullName || 'Student'}</div>
                      <div className="text-xs text-white/40">{fb.student?.email}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(fb)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"><Pencil size={12} /></button>
                    <button onClick={() => deleteFeedback(fb._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
                {/* backend: type field (resume|project|general) */}
                <div className="mb-3">
                  <span className={`badge ${typeColors[fb.type] || 'badge-info'}`}>{fb.type}</span>
                </div>
                {/* backend: message field (not comment) */}
                <p className="text-sm text-white/60 leading-relaxed">{fb.message}</p>
                <div className="mt-3 text-xs text-white/25">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ''}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit Feedback' : 'Add Feedback'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!editing && (
            <Input label="Student ID or Email" placeholder="student@example.com"
              error={errors.student?.message}
              {...register('student', { required: 'Student required' })} />
          )}
          {/* backend enum: resume | project | general */}
          <Select label="Feedback Type" {...register('type', { required: true })}>
            <option value="general">General</option>
            <option value="resume">Resume</option>
            <option value="project">Project</option>
          </Select>
          {/* backend field: message (not comment) */}
          <Textarea label="Message" placeholder="Provide detailed, constructive feedback..."
            error={errors.message?.message}
            {...register('message', { required: 'Message required', minLength: { value: 10, message: 'Too short' } })}
            rows={5} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Send'} Feedback</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
