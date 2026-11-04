import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Camera, Globe, GraduationCap, Link2, Briefcase, Code2, ExternalLink, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useFetch } from '../../hooks/useFetch';
import { profileApi } from '../../api/profileApi';
import { uploadApi } from '../../api/uploadApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { errorMessage } from '../../utils/format';

const EXPERIENCE = ['Fresher', '0-1 Year', '1-3 Years', '3+ Years'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const toFormValues = (profile) => ({
  college: profile?.college ?? '',
  experience: profile?.experience ?? '',
  bio: profile?.bio ?? '',
  github: profile?.socialLinks?.github ?? '',
  linkedin: profile?.socialLinks?.linkedin ?? '',
  portfolio: profile?.socialLinks?.portfolio ?? '',
});

const url = {
  validate: (v) => !v || /^https?:\/\/\S+\.\S+/.test(v.trim()) || 'Enter a full URL starting with https://',
};

/**
 * Save the profile whether or not a document exists yet. Some backend versions
 * only update an existing profile (returning null otherwise), so fall back to create.
 */
const saveProfile = async (payload) => {
  const res = await profileApi.updateProfile(payload);
  if (res.data?.profile) return res.data.profile;
  const created = await profileApi.createProfile(payload);
  return created.data.profile;
};

const PreviewLink = ({ icon: Icon, label, href }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand-fg hover:underline">
      <Icon size={14} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{label}</span>
      <ExternalLink size={12} aria-hidden="true" className="shrink-0 opacity-60" />
    </a>
  ) : null;

export const StudentProfile = () => {
  const user = useAuthStore((s) => s.user);
  const { data: profile, loading, error, reload } = useFetch(() =>
    profileApi.getProfile().then((res) => res.data.profile ?? null)
  );
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ values: toFormValues(profile), resetOptions: { keepDirtyValues: false } });
  const live = useWatch({ control });

  const onSubmit = async (form) => {
    try {
      await saveProfile({
        bio: form.bio,
        college: form.college,
        experience: form.experience,
        socialLinks: { github: form.github, linkedin: form.linkedin, portfolio: form.portfolio },
      });
      toast.success('Profile saved');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Could not save your profile'));
    }
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return toast.error('Choose a PNG or JPEG image');
    if (file.size > MAX_IMAGE_BYTES) return toast.error('Image must be 5 MB or smaller');

    setUploading(true);
    try {
      const res = await uploadApi.uploadPhoto(file);
      await saveProfile({ profilePhoto: res.data.url });
      setPhotoUrl(res.data.url);
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(errorMessage(err, 'Photo upload failed'));
    } finally {
      setUploading(false);
    }
  };

  const header = <PageHeader title="Profile" description="Your details and links. The preview updates as you type." />;

  if (loading) {
    return (
      <>
        {header}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-72" />
            <Skeleton className="h-52" />
          </div>
        </div>
      </>
    );
  }
  if (error) return <>{header}<ErrorState title="Couldn't load your profile" onRetry={reload} /></>;

  const photo = photoUrl || profile?.profilePhoto || null;

  return (
    <>
      {header}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Live preview */}
        <Card className="lg:sticky lg:top-6">
          <CardHeader title="Preview" />
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={user?.name} src={photo} size="xl" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-line-strong bg-surface text-fg-muted shadow-card hover:bg-subtle hover:text-fg disabled:opacity-50"
                >
                  <Camera size={14} aria-hidden="true" />
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={onPhoto} className="sr-only" tabIndex={-1} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-fg">{user?.name}</p>
                <p className="truncate text-sm text-fg-muted">{user?.email}</p>
                <Badge variant="info" className="mt-2">Student</Badge>
              </div>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              {live.college && (
                <div className="flex items-center gap-2 text-fg-muted">
                  <GraduationCap size={14} aria-hidden="true" className="shrink-0 text-fg-subtle" />
                  <dt className="sr-only">College</dt><dd className="truncate">{live.college}</dd>
                </div>
              )}
              {live.experience && (
                <div className="flex items-center gap-2 text-fg-muted">
                  <Briefcase size={14} aria-hidden="true" className="shrink-0 text-fg-subtle" />
                  <dt className="sr-only">Experience</dt><dd>{live.experience}</dd>
                </div>
              )}
            </dl>

            {live.bio ? (
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{live.bio}</p>
            ) : (
              <p className="mt-4 text-sm text-fg-subtle">Your bio will appear here.</p>
            )}

            <div className="mt-4 space-y-2">
              <PreviewLink icon={Code2} label="GitHub" href={live.github?.trim()} />
              <PreviewLink icon={Link2} label="LinkedIn" href={live.linkedin?.trim()} />
              <PreviewLink icon={Globe} label="Portfolio" href={live.portfolio?.trim()} />
              <PreviewLink icon={FileText} label="Resume" href={profile?.resume} />
            </div>
          </CardBody>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="About you" description="Shown on your profile." />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="College / university" placeholder="e.g. State Engineering College" optional {...register('college')} />
                <Select label="Experience level" optional {...register('experience')}>
                  <option value="">Select a level</option>
                  {EXPERIENCE.map((level) => <option key={level} value={level}>{level}</option>)}
                </Select>
              </div>
              <Textarea label="Bio" rows={5} placeholder="A few sentences about your background and what you're looking for." optional {...register('bio')} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Links" description="Add the profiles you want to share." />
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="GitHub" placeholder="https://github.com/username" optional error={errors.github?.message} {...register('github', url)} />
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" optional error={errors.linkedin?.message} {...register('linkedin', url)} />
              <div className="sm:col-span-2">
                <Input label="Portfolio" placeholder="https://your-site.com" optional error={errors.portfolio?.message} {...register('portfolio', url)} />
              </div>
            </CardBody>
          </Card>

          <div className="flex items-center justify-end gap-3">
            {isDirty && <span className="text-sm text-fg-subtle">You have unsaved changes</span>}
            <Button type="submit" loading={isSubmitting}>Save changes</Button>
          </div>
        </form>
      </div>
    </>
  );
};
