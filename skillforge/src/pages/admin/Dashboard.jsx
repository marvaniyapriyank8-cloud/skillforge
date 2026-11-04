import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, ClipboardList, ShieldOff, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFetch } from '../../hooks/useFetch';
import { adminApi } from '../../api/adminApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader, StatCard } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton, StatSkeleton } from '../../components/ui/Skeleton';
import { ChartTooltip } from '../../components/shared/ChartTooltip';
import { axisTick } from '../../components/shared/chartTheme';
import { formatDate } from '../../utils/format';
import { APPLICATION_STATUSES } from '../../utils/ui';

const ROLES = ['student', 'recruiter', 'mentor', 'admin'];
const STATUS_COLOR = {
  Applied: 'var(--chart-1)',
  Shortlisted: 'var(--chart-3)',
  Selected: 'var(--chart-2)',
  Rejected: 'var(--chart-4)',
};

const loadAdmin = async () => {
  const results = await Promise.allSettled([adminApi.getDashboard(), adminApi.getUsers(), adminApi.getAllApplications()]);
  if (results.every((r) => r.status === 'rejected')) throw results[0].reason;
  const [analytics, users, applications] = results.map((r) => (r.status === 'fulfilled' ? r.value.data : null));
  return {
    analytics: analytics?.analytics ?? null,
    users: users?.users ?? [],
    applications: applications?.applications ?? [],
  };
};

const ChartFrame = ({ height, children }) => (
  <div style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
  </div>
);

export const AdminDashboard = () => {
  const { data, loading, error, reload } = useFetch(loadAdmin);

  const header = <PageHeader title="Overview" description="Platform activity at a glance." />;

  if (loading) {
    return (
      <>
        {header}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}</div>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"><Skeleton className="h-72" /><Skeleton className="h-72" /></div>
      </>
    );
  }
  if (error) return <>{header}<ErrorState onRetry={reload} /></>;

  const { analytics, users, applications } = data;
  const byRole = ROLES.map((role) => ({ name: role[0].toUpperCase() + role.slice(1) + 's', value: users.filter((u) => u.role === role).length }));
  const byStatus = APPLICATION_STATUSES.map((status) => ({ name: status, value: applications.filter((a) => a.status === status).length }));
  const newest = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return (
    <>
      {header}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={analytics?.totalUsers ?? users.length} icon={Users} />
        <StatCard label="Jobs" value={analytics?.totalJobs ?? '—'} icon={Briefcase} />
        <StatCard label="Applications" value={analytics?.totalApplications ?? applications.length} icon={ClipboardList} />
        <StatCard label="Blocked accounts" value={users.filter((u) => u.isBlocked).length} icon={ShieldOff} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Users by role" />
          <CardBody>
            <ChartFrame height={240}>
              <BarChart data={byRole} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={36}>
                <CartesianGrid vertical={false} stroke="var(--line)" />
                <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--subtle)' }} content={<ChartTooltip unit="users" />} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartFrame>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Applications by status" />
          <CardBody>
            {applications.length === 0 ? (
              <EmptyState bordered={false} icon={ClipboardList} title="No applications yet" description="Status breakdown appears once students apply." />
            ) : (
              <ChartFrame height={240}>
                <BarChart data={byStatus} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barSize={36}>
                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'var(--subtle)' }} content={<ChartTooltip unit="applications" />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {byStatus.map((entry) => <Cell key={entry.name} fill={STATUS_COLOR[entry.name]} />)}
                  </Bar>
                </BarChart>
              </ChartFrame>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Newest users"
          action={
            <Link to="/admin/users" className="inline-flex items-center gap-1 text-sm font-medium text-brand-fg hover:underline">
              Manage users <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        {newest.length === 0 ? (
          <EmptyState bordered={false} icon={Users} title="No users yet" />
        ) : (
          <ul className="divide-y divide-line">
            {newest.map((u) => (
              <li key={u._id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={u.fullName} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{u.fullName}</p>
                  <p className="truncate text-xs text-fg-muted">{u.email}</p>
                </div>
                <span className="hidden text-xs text-fg-subtle sm:block">{formatDate(u.createdAt)}</span>
                <StatusBadge status={u.role} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
};
