import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CircleCheck, Clock, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useRecruiterData } from '../../hooks/useRecruiterData';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader, StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton, StatSkeleton } from '../../components/ui/Skeleton';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { ChartTooltip } from '../../components/shared/ChartTooltip';
import { axisTick } from '../../components/shared/chartTheme';
import { firstName, formatDate, idOf } from '../../utils/format';

export const RecruiterDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { data, loading, error, reload } = useRecruiterData();

  const header = (
    <PageHeader
      title={`Welcome back, ${firstName(user?.name)}`}
      description="A summary of your job postings and applicants."
      actions={<Link to="/recruiter/jobs" className={buttonStyles({})}>Manage jobs</Link>}
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}</div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5"><Skeleton className="h-72 lg:col-span-3" /><Skeleton className="h-72 lg:col-span-2" /></div>
      </>
    );
  }
  if (error) return <>{header}<ErrorState onRetry={reload} /></>;

  const { jobs, applications } = data;
  const awaiting = applications.filter((a) => a.status === 'Applied').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;

  const perJob = jobs
    .map((job) => ({
      name: job.title.length > 22 ? `${job.title.slice(0, 21)}…` : job.title,
      full: job.title,
      applicants: applications.filter((a) => idOf(a.job) === job._id).length,
    }))
    .sort((a, b) => b.applicants - a.applicants)
    .slice(0, 8);

  const recent = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return (
    <>
      {header}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Jobs posted" value={jobs.length} icon={Briefcase} />
        <StatCard label="Total applicants" value={applications.length} icon={Users} />
        <StatCard label="Awaiting review" value={awaiting} icon={Clock} />
        <StatCard label="Shortlisted" value={shortlisted} icon={CircleCheck} />
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Briefcase}
            title="You haven't posted any jobs yet"
            description="Post your first opening and applicants will show up here."
            action={<Link to="/recruiter/jobs" className={buttonStyles({ size: 'sm' })}>Post a job</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader title="Applicants per job" description="Your most-applied-to openings." />
            <CardBody>
              <div style={{ height: Math.max(180, perJob.length * 44 + 20) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perJob} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={18}>
                    <CartesianGrid horizontal={false} stroke="var(--line)" />
                    <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={130} tick={axisTick} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'var(--subtle)' }} content={<ChartTooltip unit="applicants" />} />
                    <Bar dataKey="applicants" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              title="Recent applicants"
              action={
                <Link to="/recruiter/applicants" className="inline-flex items-center gap-1 text-sm font-medium text-brand-fg hover:underline">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              }
            />
            {recent.length === 0 ? (
              <EmptyState bordered={false} icon={Users} title="No applicants yet" description="Candidates who apply will appear here." />
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((app) => (
                  <li key={app._id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar name={app.student?.fullName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-fg">{app.student?.fullName || 'Unknown'}</p>
                      <p className="truncate text-xs text-fg-muted">{app.job?.title} · {formatDate(app.createdAt)}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </>
  );
};
