import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Code } from 'lucide-react';
import { skillApi } from '../../api/skillApi';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

// Backend enum: Beginner | Intermediate | Advanced
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const levelPct = { Beginner: 33, Intermediate: 66, Advanced: 100 };
const COLORS = [
  'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20',
  'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  'from-green-500/20 to-green-600/10 border-green-500/20',
  'from-pink-500/20 to-pink-600/10 border-pink-500/20',
  'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
  'from-purple-500/20 to-purple-600/10 border-purple-500/20',
];

export const StudentSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    try {
      const { data } = await skillApi.getSkills();
      setSkills(data.skills || []);   // backend: { success, skills: [] }
    } catch { toast.error('Failed to load skills'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); reset({ name: '', level: 'Beginner' }); setOpen(true); };
  const openEdit = (s) => { setEditing(s); reset({ name: s.name, level: s.level }); setOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await skillApi.updateSkill(editing._id, data);
        toast.success('Skill updated!');
      } else {
        await skillApi.addSkill(data);  // backend: POST /skills with { name, level }
        toast.success('Skill added!');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save skill');
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await skillApi.deleteSkill(id);
      toast.success('Skill removed');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = skills.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Skills</h1>
          <p className="text-white/40 text-sm mt-1">{skills.length} skills added</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Skill</Button>
      </motion.div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search skills..." />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Code} title="No skills yet" description="Add your first skill to stand out to recruiters."
          action={<Button onClick={openAdd}><Plus size={16} /> Add first skill</Button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((skill, i) => (
              <motion.div key={skill._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}
                className={`glass rounded-2xl p-5 border bg-gradient-to-br ${COLORS[i % COLORS.length]} hover-card group`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-white">{skill.name}</div>
                    <div className="text-xs text-white/40 mt-0.5">{skill.level}</div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteSkill(skill._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${levelPct[skill.level] || 50}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }} className="progress-fill" />
                </div>
                <div className="text-xs text-white/30 mt-1.5">{levelPct[skill.level] || 50}% proficiency</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Skill Name" placeholder="e.g. React.js" error={errors.name?.message}
            {...register('name', { required: 'Skill name is required' })} />
          <Select label="Proficiency Level" {...register('level', { required: true })}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Add'} Skill</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
