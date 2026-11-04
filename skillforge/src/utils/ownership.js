import { idOf } from './format';

/** The backend returns every application; students only ever see their own. */
export const isOwnApplication = (app, user) =>
  Boolean(user) && (idOf(app.student) === user._id || app.student?.email === user.email);

/** Jobs are returned for everyone; recruiters manage only the ones they posted. */
export const isOwnJob = (job, user) => Boolean(user) && idOf(job.recruiter) === user._id;

/** Applications belonging to a set of job ids (a recruiter's jobs). */
export const applicationsForJobs = (applications, jobs) => {
  const ids = new Set(jobs.map((j) => j._id));
  return applications.filter((a) => ids.has(idOf(a.job)));
};
