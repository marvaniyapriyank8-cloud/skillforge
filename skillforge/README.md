# SkillForge — Frontend

React single-page app for **SkillForge**, a career platform with four role-based workspaces:

| Role | What they can do |
| --- | --- |
| **Student** | Build a profile (skills, projects, links), upload a resume/photo/certificates, run AI resume analysis, skill-gap analysis, interview questions and a learning roadmap, browse and apply to jobs, track and withdraw applications |
| **Recruiter** | Post, edit and delete jobs, review applicants per job, shortlist / select / reject candidates |
| **Mentor** | Write, edit and delete feedback for students |
| **Admin** | View platform overview, manage users (block / unblock / delete), browse all jobs and applications |

## Tech stack

React 19 · Vite · Tailwind CSS v4 · React Router · Zustand · React Hook Form · Axios · Recharts · Framer Motion (dialogs/drawer only) · React Hot Toast · Lucide icons · Inter (self-hosted via `@fontsource-variable/inter`)

## Getting started

```bash
npm install
cp .env.example .env     # then set VITE_API_URL
npm run dev              # http://localhost:5173
```

The backend must allow the frontend origin in CORS with credentials enabled.

### Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API **including `/api`**, e.g. `http://localhost:5000/api` |

Vite inlines this at build time, so rebuild after changing it.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Deploying

The app is a static SPA. `vercel.json` already rewrites all routes to `index.html`.

1. Import the repo into Vercel (framework preset: **Vite**).
2. Add `VITE_API_URL` under *Project → Settings → Environment Variables*.
3. Deploy. On other static hosts, serve `dist/` and add an equivalent "fallback to `index.html`" rule.

## Project structure

```
src/
├── api/            Axios instance (interceptors) + one module per backend resource
├── components/
│   ├── ui/         Design-system primitives: Button, Input, Card, Badge, Modal, Table, Tabs …
│   └── shared/     App shell pieces: Sidebar, MobileNav, AuthLayout, chart helpers
├── hooks/          useFetch, usePagination, useConfirm, useRecruiterData, useMentorFeedback …
├── layouts/        DashboardLayout (sidebar + content)
├── pages/          auth/ · student/ · recruiter/ · mentor/ · admin/ · Landing · NotFound
├── routes/         ProtectedRoute (role guard), PublicRoute, ScrollToTop
├── store/          authStore (persisted session), themeStore (light/dark)
└── utils/          formatting, ownership filters, shared constants
```

## Design system

All colors, borders and shadows come from CSS variables in `src/index.css` (light and dark sets). Components use semantic Tailwind utilities (`bg-surface`, `text-fg-muted`, `border-line`, `bg-brand` …), so a re-brand is a change to a handful of variables. Text/background token pairs meet WCAG AA (4.5:1) in both themes. The theme follows the OS setting until the user toggles it, then persists.

## Notes on how data is loaded

- Pages fetch through the `useFetch` hook, which handles loading, error + retry, cancellation of stale requests, and refreshing after mutations without flashing skeletons.
- The API returns jobs and applications for everyone, so the UI scopes them to the signed-in user (`utils/ownership.js`): students see their own applications, recruiters see only their own jobs and the applications to them.
- Search, filtering and pagination are performed client-side on the fetched lists.
- AI output is plain text from the backend; `AiOutput` renders headings/lists/bold safely without `innerHTML`.
