import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap, ArrowRight, GraduationCap, Building2, Star, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const roles = [
  { value: 'student',   icon: GraduationCap, label: 'Student',   desc: 'Find jobs & grow',    color: 'cyan' },
  { value: 'recruiter', icon: Building2,      label: 'Recruiter', desc: 'Hire top talent',     color: 'indigo' },
  { value: 'mentor',    icon: Star,           label: 'Mentor',    desc: 'Guide & review',      color: 'violet' },
];

const roleColorMap = {
  cyan:   { active: 'border-cyan-500/50 bg-cyan-500/8',   icon: 'text-cyan-400',   dot: 'bg-cyan-400' },
  indigo: { active: 'border-indigo-500/50 bg-indigo-500/8', icon: 'text-indigo-400', dot: 'bg-indigo-400' },
  violet: { active: 'border-violet-500/50 bg-violet-500/8', icon: 'text-violet-400', dot: 'bg-violet-400' },
};

export const Register = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await registerUser({ ...data, role: selectedRole });
    if (result.success) {
      const routes = { student: '/student/dashboard', recruiter: '/recruiter/dashboard', mentor: '/mentor/dashboard' };
      navigate(routes[result.role] || '/');
    }
  };

  return (
    <div className="min-h-screen auth-bg flex overflow-hidden relative">
      <div className="orb w-[400px] h-[400px] bg-violet-600/12 -top-20 right-0 animate-pulse" style={{ animationDuration: '7s' }} />
      <div className="orb w-[300px] h-[300px] bg-indigo-500/10 bottom-0 left-0 animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

      {/* Left */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Zap size={19} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SkillForge</span>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-3">
              Join the Future<br />of <span className="gradient-text">Hiring</span>
            </h1>
            <p className="text-white/45 leading-relaxed">
              Whether you're starting your career, building a team, or guiding the next generation — SkillForge has the tools for you.
            </p>
          </div>
          <div className="space-y-3">
            {['Free forever for students', 'AI-powered career insights', 'Direct recruiter connections', 'Expert mentor network'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/25 to-violet-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-indigo-400" />
                </div>
                <span className="text-white/55 text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
          {/* Testimonial */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-5 border border-white/8 card-shine">
            <p className="text-white/55 text-sm leading-relaxed italic">
              "SkillForge helped me land a SDE role at a top startup within 6 weeks of joining. The AI resume analysis was a game-changer."
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">P</div>
              <div>
                <div className="text-xs font-semibold text-white">Priya Sharma</div>
                <div className="text-[10px] text-white/35">SDE — Zepto</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
              </div>
            </div>
          </motion.div>
        </div>
        <p className="text-white/18 text-xs">© 2024 SkillForge Inc.</p>
      </motion.div>

      {/* Right - form */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-5 relative z-10 overflow-y-auto">
        <div className="w-full max-w-[430px] my-6">
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Zap size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">SkillForge</span>
          </div>

          <div className="glass-strong rounded-3xl p-7 border border-white/10 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Create account</h2>
              <p className="text-white/40 text-sm mt-1">Start building your future today — free</p>
            </div>

            {/* Role selector */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5 block">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, icon: Icon, label, desc, color }) => {
                  const rc = roleColorMap[color];
                  const isActive = selectedRole === value;
                  return (
                    <motion.button key={value} type="button" whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedRole(value)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${isActive ? rc.active : 'border-white/8 hover:border-white/15 bg-white/2 hover:bg-white/4'}`}>
                      {isActive && <div className={`absolute top-0 left-0 right-0 h-0.5 ${rc.dot}`} />}
                      <Icon size={18} className={`mb-2 ${isActive ? rc.icon : 'text-white/25'}`} />
                      <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-white/45'}`}>{label}</div>
                      <div className="text-[10px] text-white/25 mt-0.5 leading-tight">{desc}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <Input label="Full name" placeholder="John Doe" icon={User} error={errors.name?.message}
                {...register('name', { required: 'Name required', minLength: { value: 2, message: 'Too short' } })} />
              <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail} error={errors.email?.message}
                {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
              <div className="relative">
                <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  icon={Lock} error={errors.password?.message}
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <Input label="Confirm password" type="password" placeholder="Repeat password" icon={Lock}
                error={errors.confirm?.message}
                {...register('confirm', { required: 'Please confirm', validate: v => v === watch('password') || 'Passwords do not match' })} />

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded accent-indigo-500 shrink-0" />
                  <span className="text-xs text-white/35 leading-relaxed">
                    I agree to the{' '}
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Privacy Policy</span>
                  </span>
                </label>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isLoading}>
                Create account <ArrowRight size={15} />
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-white/8 text-center">
              <p className="text-white/35 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
