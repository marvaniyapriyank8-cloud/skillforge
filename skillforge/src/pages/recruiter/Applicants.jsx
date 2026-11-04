import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRecruiterData } from '../../hooks/useRecruiterData';
import { useConfirm } from '../../hooks/useConfirm';
import { usePagination } from '../../hooks/usePagination';
import { recruiterApi } from '../../api/recruiterApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { Tabs } from '../../components/ui/Tabs';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { errorMessage, formatDate, idOf, matchesQuery } from '../../utils/format';
import { APPLICATION_STATUSES } from '../../utils/ui';

const PAGE_SIZE = 10;

/** Status actions for one applicant; shared by the table row and the mobile card. */
const ApplicantActions = ({ app, busyId, onUpdate }) => (
  <>
    {app.status === 'Applied' && (
      <Button size="sm" variant="success" loading={busyId === app._id} onClick={() => onUpdate(app, 'Shortlisted')}>
        <Check size={14} aria-hidden="true" /> Shortlist
      </Button>
    )}
    {app.status === 'Shortlisted' && (
      <Button size="sm" loading={busyId === app._id} onClick={() => onUpdate(app, 'Selected')}>
        <Check size={14} aria-hidden="true" /> Select
      </Button>
    )}
    {(app.status === 'Applied' || app.status === 'Shortlisted') && (
      <Button size="sm" variant="danger-ghost" disabled={busyId === app._id} onClick={() => onUpdate(app, 'Rejected')}>
        <X size={14} aria-hidden="true" /> Reject
      </Button>
    )}
  </>
);

export const RecruiterApplicants = () => {
  const { data, loading, error, reload } = useRecruiterData();
  const { confirm, dialog } = useConfirm();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const jobs = data?.jobs ?? [];
  const applications = data?.applications ?? [];
  const jobFilter = params.get('job') || 'all';

  const inJob = applications.filter((a) => jobFilter === 'all' || idOf(a.job) === jobFilter);
  const filtered = inJob
    .filter((a) => (status === 'all' || a.status === status) && matchesQuery(search, a.student?.fullName, a.student?.email, a.job?.title))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pager = usePagination(filtered, PAGE_SIZE, `${status}|${search}|${jobFilter}`);

  const tabs = [
    { id: 'all', label: 'All', count: inJob.length },
    ...APPLICATION_STATUSES.map((s) => ({ id: s, label: s, count: inJob.filter((a) => a.status === s).length })),
  ];

  const changeJob = (value) => {
    setParams(value === 'all' ? {} : { job: value });
  };

  const updateStatus = async (app, next) => {
    if (next === 'Rejected') {
      const ok = await confirm({
        title: `Reject ${app.student?.fullName || 'this applicant'}?`,
        description: `Their application for ${app.job?.title || 'this job'} will be marked as rejected.`,
        confirmLabel: 'Reject',
      });
      if (!ok) return;
    }
    setBusyId(app._id);
    try {
      await recruiterApi.updateApplicantStatus(app._id, next);
      toast.success(`Marked as ${next.toLowerCase()}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update the application'));
    } finally {
      setBusyId(null);
    }
  };

  let body;
  if (loading) {
    body = <TableSkeleton />;
  } else if (error) {
    body = <ErrorState title="Couldn't load applicants" onRetry={reload} />;
  } else if (applications.length === 0) {
    body = <EmptyState icon={Users} title="No applicants yet" description="Applications to your jobs will appear here as students apply." />;
  } else {
    body = (
      <>
        <Tabs tabs={tabs} value={status} onChange={setStatus} label="Filter by status" className="mb-4" />
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_16rem]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or job…" />
          <Select aria-label="Filter by job" value={jobFilter} onChange={(e) => changeJob(e.target.value)}>
            <option value="all">All jobs</option>
            {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No matching applicants" description="Try a different status, job or search term." />
        ) : (
          <>
            <TableCard className="hidden md:block">
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Candidate</Th>
                    <Th>Applied for</Th>
                    <Th>Applied</Th>
                    <Th>Status</Th>
                    <Th><span className="sr-only">Actions</span></Th>
                  </tr>
                </thead>
                <tbody>
                  {pager.pageItems.map((app) => (
                    <Tr key={app._id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <Avatar name={app.student?.fullName} size="md" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-fg">{app.student?.fullName || 'Unknown'}</p>
                            <p className="truncate text-fg-muted">{app.student?.email}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <p className="text-fg">{app.job?.title}</p>
                        <p className="text-fg-muted">{app.job?.company}</p>
                      </Td>
                      <Td className="whitespace-nowrap">{formatDate(app.createdAt)}</Td>
                      <Td><StatusBadge status={app.status} /></Td>
                      <Td>
                        <div className="flex justify-end gap-2">
                          <ApplicantActions app={app} busyId={busyId} onUpdate={updateStatus} />
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableCard>

            <ul className="space-y-3 md:hidden">
              {pager.pageItems.map((app) => (
                <li key={app._id} className="rounded-xl border border-line bg-surface p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={app.student?.fullName} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-fg">{app.student?.fullName || 'Unknown'}</p>
                        <p className="truncate text-sm text-fg-muted">{app.student?.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-3 text-sm text-fg">{app.job?.title} <span className="text-fg-muted">· {app.job?.company}</span></p>
                  <p className="mt-0.5 text-xs text-fg-subtle">Applied {formatDate(app.createdAt)}</p>
                  {(app.status === 'Applied' || app.status === 'Shortlisted') && (
                    <div className="mt-3 flex gap-2 border-t border-line pt-3">
                      <ApplicantActions app={app} busyId={busyId} onUpdate={updateStatus} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Pagination page={pager.page} totalPages={pager.totalPages} onPageChange={pager.setPage} total={pager.total} pageSize={pager.pageSize} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader title="Applicants" description="Review candidates and move them through your hiring process." />
      {body}
      {dialog}
    </>
  );
};
