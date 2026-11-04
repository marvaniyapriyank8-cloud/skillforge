import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import { adminApi } from '../../api/adminApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { formatDate, matchesQuery, plural } from '../../utils/format';

const PAGE_SIZE = 10;

export const AdminJobs = () => {
  const { data, loading, error, reload } = useFetch(() => adminApi.getAllJobs().then((res) => res.data.jobs ?? []));
  const [search, setSearch] = useState('');

  const all = data ?? [];
  const filtered = all.filter((j) => matchesQuery(search, j.title, j.company, j.location, j.recruiter?.fullName));
  const pager = usePagination(filtered, PAGE_SIZE, search);

  let body;
  if (loading) {
    body = <TableSkeleton />;
  } else if (error) {
    body = <ErrorState title="Couldn't load jobs" onRetry={reload} />;
  } else if (all.length === 0) {
    body = <EmptyState icon={Briefcase} title="No jobs posted yet" description="Jobs posted by recruiters will be listed here." />;
  } else {
    body = (
      <>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, company, location or recruiter…" className="mb-4 sm:max-w-md" />
        {filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No matching jobs" description="Try a different search term." />
        ) : (
          <>
            <TableCard>
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Job</Th>
                    <Th>Posted by</Th>
                    <Th>Location</Th>
                    <Th>Applicants</Th>
                    <Th>Posted</Th>
                  </tr>
                </thead>
                <tbody>
                  {pager.pageItems.map((job) => (
                    <Tr key={job._id}>
                      <Td>
                        <p className="font-medium text-fg">{job.title}</p>
                        <p className="text-fg-muted">{job.company}</p>
                      </Td>
                      <Td>{job.recruiter?.fullName || '—'}</Td>
                      <Td>{job.location}</Td>
                      <Td className="tabular-nums">{job.applicants?.length ?? 0}</Td>
                      <Td className="whitespace-nowrap">{formatDate(job.createdAt)}</Td>
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
      <PageHeader title="Jobs" description={data ? `${plural(all.length, 'job')} posted on the platform.` : 'All job postings.'} />
      {body}
    </>
  );
};
