import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Code2, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFetch } from '../../hooks/useFetch';
import { useConfirm } from '../../hooks/useConfirm';
import { skillApi } from '../../api/skillApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button, IconButton } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { errorMessage, matchesQuery, plural } from '../../utils/format';
import { SKILL_LEVELS } from '../../utils/ui';
import { cn } from '../../utils/cn';

/** Three-step meter: Beginner = 1, Intermediate = 2, Advanced = 3. */
const LevelMeter = ({ level }) => {
  const filled = SKILL_LEVELS.indexOf(level) + 1;
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Level: ${level}`}>
      <div className="flex gap-1">
        {SKILL_LEVELS.map((l, i) => (
          <span key={l} className={cn('h-1.5 w-7 rounded-full', i < filled ? 'bg-brand' : 'bg-subtle')} />
        ))}
      </div>
      <span className="text-xs text-fg-muted">{level}</span>
    </div>
  );
};

export const StudentSkills = () => {
  const { data: skills, loading, error, reload } = useFetch(() =>
    skillApi.getSkills().then((res) => res.data.skills ?? [])
  );
  const { confirm, dialog } = useConfirm();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [modal, setModal] = useState({ open: false, skill: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const openAdd = () => {
    reset({ name: '', level: 'Beginner' });
    setModal({ open: true, skill: null });
  };
  const openEdit = (skill) => {
    reset({ name: skill.name, level: skill.level });
    setModal({ open: true, skill });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));

  const onSubmit = async (form) => {
    const payload = { name: form.name.trim(), level: form.level };
    try {
      if (modal.skill) {
        await skillApi.updateSkill(modal.skill._id, payload);
        toast.success('Skill updated');
      } else {
        await skillApi.addSkill(payload);
        toast.success('Skill added');
      }
      close();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save the skill'));
    }
  };

  const onDelete = async (skill) => {
    const ok = await confirm({
      title: `Remove "${skill.name}"?`,
      description: 'This skill will be removed from your profile.',
      confirmLabel: 'Remove',
    });
    if (!ok) return;
    try {
      await skillApi.deleteSkill(skill._id);
      toast.success('Skill removed');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not remove the skill'));
    }
  };

  const header = (
    <PageHeader
      title="Skills"
      description={skills ? `${plural(skills.length, 'skill')} on your profile.` : 'The skills on your profile.'}
      actions={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Add skill</Button>}
    />
  );

  let body;
  if (loading) {
    body = <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>;
  } else if (error) {
    body = <ErrorState title="Couldn't load your skills" onRetry={reload} />;
  } else if (skills.length === 0) {
    body = (
      <EmptyState
        icon={Code2}
        title="No skills yet"
        description="Add the languages, frameworks and tools you know. They're also used by the AI skill-gap tool."
        action={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Add your first skill</Button>}
      />
    );
  } else {
    const filtered = skills.filter((s) => matchesQuery(search, s.name) && (!level || s.level === level));
    body = (
      <>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <SearchBar value={search} onChange={setSearch} placeholder="Search skills…" className="sm:max-w-xs sm:flex-1" />
          <div className="sm:w-48">
            <Select aria-label="Filter by level" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All levels</option>
              {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={Code2} title="No matching skills" description="Try a different search or level." />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((skill) => (
              <li key={skill._id}>
                <Card className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{skill.name}</p>
                    <div className="mt-2.5"><LevelMeter level={skill.level} /></div>
                  </div>
                  <div className="-mr-1 -mt-1 flex shrink-0">
                    <IconButton label={`Edit ${skill.name}`} onClick={() => openEdit(skill)}><Pencil size={15} aria-hidden="true" /></IconButton>
                    <IconButton label={`Remove ${skill.name}`} variant="danger" onClick={() => onDelete(skill)}><Trash2 size={15} aria-hidden="true" /></IconButton>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <>
      {header}
      {body}

      <Modal isOpen={modal.open} onClose={close} title={modal.skill ? 'Edit skill' : 'Add skill'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="Skill name"
            placeholder="e.g. React"
            error={errors.name?.message}
            {...register('name', { required: 'Enter a skill name', validate: (v) => v.trim().length > 0 || 'Enter a skill name' })}
          />
          <Select label="Level" {...register('level', { required: true })}>
            {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{modal.skill ? 'Save changes' : 'Add skill'}</Button>
          </div>
        </form>
      </Modal>
      {dialog}
    </>
  );
};
