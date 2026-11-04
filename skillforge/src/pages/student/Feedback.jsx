
import { useState } from 'react';
import { MessageSquare, FileText, FolderGit2, MessageCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { studentApi } from '../../api/studentApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/format';

const feedbackTypes = {
  resume: {
    label: 'Resume Review',
    icon: FileText,
  },
  project: {
    label: 'Project Review',
    icon: FolderGit2,
  },
  general: {
    label: 'General Guidance',
    icon: MessageCircle,
  },
};

export const StudentFeedback = () => {
  const {
    data: feedbacks,
    loading,
    error,
    reload,
  } = useFetch(() =>
    studentApi.getFeedbacks().then((res) => res.data.feedbacks ?? [])
  );

  const [selectedType, setSelectedType] = useState('all');

  const allFeedbacks = feedbacks ?? [];

  const filteredFeedbacks = allFeedbacks.filter(
    (feedback) =>
      selectedType === 'all' || feedback.type === selectedType
  );

  let body;

  if (loading) {
    body = <CardSkeleton />;
  } else if (error) {
    body = (
      <ErrorState
        title="Couldn't load mentor feedback"
        onRetry={reload}
      />
    );
  } else if (allFeedbacks.length === 0) {
    body = (
      <EmptyState
        icon={MessageSquare}
        title="No mentor feedback yet"
        description="Feedback from your assigned mentor will appear here."
      />
    );
  } else {
    body = (
      <>
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Feedback' },
            { id: 'resume', label: 'Resume Review' },
            { id: 'project', label: 'Project Review' },
            { id: 'general', label: 'General Guidance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedType === tab.id
                  ? 'bg-indigo-600 text-white border border-indigo-600'
                  : 'border border-line bg-surface text-fg-muted hover:text-fg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredFeedbacks.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No feedback in this category"
            description="Try selecting another feedback category."
          />
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => {
              const config =
                feedbackTypes[feedback.type] || feedbackTypes.general;
              const Icon = config.icon;

              return (
                <article
                  key={feedback._id}
                  className="rounded-xl border border-line bg-surface p-5 shadow-card"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon size={18} />
                      </div>
                      <h3 className="font-semibold text-fg">
                        {config.label}
                      </h3>
                    </div>

                    <span className="text-xs text-fg-muted">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-fg-muted">
                    {feedback.message}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Mentor Feedback"
        description="Review suggestions and guidance shared by your mentor."
      />
      {body}
    </>
  );
};
