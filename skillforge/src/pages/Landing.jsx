import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap, ArrowRight, Star, Users, Briefcase, Code, TrendingUp,
  Shield, Brain, ChevronDown, GitBranch, Share2, Link2,
  GraduationCap, Building2, CheckCircle2
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Matching', desc: 'Our algorithm matches your skills to roles with 95% accuracy using cutting-edge ML models.' },
  { icon: Shield, title: 'Verified Profiles', desc: 'Every recruiter and mentor is verified. Your data stays private and secure.' },
  { icon: TrendingUp, title: 'Skill Analytics', desc: 'Visual dashboards show your growth, gaps, and what to learn next.' },
  { icon: Code, title: 'Resume AI', desc: 'Upload your resume and get instant analysis, scoring, and improvement tips.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'SDE at Google', text: 'SkillForge helped me identify gaps in my profile and land my dream job in 3 months.', avatar: 'PS' },
  { name: 'Arjun Mehta', role: 'HR Lead, Zepto', text: 'We reduced time-to-hire by 60%. The candidate quality is exceptional.', avatar: 'AM' },
  { name: 'Neha Patel', role: 'Full Stack Dev', text: 'The mentor feedback was game-changing. Got 5 interviews in my first week.', avatar: 'NP' },
];

const stats = [
  { value: '10K+', label: 'Active Students', icon: GraduationCap },
  { value: '2K+', label: 'Companies Hiring', icon: Building2 },
  { value: '95%', label: 'Placement Rate', icon: CheckCircle2 },
  { value: '500+', label: 'Expert Mentors', icon: Star },
];

export const Landing = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen animated-bg text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 inset-x-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">SkillForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Sign in</Link>
            <Link to="/register"
              className="btn-primary text-sm px-5 py-2 rounded-xl">
              Get started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="orb w-[600px] h-[600px] bg-indigo-600/20 top-[-100px] left-[-100px]" />
        <div className="orb w-[400px] h-[400px] bg-cyan-500/15 bottom-[-50px] right-[-50px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMC0yIDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />

        <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-sm text-indigo-300 mb-8"
          >
            <Star size={14} className="text-yellow-400" />
            <span>Rated #1 Career Platform for Students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6"
          >
            Build Your Skills.<br />
            <span className="gradient-text">Land Your Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SkillForge connects ambitious students with top companies through AI-powered matching, mentor guidance, and intelligent resume analysis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-xl shadow-indigo-500/20">
              Start for free <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn-secondary text-base px-8 py-3.5 rounded-xl flex items-center gap-2">
              See how it works <ChevronDown size={18} />
            </a>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="glass-strong rounded-3xl border border-white/10 p-6 shadow-2xl shadow-black/50">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {stats.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="glass rounded-2xl p-4 text-center">
                    <Icon size={20} className="text-indigo-400 mx-auto mb-2" />
                    <div className="text-xl font-bold gradient-text">{value}</div>
                    <div className="text-xs text-white/30 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['React Developer', 'UX Designer', 'Data Analyst'].map((role, i) => (
                  <div key={role} className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 flex items-center justify-center">
                      <Briefcase size={14} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">{role}</div>
                      <div className="text-[10px] text-white/30">{12 + i * 3} openings</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] text-cyan-400 font-semibold">{88 + i}% match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-white/6 hover-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-indigo-400" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-sm text-white/40">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-3">Why SkillForge</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for the modern job market</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">Tools that give you a real edge — not just another job board.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-7 border border-white/6 hover-card group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/45 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-3">Testimonials</div>
            <h2 className="text-4xl font-bold text-white mb-3">Real people, real results</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, avatar }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/6 hover-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{name}</div>
                    <div className="text-xs text-white/40">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 border border-indigo-500/20 relative overflow-hidden"
          >
            <div className="orb w-80 h-80 bg-indigo-600/20 -top-10 -right-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to forge your future?</h2>
              <p className="text-white/50 mb-8 text-lg">Join thousands of students who've landed their dream roles through SkillForge.</p>
              <Link to="/register" className="btn-primary text-base px-10 py-4 rounded-xl inline-flex items-center gap-2 shadow-2xl shadow-indigo-500/30">
                Get started free <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">SkillForge</span>
          </div>
          <p className="text-white/30 text-sm">© 2024 SkillForge. Empowering careers worldwide.</p>
          <div className="flex items-center gap-4">
            {[GitBranch, Share2, Link2].map((Icon, i) => (
              <button key={i} className="p-2 rounded-lg glass hover:bg-white/8 text-white/40 hover:text-white transition-all">
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
