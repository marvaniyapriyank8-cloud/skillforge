import { useAuthStore } from '../store/authStore';
import { recruiterApi } from '../api/recruiterApi';
import { applicationsForJobs, isOwnJob } from '../utils/ownership';
import { useFetch } from './useFetch';

/**
 * The recruiter's own jobs plus the applications made to them.
 * (The API returns every job/application, so scoping happens here.)
 */
export function useRecruiterData() {
  const user = useAuthStore((s) => s.user);

  return useFetch(async () => {
    const [jobsRes, appsRes] = await Promise.allSettled([recruiterApi.getJobs(), recruiterApi.getApplicants()]);
    if (jobsRes.status === 'rejected' && appsRes.status === 'rejected') throw jobsRes.reason;

    const jobs = (jobsRes.status === 'fulfilled' ? jobsRes.value.data.jobs ?? [] : []).filter((j) => isOwnJob(j, user));
    const all = appsRes.status === 'fulfilled' ? appsRes.value.data.applications ?? [] : [];
    return { jobs, applications: applicationsForJobs(all, jobs) };
  });
}
