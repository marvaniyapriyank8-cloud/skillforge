import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { TableSkeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const RoleBadge = ({ role }) => {
  const map = {
    admin: 'badge-danger',
    recruiter: 'badge-info',
    mentor: 'badge-success',
    student: 'badge-cyan',
  };
  return <span className={`badge ${map[role] || 'badge-info'}`}>{role}</span>;
};

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers();
      const list = data.users || [];
      setAllUsers(list);
      setUsers(list);
    } catch { toast.error('Failed to load users'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setUsers(allUsers); return; }
    setUsers(allUsers.filter(u =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, allUsers]);

  const toggleBlock = async (id, currentlyBlocked) => {
    try {
      // Backend now toggles: PUT /admin/block-user/:id
      await adminApi.blockUser(id);
      toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
      load();
    } catch { toast.error('Action failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-white/40 text-sm mt-1">{allUsers.length} registered users</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        {[
          ['Total', allUsers.length, 'text-white'],
          ['Students', allUsers.filter(u => u.role === 'student').length, 'text-cyan-400'],
          ['Recruiters', allUsers.filter(u => u.role === 'recruiter').length, 'text-indigo-400'],
          ['Blocked', allUsers.filter(u => u.isBlocked).length, 'text-red-400'],
        ].map(([label, val, color]) => (
          <div key={label} className="glass rounded-xl p-4 border border-white/6 text-center">
            <div className={`text-2xl font-bold ${color}`}>{val}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or role..." />

      {loading ? <TableSkeleton rows={6} /> : users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="No users match your search." />
      ) : (
        <div className="glass rounded-2xl border border-white/6 overflow-hidden">
          <table className="premium-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${user.isBlocked ? 'bg-red-500/30' : 'bg-gradient-to-br from-indigo-500 to-cyan-500'}`}>
                        {user.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className={`font-medium text-sm ${user.isBlocked ? 'text-white/40 line-through' : 'text-white'}`}>
                          {user.fullName}
                        </div>
                        <div className="text-xs text-white/40">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><RoleBadge role={user.role} /></td>
                  <td>
                    <span className="text-sm text-white/50">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td>
                    {user.isBlocked
                      ? <span className="badge badge-danger">Blocked</span>
                      : <span className="badge badge-success">Active</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                        variant={user.isBlocked ? 'success' : 'secondary'}
                        size="sm">
                        {user.isBlocked
                          ? <><CheckCircle2 size={12} /> Unblock</>
                          : <><Ban size={12} /> Block</>}
                      </Button>
                      <Button onClick={() => deleteUser(user._id)} variant="danger" size="sm">
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
