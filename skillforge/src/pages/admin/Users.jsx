
import { useState } from 'react';
import { Ban, CircleCheck, Trash2, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { useConfirm } from '../../hooks/useConfirm';
import { usePagination } from '../../hooks/usePagination';
import { adminApi } from '../../api/adminApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Input';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Table, TableCard, Td, Th, Tr } from '../../components/ui/Table';
import { errorMessage, formatDate, matchesQuery, plural } from '../../utils/format';

const PAGE_SIZE = 10;

const UserActions = ({ user, busyId, onToggleBlock, onRemove }) => (
  <>
    <Button size="sm" variant="secondary" disabled={busyId === user._id} onClick={() => onToggleBlock(user)}>
      {user.isBlocked ? <CircleCheck size={14} aria-hidden="true" /> : <Ban size={14} aria-hidden="true" />}
      {user.isBlocked ? 'Unblock' : 'Block'}
    </Button>
    <Button size="sm" variant="danger-ghost" disabled={busyId === user._id} onClick={() => onRemove(user)} aria-label={`Delete ${user.fullName}`}>
      <Trash2 size={14} aria-hidden="true" />
    </Button>
  </>
);

export const AdminUsers = () => {
  const me = useAuthStore((s) => s.user);
  const { data, loading, error, reload } = useFetch(() => adminApi.getUsers().then((res) => res.data.users ?? []));
  const { confirm, dialog } = useConfirm();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [busyId, setBusyId] = useState(null);

  const all = data ?? [];
  const mentors = all.filter((u) => u.role === 'mentor');

  const filtered = all.filter((u) =>
    (!role || u.role === role) && matchesQuery(search, u.fullName, u.email)
  );

  const pager = usePagination(filtered, PAGE_SIZE, `${search}|${role}`);

  const toggleBlock = async (user) => {
    const blocking = !user.isBlocked;

    const ok = await confirm({
      title: blocking ? `Block ${user.fullName}?` : `Unblock ${user.fullName}?`,
      description: blocking
        ? 'They will no longer be able to sign in or use the platform until unblocked.'
        : 'They will be able to sign in and use the platform again.',
      confirmLabel: blocking ? 'Block user' : 'Unblock user',
      variant: blocking ? 'danger' : 'primary',
    });

    if (!ok) return;

    setBusyId(user._id);

    try {
      const res = await adminApi.blockUser(user._id);
      toast.success(res.data?.message || (blocking ? 'User blocked' : 'User unblocked'));
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Action failed'));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (user) => {
    const ok = await confirm({
      title: `Delete ${user.fullName}?`,
      description: "This permanently deletes the account and can't be undone.",
      confirmLabel: 'Delete user',
    });

    if (!ok) return;

    setBusyId(user._id);

    try {
      await adminApi.deleteUser(user._id);
      toast.success('User deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the user'));
    } finally {
      setBusyId(null);
    }
  };

  const handleMentorChange = async (student, mentorId) => {
    const currentMentorId = student.assignedMentor?._id || '';

    if (currentMentorId === mentorId) return;

    const mentor = mentors.find((m) => m._id === mentorId);

    const ok = await confirm({
      title: mentorId
        ? currentMentorId ? 'Change assigned mentor?' : 'Assign mentor?'
        : 'Remove assigned mentor?',
      description: mentorId
        ? `${mentorId === currentMentorId ? '' : `${mentor?.fullName || 'Selected mentor'} will be assigned to ${student.fullName}.`}`
        : `The current mentor will be removed from ${student.fullName}.`,
      confirmLabel: mentorId ? 'Save assignment' : 'Remove mentor',
      variant: mentorId ? 'primary' : 'danger',
    });

    if (!ok) return;

    setBusyId(student._id);

    try {
      await adminApi.assignMentor(student._id, mentorId || null);
      toast.success(mentorId ? 'Mentor assigned successfully' : 'Mentor removed successfully');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update mentor assignment'));
    } finally {
      setBusyId(null);
    }
  };

  let body;

  if (loading) {
    body = <TableSkeleton rows={6} />;
  } else if (error) {
    body = <ErrorState title="Couldn't load users" onRetry={reload} />;
  } else if (all.length === 0) {
    body = <EmptyState icon={UsersIcon} title="No users yet" description="Registered users will be listed here." />;
  } else {
    body = (
      <>
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_12rem]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <Select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="mentor">Mentors</option>
            <option value="admin">Admins</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No matching users" description="Try a different search or role." />
        ) : (
          <>
            <TableCard className="hidden md:block">
              <Table minWidth={950}>
                <thead>
                  <tr>
                    <Th>User</Th>
                    <Th>Role</Th>
                    <Th>Mentor</Th>
                    <Th>Joined</Th>
                    <Th>Status</Th>
                    <Th><span className="sr-only">Actions</span></Th>
                  </tr>
                </thead>

                <tbody>
                  {pager.pageItems.map((u) => {
                    const isMe = u._id === me?._id;

                    return (
                      <Tr key={u._id}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <Avatar name={u.fullName} size="md" />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-fg">
                                {u.fullName} {isMe && <Badge variant="neutral" className="ml-1">You</Badge>}
                              </p>
                              <p className="truncate text-fg-muted">{u.email}</p>
                            </div>
                          </div>
                        </Td>

                        <Td><StatusBadge status={u.role} /></Td>

                        <Td>
                          {u.role === 'student' ? (
                            <Select
                              aria-label={`Assign mentor to ${u.fullName}`}
                              value={u.assignedMentor?._id || ''}
                              disabled={busyId === u._id || mentors.length === 0}
                              onChange={(e) => handleMentorChange(u, e.target.value)}
                            >
                              <option value="">No mentor assigned</option>
                              {mentors.map((mentor) => (
                                <option key={mentor._id} value={mentor._id}>
                                  {mentor.fullName}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <span className="text-sm text-fg-muted">—</span>
                          )}
                        </Td>

                        <Td className="whitespace-nowrap">{formatDate(u.createdAt)}</Td>

                        <Td><StatusBadge status={u.isBlocked ? 'Blocked' : 'Active'} /></Td>

                        <Td>
                          {!isMe && (
                            <div className="flex justify-end gap-2">
                              <UserActions
                                user={u}
                                busyId={busyId}
                                onToggleBlock={toggleBlock}
                                onRemove={remove}
                              />
                            </div>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableCard>

            <ul className="space-y-3 md:hidden">
              {pager.pageItems.map((u) => {
                const isMe = u._id === me?._id;

                return (
                  <li key={u._id} className="rounded-xl border border-line bg-surface p-4 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={u.fullName} size="md" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-fg">
                            {u.fullName} {isMe && <Badge variant="neutral" className="ml-1">You</Badge>}
                          </p>
                          <p className="truncate text-sm text-fg-muted">{u.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={u.role} />
                    </div>

                    {u.role === 'student' && (
                      <div className="mt-3">
                        <label className="mb-1 block text-sm font-medium text-fg">
                          Assigned mentor
                        </label>
                        <Select
                          aria-label={`Assign mentor to ${u.fullName}`}
                          value={u.assignedMentor?._id || ''}
                          disabled={busyId === u._id || mentors.length === 0}
                          onChange={(e) => handleMentorChange(u, e.target.value)}
                        >
                          <option value="">No mentor assigned</option>
                          {mentors.map((mentor) => (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.fullName}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-fg-subtle">
                      <span>Joined {formatDate(u.createdAt)}</span>
                      <StatusBadge status={u.isBlocked ? 'Blocked' : 'Active'} />
                    </div>

                    {!isMe && (
                      <div className="mt-3 flex gap-2 border-t border-line pt-3">
                        <UserActions
                          user={u}
                          busyId={busyId}
                          onToggleBlock={toggleBlock}
                          onRemove={remove}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <Pagination
              page={pager.page}
              totalPages={pager.totalPages}
              onPageChange={pager.setPage}
              total={pager.total}
              pageSize={pager.pageSize}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Users"
        description={data ? `${plural(all.length, 'registered user')}.` : 'Manage accounts on the platform.'}
      />
      {body}
      {dialog}
    </>
  );
};
