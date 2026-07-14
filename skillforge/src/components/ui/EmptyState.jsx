import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-indigo-400" />
      </div>
    )}
    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
    <p className="text-white/40 text-sm max-w-xs mb-6">{description}</p>
    {action}
  </motion.div>
);
