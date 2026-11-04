import { useState } from 'react';
import { Briefcase, Check, MapPin, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { usePagination } from '../../hooks/usePagination';
import { jobApi } from '../../api/jobApi';
import { applicationApi } from '../../api/applicationApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { errorMessage, formatDate, idOf, matchesQuery, plural } from '../../utils/format';

const PAGE_SIZE = 8;

const JobCard = ({ job, applied, applying, onApply }) => (
  <Card className="p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-4">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-subtle text-base font-semibold text-fg-muted">
          {(job.company || '?')[0].toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-fg">{job.title}</h2>
          <p className="text-sm text-fg-muted">{job.company}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" className="text-fg-subtle" />{job.location}</span>
            {job.salary && <span className="inline-flex items-center gap-1.5"><Wallet size={14} aria-hidden="true" className="text-fg-subtle" />{job.salary}</span>}
            <span className="text-fg-subtle">Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="shrink-0">
        {applied ? (
          <Badge variant="success" className="gap-1 py-1.5 pl-2.5 pr-3 text-[13px]">
            <Check size={14} aria-hidden="true" /> Applied
          </Badge>
        ) : (
          <Button onClick={() => onApply(job._id)} loading={applying} className="w-full sm:w-auto">Apply</Button>
        )}
      </div>
    </div>

    {job.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-fg-muted">{job.description}</p>}

    {job.skillsRequired?.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skillsRequired.map((s) => <Badge key={s}>{s}</Badge>)}
      </div>
    )}
  </Card>
);

export const StudentJobs = () => {
  const user = useAuthStore((s) => s.user);
  const { data: jobs, loading, error, reload } = useFetch(() => jobApi.getJobs().then((res) => res.data.jobs ?? []));
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [applying, setApplying] = useState(null);

  const filtered = (jobs ?? []).filter(
    (j) =>
      matchesQuery(search, j.title, j.company, (j.skillsRequired ?? []).join(' ')) &&
      matchesQuery(location, j.location)
  );
  const pager = usePagination(filtered, PAGE_SIZE, `${search}|${location}`);

  const apply = async (jobId) => {
  setApplying(jobId);

  try {
    await applicationApi.createApplication(jobId);

    toast.success('Application submitted');
    reload();
  } catch (err) {
    toast.error(errorMessage(err, 'Could not submit your application'));
  } finally {
    setApplying(null);
  }
};
  const hasApplied = (job) => (job.applicants ?? []).some((a) => idOf(a) === user?._id);

  let body;
  if (loading) {
    body = <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>;
  } else if (error) {
    body = <ErrorState title="Couldn't load jobs" onRetry={reload} />;
  } else if (jobs.length === 0) {
    body = <EmptyState icon={Briefcase} title="No jobs posted yet" description="New openings from recruiters will appear here. Check back soon." />;
  } else {
    body = (
      <>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_16rem]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, company or skill…" />
          <SearchBar value={location} onChange={setLocation} placeholder="Filter by location…" icon={MapPin} />
        </div>
        <p className="mb-3 text-sm text-fg-muted" aria-live="polite">{plural(filtered.length, 'job')}</p>
        {filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs match your filters" description="Try a different keyword or clear the location." />
        ) : (
          <>
            <ul className="space-y-4">
              {pager.pageItems.map((job) => (
                <li key={job._id}>
                  <JobCard job={job} applied={hasApplied(job)} applying={applying === job._id} onApply={apply} />
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
      <PageHeader title="Browse jobs" description="Search open positions and apply in one click." />
      {body}
    </>
  );
};
