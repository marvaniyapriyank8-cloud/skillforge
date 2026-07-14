import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, shine = false, ...props }) => (
  <div className={`glass rounded-2xl ${hover ? 'hover-card cursor-pointer' : ''} ${shine ? 'card-shine' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, color = 'indigo', change, subtitle }) => {
  const colors = {
    indigo: { grad: 'from-indigo-500/15 to-violet-500/5', border: 'border-indigo-500/20', icon: 'text-indigo-400', bg: 'bg-indigo-500/10', ring: 'shadow-indigo-500/10' },
    cyan:   { grad: 'from-cyan-500/15 to-sky-500/5',    border: 'border-cyan-500/20',    icon: 'text-cyan-400',   bg: 'bg-cyan-500/10',   ring: 'shadow-cyan-500/10' },
    green:  { grad: 'from-emerald-500/15 to-green-500/5',border: 'border-emerald-500/20',icon: 'text-emerald-400',bg: 'bg-emerald-500/10',ring: 'shadow-emerald-500/10' },
    pink:   { grad: 'from-pink-500/15 to-rose-500/5',   border: 'border-pink-500/20',   icon: 'text-pink-400',   bg: 'bg-pink-500/10',   ring: 'shadow-pink-500/10' },
    yellow: { grad: 'from-amber-500/15 to-yellow-500/5',border: 'border-amber-500/20',  icon: 'text-amber-400',  bg: 'bg-amber-500/10',  ring: 'shadow-amber-500/10' },
    purple: { grad: 'from-violet-500/15 to-purple-500/5',border: 'border-violet-500/20',icon: 'text-violet-400', bg: 'bg-violet-500/10', ring: 'shadow-violet-500/10' },
  };
  const c = colors[color] || colors.indigo;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-5 border ${c.border} hover-card card-shine bg-gradient-to-br ${c.grad} shadow-xl ${c.ring}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          {Icon && <Icon size={20} className={c.icon} />}
        </div>
        {change && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5 count-anim">{value}</div>
      <div className="text-xs font-medium text-white/40">{label}</div>
      {subtitle && <div className="text-xs text-white/25 mt-1">{subtitle}</div>}
    </motion.div>
  );
};
