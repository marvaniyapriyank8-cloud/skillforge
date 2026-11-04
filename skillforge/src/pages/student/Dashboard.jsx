import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CircleCheck, ClipboardList, Circle, Code2, FolderGit2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { skillApi } from '../../api/skillApi';
import { projectApi } from '../../api/projectApi';
import { applicationApi } from '../../api/applicationApi';
import { jobApi } from '../../api/jobApi';
import { profileApi } from '../../api/profileApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader, StatCard } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton, StatSkeleton } from '../../components/ui/Skeleton';
import { buttonStyles } from '../../components/ui/buttonStyles';
import { firstName, formatDate } from '../../utils/format';
import { isOwnApplication } from '../../utils/ownership';
import { cn } from '../../utils/cn';

const loadDashboard = async (user) => {
  const results = await Promise.allSettled([
    skillApi.getSkills(),
    projectApi.getProjects(),
    applicationApi.getApplications(),
    jobApi.getJobs(),
    profileApi.getProfile(),
  ]);
  if (results.every((r) => r.status === 'rejected')) throw results[0].reason;
  const [skills, projects, applications, jobs, profile] = results.map((r) => (r.status === 'fulfilled' ? r.value.data : null));
  return {
    skills: skills?.skills ?? [],
    projects: projects?.projects ?? [],
    applications: (applications?.applications ?? []).filter((a) => isOwnApplication(a, user)),
    jobs: jobs?.jobs ?? [],
    profile: profile?.profile ?? null,
  };
};

const buildChecklist = ({ profile, skills, projects }) => [
  { label: 'Write a short bio', done: Boolean(profile?.bio?.trim()), to: '/student/profile' },
  { label: 'Add your college', done: Boolean(profile?.college?.trim()), to: '/student/profile' },
  { label: 'Link your GitHub', done: Boolean(profile?.socialLinks?.github?.trim()), to: '/student/profile' },
  { label: 'Add at least one skill', done: skills.length > 0, to: '/student/skills' },
  { label: 'Add a project', done: projects.length > 0, to: '/student/projects' },
  { label: 'Upload your resume', done: Boolean(profile?.resume), to: '/student/resume' },
];

export const StudentDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { data, loading, error, reload } = useFetch(() => loadDashboard(user));

  const header = (
    <PageHeader
      title={`Welcome back, ${firstName(user?.name)}`}
      description="An overview of your profile and applications."
      actions={<Link to="/student/jobs" className={buttonStyles({})}>Browse jobs</Link>}
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </>
    );
  }
  if (error) return <>{header}<ErrorState onRetry={reload} /></>;

  const { skills, projects, applications, jobs, profile } = data;
  const checklist = buildChecklist({ profile, skills, projects });
  const doneCount = checklist.filter((c) => c.done).length;
  const percent = Math.round((doneCount / checklist.length) * 100);
  const recent = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const latestJobs = [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <>
      {header}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Skills" value={skills.length} icon={Code2} />
        <StatCard label="Projects" value={projects.length} icon={FolderGit2} />
        <StatCard label="Applications" value={applications.length} icon={ClipboardList} />
        <StatCard label="Open jobs" value={jobs.length} icon={Briefcase} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent applications"
            action={
              applications.length > 0 && (
                <Link to="/student/applications" className="inline-flex items-center gap-1 text-sm font-medium text-brand-fg hover:underline">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )
            }
          />
          {recent.length === 0 ? (
            <EmptyState
              bordered={false}
              icon={ClipboardList}
              title="No applications yet"
              description="When you apply to a job, it will show up here with its current status."
              action={<Link to="/student/jobs" className={buttonStyles({ size: 'sm' })}>Find jobs</Link>}
            />
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((app) => (
                <li key={app._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{app.job?.title || 'Job removed'}</p>
                    <p className="truncate text-sm text-fg-muted">
                      {app.job?.company || '—'} · Applied {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Profile checklist" description={`${doneCount} of ${checklist.length} complete`} />
          <CardBody>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Profile completion"
              className="h-2 overflow-hidden rounded-full bg-subtle"
            >
              <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
            <ul className="mt-4 space-y-1">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-subtle"
                  >
                    {item.done ? (
                      <CircleCheck size={16} aria-hidden="true" className="shrink-0 text-success-fg" />
                    ) : (
                      <Circle size={16} aria-hidden="true" className="shrink-0 text-fg-subtle" />
                    )}
                    <span className={cn(item.done ? 'text-fg-subtle line-through' : 'text-fg')}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {latestJobs.length > 0 && (
        <Card className="mt-6">
          <CardHeader
            title="Latest jobs"
            action={
              <Link to="/student/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-brand-fg hover:underline">
                See all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
          />
          <ul className="divide-y divide-line">
            {latestJobs.map((job) => (
              <li key={job._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{job.title}</p>
                  <p className="truncate text-sm text-fg-muted">{job.company} · {job.location}</p>
                </div>
                <span className="shrink-0 text-xs text-fg-subtle">{formatDate(job.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
};
