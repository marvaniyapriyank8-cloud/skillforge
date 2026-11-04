
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMentorFeedback } from '../../hooks/useMentorFeedback';
import { useConfirm } from '../../hooks/useConfirm';
import { usePagination } from '../../hooks/usePagination';
import { mentorApi } from '../../api/mentorApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Select, Textarea } from '../../components/ui/Input';
import { Button, IconButton } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SearchBar } from '../../components/ui/SearchBar';
import { Tabs } from '../../components/ui/Tabs';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { errorMessage, formatDate, matchesQuery } from '../../utils/format';
import { FEEDBACK_TYPES } from '../../utils/ui';

const PAGE_SIZE = 8;
const label = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export const MentorFeedback = () => {
  const { data, loading, error, reload } = useMentorFeedback();
  const { confirm, dialog } = useConfirm();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [modal, setModal] = useState({ open: false, feedback: null });
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Load assigned students
  useEffect(() => {
    const loadStudents = async () => {
      setStudentsLoading(true);

      try {
        const { data } = await mentorApi.getStudents();
        setStudents(data.students || []);
      } catch (err) {
        toast.error(errorMessage(err, 'Could not load assigned students'));
      } finally {
        setStudentsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const all = data ?? [];

  const filtered = all
    .filter(
      (f) =>
        (type === 'all' || f.type === type) &&
        matchesQuery(
          search,
          f.student?.fullName,
          f.student?.email,
          f.message
        )
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pager = usePagination(filtered, PAGE_SIZE, `${type}|${search}`);

  const tabs = [
    { id: 'all', label: 'All', count: all.length },
    ...FEEDBACK_TYPES.map((t) => ({
      id: t,
      label: label(t),
      count: all.filter((f) => f.type === t).length,
    })),
  ];

  const openAdd = () => {
    reset({ student: '', type: 'general', message: '' });
    setModal({ open: true, feedback: null });
  };

  const openEdit = (feedback) => {
    reset({ type: feedback.type, message: feedback.message });
    setModal({ open: true, feedback });
  };

  const close = () => setModal((m) => ({ ...m, open: false }));

  const onSubmit = async (form) => {
    try {
      if (modal.feedback) {
        await mentorApi.updateFeedback(modal.feedback._id, {
          type: form.type,
          message: form.message.trim(),
        });

        toast.success('Feedback updated');
      } else {
        await mentorApi.createFeedback({
          student: form.student,
          type: form.type,
          message: form.message.trim(),
        });

        toast.success('Feedback sent');
      }

      close();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save the feedback'));
    }
  };

  const onDelete = async (fb) => {
    const ok = await confirm({
      title: 'Delete this feedback?',
      description: `Your feedback for ${fb.student?.fullName || 'this student'} will be permanently removed.`,
      confirmLabel: 'Delete',
    });

    if (!ok) return;

    try {
      await mentorApi.deleteFeedback(fb._id);
      toast.success('Feedback deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not delete the feedback'));
    }
  };

  let body;

  if (loading) {
    body = (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (error) {
    body = <ErrorState title="Couldn't load feedback" onRetry={reload} />;
  } else if (all.length === 0) {
    body = (
      <EmptyState
        icon={MessageSquare}
        title="No feedback yet"
        description="Write feedback on a student's resume, project or progress."
        action={
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" />
            Write feedback
          </Button>
        }
      />
    );
  } else {
    body = (
      <>
        <Tabs
          tabs={tabs}
          value={type}
          onChange={setType}
          label="Filter by type"
          className="mb-4"
        />

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by student or message…"
          className="mb-4 sm:max-w-sm"
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No matching feedback"
            description="Try a different type or search term."
          />
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pager.pageItems.map((fb) => (
                <li key={fb._id}>
                  <Card className="flex h-full flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar name={fb.student?.fullName} size="md" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-fg">
                            {fb.student?.fullName || 'Student'}
                          </p>

                          <p className="truncate text-xs text-fg-muted">
                            {fb.student?.email}
                          </p>
                        </div>
                      </div>

                      <StatusBadge status={fb.type} />
                    </div>

                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
                      {fb.message}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-xs text-fg-subtle">
                        {formatDate(fb.createdAt)}
                      </span>

                      <div className="-mr-1.5 flex">
                        <IconButton
                          label="Edit feedback"
                          onClick={() => openEdit(fb)}
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </IconButton>

                        <IconButton
                          label="Delete feedback"
                          variant="danger"
                          onClick={() => onDelete(fb)}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </IconButton>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>

            <Pagination
              page={pager.page}
              totalPages={pager.totalPages}
              onPageChange={pager.setPage}
              total={pager.total}
              pageSize={pager.pageSize}
            />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Feedback"
        description="Write and manage feedback for students."
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} aria-hidden="true" />
            Add feedback
          </Button>
        }
      />

      {body}

      <Modal
        isOpen={modal.open}
        onClose={close}
        title={modal.feedback ? 'Edit feedback' : 'Add feedback'}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {!modal.feedback && (
            <Select
              label="Select Student"
              disabled={studentsLoading || students.length === 0}
              error={errors.student?.message}
              {...register('student', {
                required: 'Please select a student',
              })}
            >
              <option value="">
                {studentsLoading
                  ? 'Loading students...'
                  : students.length === 0
                    ? 'No assigned students'
                    : 'Choose a student'}
              </option>

              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} ({student.email})
                </option>
              ))}
            </Select>
          )}

          <Select
            label="Feedback Type"
            {...register('type', { required: true })}
          >
            {FEEDBACK_TYPES.map((t) => (
              <option key={t} value={t}>
                {label(t)}
              </option>
            ))}
          </Select>

          <Textarea
            label="Feedback"
            rows={6}
            placeholder="Be specific and constructive."
            error={errors.message?.message}
            {...register('message', {
              required: 'Write your feedback',
              minLength: {
                value: 10,
                message: 'Feedback must be at least 10 characters',
              },
            })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!modal.feedback && (studentsLoading || students.length === 0)}
            >
              {modal.feedback ? 'Save changes' : 'Send feedback'}
            </Button>
          </div>
        </form>
      </Modal>

      {dialog}
    </>
  );
};
