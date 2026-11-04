import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Code2, ExternalLink, FolderGit2, Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch';
import { useConfirm } from '../../hooks/useConfirm';
import { projectApi } from '../../api/projectApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button, IconButton } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { errorMessage, plural } from '../../utils/format';

const urlRule = {
  validate: (v) => !v || /^https?:\/\/\S+\.\S+/.test(v.trim()) || 'Enter a full URL starting with https://',
};

export const StudentProjects = () => {
  const { data: projects, loading, error, reload } = useFetch(() =>
    projectApi.getProjects().then((res) => res.data.projects ?? [])
  );
  const { confirm, dialog } = useConfirm();
  const [modal, setModal] = useState({ open: false, project: null });
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const openAdd = () => {
    reset({ title: '', description: '', githubLink: '', liveDemo: '' });
    setTechStack([]);
    setTechInput('');
    setModal({ open: true, project: null });
  };
  const openEdit = (p) => {
    reset({ title: p.title, description: p.description, githubLink: p.githubLink ?? '', liveDemo: p.liveDemo ?? '' });
    setTechStack(p.techStack ?? []);
    setTechInput('');
    setModal({ open: true, project: p });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));

  const addTech = (value) => {
    const items = value.split(',').map((t) => t.trim()).filter(Boolean);
    if (items.length) setTechStack((prev) => [...new Set([...prev, ...items])]);
    setTechInput('');
  };
  const onTechKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech(techInput);
    } else if (e.key === 'Backspace' && !techInput && techStack.length) {
      setTechStack((prev) => prev.slice(0, -1));
    }
  };

  const onSubmit = async (form) => {
    // Include anything still typed in the tech field
    const pending = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      githubLink: form.githubLink.trim(),
      liveDemo: form.liveDemo.trim(),
      techStack: [...new Set([...techStack, ...pending])],
    };
    try {
      if (modal.project) {
        await projectApi.updateProject(modal.project._id, payload);
        toast.success('Project updated');
      } else {
        await projectApi.addProject(payload);
        toast.success('Project added');
      }
      close();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save the project'));
    }
  };

  const onDelete = async (project) => {
    const ok = await confirm({
      title: `Delete "${project.title}"?`,
      description: 'This project will be permanently removed from your profile.',
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      await projectApi.deleteProject(project._id);
      toast.success('Project deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the project'));
    }
  };

  const header = (
    <PageHeader
      title="Projects"
      description={projects ? `${plural(projects.length, 'project')} on your profile.` : 'The projects on your profile.'}
      actions={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Add project</Button>}
    />
  );

  let body;
  if (loading) {
    body = <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>;
  } else if (error) {
    body = <ErrorState title="Couldn't load your projects" onRetry={reload} />;
  } else if (projects.length === 0) {
    body = (
      <EmptyState
        icon={FolderGit2}
        title="No projects yet"
        description="Add things you've built, with links to the code and a live demo."
        action={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Add your first project</Button>}
      />
    );
  } else {
    body = (
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <li key={p._id}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-fg">{p.title}</h2>
                <div className="-mr-1.5 -mt-1 flex shrink-0">
                  <IconButton label={`Edit ${p.title}`} onClick={() => openEdit(p)}><Pencil size={15} aria-hidden="true" /></IconButton>
                  <IconButton label={`Delete ${p.title}`} variant="danger" onClick={() => onDelete(p)}><Trash2 size={15} aria-hidden="true" /></IconButton>
                </div>
              </div>
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-fg-muted">{p.description}</p>
              {p.techStack?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.techStack.map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
              )}
              {(p.githubLink || p.liveDemo) && (
                <div className="mt-auto flex gap-4 border-t border-line pt-4 text-sm">
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-fg-muted hover:text-fg">
                      <Code2 size={14} aria-hidden="true" /> Source
                    </a>
                  )}
                  {p.liveDemo && (
                    <a href={p.liveDemo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-brand-fg hover:underline">
                      <ExternalLink size={14} aria-hidden="true" /> Live demo
                    </a>
                  )}
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {header}
      {body}

      <Modal isOpen={modal.open} onClose={close} title={modal.project ? 'Edit project' : 'Add project'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input label="Title" placeholder="e.g. Task manager app" error={errors.title?.message} {...register('title', { required: 'Enter a title' })} />
          <Textarea label="Description" rows={4} placeholder="What does it do, and what did you build?" error={errors.description?.message} {...register('description', { required: 'Enter a description' })} />

          <div>
            <label htmlFor="tech-input" className="mb-1.5 block text-sm font-medium text-fg">
              Tech stack <span className="font-normal text-fg-subtle">(optional)</span>
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2 py-1.5 shadow-card focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25">
              {techStack.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-md bg-subtle py-0.5 pl-2 pr-1 text-xs font-medium text-fg">
                  {t}
                  <button type="button" onClick={() => setTechStack((prev) => prev.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="rounded p-0.5 text-fg-subtle hover:bg-line hover:text-fg">
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              ))}
              <input
                id="tech-input"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={onTechKey}
                onBlur={() => addTech(techInput)}
                placeholder={techStack.length ? '' : 'React, Node.js, MongoDB'}
                className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-fg-subtle">Press Enter or comma to add each technology.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="GitHub link" placeholder="https://github.com/…" optional error={errors.githubLink?.message} {...register('githubLink', urlRule)} />
            <Input label="Live demo" placeholder="https://…" optional error={errors.liveDemo?.message} {...register('liveDemo', urlRule)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{modal.project ? 'Save changes' : 'Add project'}</Button>
          </div>
        </form>
      </Modal>
      {dialog}
    </>
  );
};
