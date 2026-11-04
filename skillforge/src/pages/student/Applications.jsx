import { useState } from 'react';
import { ClipboardList, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { useConfirm } from '../../hooks/useConfirm';
import { usePagination } from '../../hooks/usePagination';
import { applicationApi } from '../../api/applicationApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { Tabs } from '../../components/ui/Tabs';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { errorMessage, formatDate, matchesQuery } from '../../utils/format';
import { isOwnApplication } from '../../utils/ownership';
import { APPLICATION_STATUSES } from '../../utils/ui';

const PAGE_SIZE = 10;

export const StudentApplications = () => {
  const user = useAuthStore((s) => s.user);
  const { data: applications, loading, error, reload } = useFetch(() =>
    applicationApi.getApplications().then((res) => (res.data.applications ?? []).filter((a) => isOwnApplication(a, user)))
  );
  const { confirm, dialog } = useConfirm();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const all = applications ?? [];
  const filtered = all
    .filter((a) => (status === 'all' || a.status === status) && matchesQuery(search, a.job?.title, a.job?.company))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pager = usePagination(filtered, PAGE_SIZE, `${status}|${search}`);

  const tabs = [
    { id: 'all', label: 'All', count: all.length },
    ...APPLICATION_STATUSES.map((s) => ({ id: s, label: s, count: all.filter((a) => a.status === s).length })),
  ];

  const withdraw = async (app) => {
    const ok = await confirm({
      title: 'Withdraw this application?',
      description: `Your application for ${app.job?.title || 'this job'} will be removed. You can apply again later.`,
      confirmLabel: 'Withdraw',
    });
    if (!ok) return;
    try {
      await applicationApi.withdrawApplication(app._id);
      toast.success('Application withdrawn');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not withdraw the application'));
    }
  };

  let body;
  if (loading) {
    body = <TableSkeleton />;
  } else if (error) {
    body = <ErrorState title="Couldn't load your applications" onRetry={reload} />;
  } else if (all.length === 0) {
    body = (
      <EmptyState
        icon={ClipboardList}
        title="No applications yet"
        description="Apply to a job and you'll be able to follow its progress here."
        action={<Link to="/student/jobs" className={buttonStyles({ size: 'sm' })}>Browse jobs</Link>}
      />
    );
  } else {
    body = (
      <>
        <Tabs tabs={tabs} value={status} onChange={setStatus} label="Filter by status" className="mb-4" />
        <SearchBar value={search} onChange={setSearch} placeholder="Search by job or company…" className="mb-4 sm:max-w-sm" />
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No matching applications" description="Try a different status or search term." />
        ) : (
          <>
            <TableCard className="hidden md:block">
              <Table minWidth={620}>
                <thead>
                  <tr>
                    <Th>Job</Th>
                    <Th>Location</Th>
                    <Th>Applied</Th>
                    <Th>Status</Th>
                    <Th><span className="sr-only">Actions</span></Th>
                  </tr>
                </thead>
                <tbody>
                  {pager.pageItems.map((app) => (
                    <Tr key={app._id}>
                      <Td>
                        <p className="font-medium text-fg">{app.job?.title || 'Job removed'}</p>
                        <p className="text-fg-muted">{app.job?.company || '—'}</p>
                      </Td>
                      <Td>{app.job?.location || '—'}</Td>
                      <Td className="whitespace-nowrap">{formatDate(app.createdAt)}</Td>
                      <Td><StatusBadge status={app.status} /></Td>
                      <Td className="text-right">
                        {app.status === 'Applied' && (
                          <Button variant="danger-ghost" size="sm" onClick={() => withdraw(app)}>
                            <Undo2 size={14} aria-hidden="true" /> Withdraw
                          </Button>
                        )}
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
                    <div className="min-w-0">
                      <p className="font-medium text-fg">{app.job?.title || 'Job removed'}</p>
                      <p className="text-sm text-fg-muted">{app.job?.company || '—'}{app.job?.location ? ` · ${app.job.location}` : ''}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-2 text-xs text-fg-subtle">Applied {formatDate(app.createdAt)}</p>
                  {app.status === 'Applied' && (
                    <div className="mt-3 border-t border-line pt-3">
                      <Button variant="danger-ghost" size="sm" onClick={() => withdraw(app)}>
                        <Undo2 size={14} aria-hidden="true" /> Withdraw
                      </Button>
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
      <PageHeader title="Applications" description="Track the status of every job you've applied to." />
      {body}
      {dialog}
    </>
  );
};
