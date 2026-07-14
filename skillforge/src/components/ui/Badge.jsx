export const Badge = ({ children, variant = 'info', size = 'sm' }) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    cyan: 'badge-cyan',
    gray: 'bg-white/5 text-white/50 border border-white/10',
  };
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
};

export const StatusBadge = ({ status }) => {
  const map = {
    pending: { v: 'warning', label: 'Pending' },
    shortlisted: { v: 'success', label: 'Shortlisted' },
    rejected: { v: 'danger', label: 'Rejected' },
    applied: { v: 'info', label: 'Applied' },
    active: { v: 'success', label: 'Active' },
    blocked: { v: 'danger', label: 'Blocked' },
    student: { v: 'cyan', label: 'Student' },
    recruiter: { v: 'info', label: 'Recruiter' },
    mentor: { v: 'success', label: 'Mentor' },
    admin: { v: 'danger', label: 'Admin' },
  };
  const s = map[status?.toLowerCase()] || { v: 'gray', label: status };
  return <Badge variant={s.v}>{s.label}</Badge>;
};
