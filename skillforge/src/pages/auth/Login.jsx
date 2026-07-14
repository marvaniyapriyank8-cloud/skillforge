import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const features = ['AI-powered resume analysis', 'Smart job matching', 'Mentor-led feedback', '10,000+ active students'];

export const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      const routes = { student: '/student/dashboard', recruiter: '/recruiter/dashboard', mentor: '/mentor/dashboard', admin: '/admin/dashboard' };
      navigate(routes[result.role] || '/');
    }
  };

  return (
    <div className="min-h-screen auth-bg flex overflow-hidden relative">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-indigo-600/12 -top-32 -left-32 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="orb w-[350px] h-[350px] bg-violet-600/10 bottom-0 right-1/4 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="orb w-[250px] h-[250px] bg-cyan-500/08 top-1/2 right-0 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Left panel */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[48%] p-14 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Zap size={19} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SkillForge</span>
        </div>

        {/* Hero text */}
        <div className="space-y-7">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-indigo-500/25 text-xs font-medium text-indigo-300 mb-5">
              <Sparkles size={11} className="text-yellow-400" />
              Trusted by 10,000+ professionals
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white leading-[1.08] tracking-tight mb-4">
              Forge Your<br />
              <span className="gradient-text">Dream Career</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-white/45 text-lg leading-relaxed max-w-md">
              Connect with top companies, get mentor guidance, and land your ideal role with AI-powered tools.
            </motion.p>
          </div>

          {/* Feature list */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="space-y-3">
            {features.map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-indigo-400" />
                </div>
                <span className="text-white/55 text-sm">{f}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            className="grid grid-cols-3 gap-3">
            {[['10K+', 'Students'], ['2K+', 'Companies'], ['95%', 'Placed']].map(([val, lab]) => (
              <div key={lab} className="glass rounded-xl p-3.5 border border-white/6 text-center hover-card">
                <div className="text-xl font-bold gradient-text">{val}</div>
                <div className="text-[10px] text-white/35 mt-0.5 font-medium uppercase tracking-wide">{lab}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-white/18 text-xs">© 2024 SkillForge Inc. All rights reserved.</p>
      </motion.div>

      {/* Right panel - form */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Zap size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">SkillForge</span>
          </div>

          {/* Card */}
          <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="mb-7">
              <h2 className="text-[26px] font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-white/40 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
                error={errors.email?.message}
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />

              <div className="relative">
                <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  icon={Lock} error={errors.password?.message}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
                  <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading}>
                Sign in <ArrowRight size={15} />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/8 text-center">
              <p className="text-white/35 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-5 mt-5">
            {['256-bit SSL', 'GDPR Compliant', 'No Spam'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-[10px] text-white/25">
                <CheckCircle2 size={10} className="text-emerald-500/60" /> {b}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
