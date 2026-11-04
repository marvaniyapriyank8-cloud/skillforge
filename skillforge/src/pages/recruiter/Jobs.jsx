import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRecruiterData } from '../../hooks/useRecruiterData';
import { useConfirm } from '../../hooks/useConfirm';
import { usePagination } from '../../hooks/usePagination';
import { recruiterApi } from '../../api/recruiterApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Input, Textarea } from '../../components/ui/Input';
import { Button, IconButton } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { errorMessage, formatDate, idOf, matchesQuery, plural } from '../../utils/format';

const PAGE_SIZE = 10;
const parseSkills = (text) => [...new Set(text.split(',').map((s) => s.trim()).filter(Boolean))];

export const RecruiterJobs = () => {
  const { data, loading, error, reload } = useRecruiterData();
  const { confirm, dialog } = useConfirm();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, job: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const jobs = data?.jobs ?? [];
  const applications = data?.applications ?? [];
  const filtered = jobs.filter((j) => matchesQuery(search, j.title, j.company, j.location));
  const pager = usePagination(filtered, PAGE_SIZE, search);
  const countFor = (job) => applications.filter((a) => idOf(a.job) === job._id).length;

  const openAdd = () => {
    reset({ title: '', company: '', location: '', salary: '', description: '', skills: '' });
    setModal({ open: true, job: null });
  };
  const openEdit = (job) => {
    reset({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary ?? '',
      description: job.description,
      skills: (job.skillsRequired ?? []).join(', '),
    });
    setModal({ open: true, job });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));

  const onSubmit = async (form) => {
    // Send only the editable fields (never the populated recruiter/applicants objects).
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      salary: form.salary.trim(),
      description: form.description.trim(),
      skillsRequired: parseSkills(form.skills),
    };
    try {
      if (modal.job) {
        await recruiterApi.updateJob(modal.job._id, payload);
        toast.success('Job updated');
      } else {
        await recruiterApi.createJob(payload);
        toast.success('Job posted');
      }
      close();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save the job'));
    }
  };

  const onDelete = async (job) => {
    const count = countFor(job);
    const ok = await confirm({
      title: `Delete "${job.title}"?`,
      description: count > 0
        ? `This job and its ${plural(count, 'application')} will no longer be visible. This can't be undone.`
        : "This job posting will be removed. This can't be undone.",
      confirmLabel: 'Delete job',
    });
    if (!ok) return;
    try {
      await recruiterApi.deleteJob(job._id);
      toast.success('Job deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the job'));
    }
  };

  let body;
  if (loading) {
    body = <TableSkeleton />;
  } else if (error) {
    body = <ErrorState title="Couldn't load your jobs" onRetry={reload} />;
  } else if (jobs.length === 0) {
    body = (
      <EmptyState
        icon={Briefcase}
        title="No jobs posted yet"
        description="Create your first posting. Students will be able to find it and apply."
        action={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Post a job</Button>}
      />
    );
  } else {
    body = (
      <>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, company or location…" className="mb-4 sm:max-w-sm" />
        {filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No matching jobs" description="Try a different search term." />
        ) : (
          <>
            <TableCard>
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Job</Th>
                    <Th>Location</Th>
                    <Th>Applicants</Th>
                    <Th>Posted</Th>
                    <Th><span className="sr-only">Actions</span></Th>
                  </tr>
                </thead>
                <tbody>
                  {pager.pageItems.map((job) => {
                    const count = countFor(job);
                    return (
                      <Tr key={job._id}>
                        <Td>
                          <p className="font-medium text-fg">{job.title}</p>
                          <p className="text-fg-muted">{job.company}{job.salary ? ` · ${job.salary}` : ''}</p>
                        </Td>
                        <Td>{job.location}</Td>
                        <Td>
                          {count > 0 ? (
                            <Link to={`/recruiter/applicants?job=${job._id}`} className="font-medium text-brand-fg hover:underline">
                              {plural(count, 'applicant')}
                            </Link>
                          ) : (
                            <span className="text-fg-subtle">None yet</span>
                          )}
                        </Td>
                        <Td className="whitespace-nowrap">{formatDate(job.createdAt)}</Td>
                        <Td>
                          <div className="flex justify-end">
                            <IconButton label={`Edit ${job.title}`} onClick={() => openEdit(job)}><Pencil size={15} aria-hidden="true" /></IconButton>
                            <IconButton label={`Delete ${job.title}`} variant="danger" onClick={() => onDelete(job)}><Trash2 size={15} aria-hidden="true" /></IconButton>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableCard>
            <Pagination page={pager.page} totalPages={pager.totalPages} onPageChange={pager.setPage} total={pager.total} pageSize={pager.pageSize} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Manage jobs"
        description="Create, edit and remove your job postings."
        actions={<Button onClick={openAdd}><Plus size={16} aria-hidden="true" /> Post a job</Button>}
      />
      {body}

      <Modal isOpen={modal.open} onClose={close} title={modal.job ? 'Edit job' : 'Post a job'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Job title" placeholder="e.g. Frontend developer" error={errors.title?.message} {...register('title', { required: 'Enter a job title' })} />
            <Input label="Company" placeholder="Company name" error={errors.company?.message} {...register('company', { required: 'Enter the company name' })} />
            <Input label="Location" placeholder="City, or Remote" error={errors.location?.message} {...register('location', { required: 'Enter a location' })} />
            <Input label="Salary" placeholder="e.g. ₹6–9 LPA" optional {...register('salary')} />
          </div>
          <Textarea label="Description" rows={5} placeholder="Responsibilities, requirements and anything candidates should know." error={errors.description?.message} {...register('description', { required: 'Enter a description' })} />
          <Input label="Required skills" placeholder="React, Node.js, MongoDB" optional hint="Separate skills with commas." {...register('skills')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>{modal.job ? 'Save changes' : 'Post job'}</Button>
          </div>
        </form>
      </Modal>
      {dialog}
    </>
  );
};
