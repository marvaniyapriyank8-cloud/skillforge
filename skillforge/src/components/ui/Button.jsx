import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/20',
    secondary: 'bg-white/5 hover:bg-white/8 text-white/80 hover:text-white border border-white/10 hover:border-white/18',
    danger: 'bg-red-500/10 hover:bg-red-500/18 text-red-400 border border-red-500/20 hover:border-red-500/35',
    success: 'bg-emerald-500/10 hover:bg-emerald-500/18 text-emerald-400 border border-emerald-500/20',
    ghost: 'hover:bg-white/5 text-white/50 hover:text-white',
    cyan: 'bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/20',
    purple: 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-lg shadow-violet-500/20',
  };
  const sizes = {
    xs: 'px-2.5 py-1 text-xs rounded-lg gap-1',
    sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3 text-sm rounded-2xl gap-2',
    xl: 'px-9 py-4 text-base rounded-2xl gap-2.5',
  };
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={13} className="animate-spin shrink-0" />}
      {children}
    </motion.button>
  );
};
