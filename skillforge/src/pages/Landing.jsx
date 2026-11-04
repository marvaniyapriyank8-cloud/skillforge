import { Link } from 'react-router-dom';
import {
  ArrowRight, Briefcase, Brain, Check, ClipboardList, Compass, FileSearch,
  FolderGit2, MessageSquare, Route, Target,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Logo } from '../components/ui/Logo';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { buttonStyles } from '../components/ui/buttonStyles';

const FEATURES = [
  {
    icon: FolderGit2,
    title: 'Profile & portfolio',
    text: 'Keep your skills, projects, links and documents organized in a single profile.',
  },
  {
    icon: FileSearch,
    title: 'Resume analysis',
    text: 'Upload a PDF resume and get AI-generated feedback: an ATS-style score, skills found, gaps and suggestions.',
  },
  {
    icon: Target,
    title: 'Skill-gap analysis',
    text: 'Compare the skills you have with a target role and see what to work on next.',
  },
  {
    icon: Brain,
    title: 'Interview preparation',
    text: 'Generate technical, project-based and HR questions tailored to your skills and projects.',
  },
  {
    icon: Route,
    title: 'Learning roadmap',
    text: 'Get a week-by-week plan for moving from your current skills to a target role.',
  },
  {
    icon: ClipboardList,
    title: 'Applications you can track',
    text: 'Browse openings, apply in one click and follow each application from applied to selected.',
  },
];

const ROLES = [
  {
    icon: Compass,
    title: 'Students',
    points: [
      'Build a profile with skills and projects',
      'Run AI resume, skill-gap and interview tools',
      'Search and apply to jobs',
      'Track the status of every application',
    ],
  },
  {
    icon: Briefcase,
    title: 'Recruiters',
    points: [
      'Post, edit and remove job openings',
      'Review applicants for each job',
      'Shortlist, select or reject candidates',
      'See application counts at a glance',
    ],
  },
  {
    icon: MessageSquare,
    title: 'Mentors',
    points: [
      'Write feedback on resumes and projects',
      'Update or remove feedback any time',
      'Keep a record of the students you have helped',
    ],
  },
];

const STEPS = [
  { title: 'Create an account', text: 'Sign up and choose whether you are a student, recruiter or mentor.' },
  { title: 'Set up your workspace', text: 'Students add skills and projects, recruiters post jobs, mentors start giving feedback.' },
  { title: 'Apply, review, improve', text: 'Applications move through clear statuses while feedback and AI tools help you improve.' },
];

const navLink = 'text-sm font-medium text-fg-muted transition-colors hover:text-fg';

export const Landing = () => {
  useDocumentTitle('Prepare, apply and hire');
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="SkillForge home"><Logo /></Link>
          <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
            <a href="#features" className={navLink}>Features</a>
            <a href="#roles" className={navLink}>Who it's for</a>
            <a href="#how" className={navLink}>How it works</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'sm', className: 'hidden sm:inline-flex' })}>
              Sign in
            </Link>
            <Link to="/register" className={buttonStyles({ size: 'sm' })}>Get started</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid grid-cols-1 max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="inline-flex items-center rounded-full border border-line-strong bg-surface px-3 py-1 text-xs font-medium text-fg-muted">
              For students, recruiters and mentors
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Prepare, apply and hire — in one workspace.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
              Students build a profile and get AI-assisted resume feedback. Recruiters post jobs and manage
              applicants. Mentors share feedback along the way.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className={buttonStyles({ size: 'lg' })}>
                Create an account <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/login" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>Sign in</Link>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
            <h2 className="text-sm font-semibold text-fg">What's inside</h2>
            <ul className="mt-4 divide-y divide-line">
              {[
                { icon: FolderGit2, label: 'Profile with skills and projects' },
                { icon: FileSearch, label: 'AI resume and skill-gap analysis' },
                { icon: Briefcase, label: 'Job board and application tracking' },
                { icon: MessageSquare, label: 'Mentor feedback' },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 py-3 text-sm text-fg-muted first:pt-0 last:pb-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-16 border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">Tools that help you prepare</h2>
              <p className="mt-3 text-fg-muted">
                Everything below is available to students from their dashboard.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-line bg-canvas p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-fg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{text}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-fg-subtle">
              AI features are generated by a language model. Treat the output as guidance, not a guarantee.
            </p>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="scroll-mt-16 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">Built for each role</h2>
              <p className="mt-3 text-fg-muted">Pick a role when you sign up and get a workspace designed for it.</p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {ROLES.map(({ icon: Icon, title, points }) => (
                <div key={title} className="rounded-xl border border-line bg-surface p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold">{title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-fg-muted">
                        <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success-fg" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map(({ title, text }, i) => (
                <li key={title}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-on-brand">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-fg">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Call to action */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-brand-panel px-6 py-12 text-center sm:px-12">
              <h2 className="text-3xl font-semibold tracking-tight text-white">Ready to get started?</h2>
              <p className="mx-auto mt-3 max-w-xl text-white/70">
                Create an account, choose your role and set up your workspace in a few minutes.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-brand-panel transition-colors hover:bg-white/90"
                >
                  Create an account <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/25 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <Logo size={24} />
          <p className="text-sm text-fg-subtle">© {year} SkillForge</p>
          <nav aria-label="Footer" className="flex gap-6">
            <Link to="/login" className={navLink}>Sign in</Link>
            <Link to="/register" className={navLink}>Create account</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};
