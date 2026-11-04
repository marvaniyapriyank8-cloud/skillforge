import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import { adminApi } from '../../api/adminApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { Tabs } from '../../components/ui/Tabs';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { formatDate, matchesQuery, plural } from '../../utils/format';
import { APPLICATION_STATUSES } from '../../utils/ui';

const PAGE_SIZE = 10;

export const AdminApplications = () => {
  const { data, loading, error, reload } = useFetch(() =>
    adminApi.getAllApplications().then((res) => res.data.applications ?? [])
  );
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const all = data ?? [];
  const filtered = all
    .filter((a) => (status === 'all' || a.status === status) && matchesQuery(search, a.student?.fullName, a.student?.email, a.job?.title, a.job?.company))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pager = usePagination(filtered, PAGE_SIZE, `${status}|${search}`);

  const tabs = [
    { id: 'all', label: 'All', count: all.length },
    ...APPLICATION_STATUSES.map((s) => ({ id: s, label: s, count: all.filter((a) => a.status === s).length })),
  ];

  let body;
  if (loading) {
    body = <TableSkeleton />;
  } else if (error) {
    body = <ErrorState title="Couldn't load applications" onRetry={reload} />;
  } else if (all.length === 0) {
    body = <EmptyState icon={ClipboardList} title="No applications yet" description="Applications submitted by students will be listed here." />;
  } else {
    body = (
      <>
        <Tabs tabs={tabs} value={status} onChange={setStatus} label="Filter by status" className="mb-4" />
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, job or company…" className="mb-4 sm:max-w-md" />
        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No matching applications" description="Try a different status or search term." />
        ) : (
          <>
            <TableCard>
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Student</Th>
                    <Th>Job</Th>
                    <Th>Location</Th>
                    <Th>Applied</Th>
                    <Th>Status</Th>
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
                        <p className="text-fg">{app.job?.title || 'Job removed'}</p>
                        <p className="text-fg-muted">{app.job?.company}</p>
                      </Td>
                      <Td>{app.job?.location || '—'}</Td>
                      <Td className="whitespace-nowrap">{formatDate(app.createdAt)}</Td>
                      <Td><StatusBadge status={app.status} /></Td>
                    </Tr>
                  ))}
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
      <PageHeader title="Applications" description={data ? `${plural(all.length, 'application')} across all jobs.` : 'All applications on the platform.'} />
      {body}
    </>
  );
};
