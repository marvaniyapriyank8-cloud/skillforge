import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Zap } from 'lucide-react';

export const NotFound = () => (
  <div className="min-h-screen auth-bg flex items-center justify-center p-6 relative">
    <div className="orb w-96 h-96 bg-indigo-600/12 top-0 right-0" />
    <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="text-center relative z-10 max-w-md">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/25 flex items-center justify-center mx-auto mb-6">
        <Zap size={28} className="text-indigo-400" />
      </div>
      <div className="text-8xl font-black gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-white/40 mb-8 leading-relaxed">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25">
            <Home size={15} /> Go Home
          </motion.button>
        </Link>
        <button onClick={() => window.history.back()}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 glass border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-semibold transition-colors">
            <ArrowLeft size={15} /> Go Back
          </motion.div>
        </button>
      </div>
    </motion.div>
  </div>
);
