import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderOpen, GitBranch, ExternalLink } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

export const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = async () => {
    try {
      const { data } = await projectApi.getProjects();
      setProjects(data.projects || []);   // backend: { success, projects: [] }
    } catch { toast.error('Failed to load projects'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); reset({}); setTechStack([]); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    reset({ title: p.title, description: p.description, githubLink: p.githubLink, liveDemo: p.liveDemo });
    setTechStack(p.techStack || []);
    setOpen(true);
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      setTechStack(prev => [...new Set([...prev, techInput.trim()])]);
      setTechInput('');
    }
  };

  const onSubmit = async (data) => {
    // Backend field: liveDemo (not liveLink)
    const payload = { ...data, techStack };
    try {
      if (editing) {
        await projectApi.updateProject(editing._id, payload);
        toast.success('Project updated!');
      } else {
        await projectApi.addProject(payload);
        toast.success('Project added!');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await projectApi.deleteProject(id);
      toast.success('Project deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} projects</p>
        </div>
        <Button onClick={openAdd}><Plus size={16} /> Add Project</Button>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No projects yet" description="Add your first project to showcase your work."
          action={<Button onClick={openAdd}><Plus size={16} /> Add project</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {projects.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl border border-white/6 hover-card group overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <FolderOpen size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => deleteProject(p._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                  {p.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.techStack.slice(0, 4).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-xs text-white/50">{t}</span>
                      ))}
                      {p.techStack.length > 4 && <span className="text-xs text-white/30">+{p.techStack.length - 4}</span>}
                    </div>
                  )}
                  <div className="flex gap-4 pt-3 border-t border-white/6">
                    {p.githubLink && (
                      <a href={p.githubLink} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
                        <GitBranch size={12} /> Code
                      </a>
                    )}
                    {p.liveDemo && (   /* backend field: liveDemo */
                      <a href={p.liveDemo} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        <ExternalLink size={12} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Project Title" placeholder="e.g. E-Commerce Platform" error={errors.title?.message}
            {...register('title', { required: 'Title required' })} />
          <Textarea label="Description" placeholder="What did you build? What problem does it solve?" error={errors.description?.message}
            {...register('description', { required: 'Description required' })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="GitHub Link" placeholder="https://github.com/..." {...register('githubLink')} />
            <Input label="Live Demo" placeholder="https://yourapp.com" {...register('liveDemo')} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">Tech Stack <span className="text-white/30 text-xs">(press Enter to add)</span></label>
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech}
              placeholder="React, Node.js, MongoDB..." className="input-field" />
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map(t => (
                  <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400">
                    {t}
                    <button type="button" onClick={() => setTechStack(ts => ts.filter(x => x !== t))} className="hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" className="flex-1">{editing ? 'Update' : 'Add'} Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
