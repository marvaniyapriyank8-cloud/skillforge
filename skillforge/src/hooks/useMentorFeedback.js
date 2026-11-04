import { useAuthStore } from '../store/authStore';
import { mentorApi } from '../api/mentorApi';
import { idOf } from '../utils/format';
import { useFetch } from './useFetch';

/** Feedback written by the signed-in mentor (the API may return everyone's). */
export function useMentorFeedback() {
  const user = useAuthStore((s) => s.user);
  return useFetch(() =>
    mentorApi
      .getFeedbacks()
      .then((res) => (res.data.feedbacks ?? []).filter((f) => !f.mentor || idOf(f.mentor) === user._id))
  );
}
