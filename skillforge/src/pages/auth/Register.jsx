import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, Building2, GraduationCap, Lock, Mail, MessageSquareText, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthLayout } from '../../components/shared/AuthLayout';
import { Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { cn } from '../../utils/cn';
import { ROLE_HOME } from '../../utils/ui';

const ROLES = [
  { value: 'student', label: 'Student', description: 'Build a profile and apply to jobs', icon: GraduationCap },
  { value: 'recruiter', label: 'Recruiter', description: 'Post jobs and review applicants', icon: Building2 },
  { value: 'mentor', label: 'Mentor', description: 'Give feedback to students', icon: MessageSquareText },
];

const POINTS = [
  'Students build a profile, run AI analysis and apply to jobs',
  'Recruiters post openings and manage applicants',
  'Mentors review students and share feedback',
];

export const Register = () => {
  useDocumentTitle('Create account');
  const [role, setRole] = useState('student');
  const registerUser = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await registerUser({ ...data, role });
    if (result.success) navigate(ROLE_HOME[result.role] || '/');
  };

  return (
    <AuthLayout
      panelTitle="One workspace for the whole hiring journey"
      panelText="Create an account and choose how you'll use SkillForge. You can start right away."
      points={POINTS}
    >
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Create your account</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Choose your role, then fill in your details.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-fg">I am a</legend>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ value, label, description, icon: Icon }) => {
              const selected = role === value;
              return (
                <label
                  key={value}
                  className={cn(
                    'relative flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
                    selected ? 'border-brand bg-brand-soft' : 'border-line-strong bg-surface hover:bg-subtle'
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={selected}
                    onChange={() => setRole(value)}
                    className="sr-only"
                  />
                  <Icon size={18} aria-hidden="true" className={selected ? 'text-brand-fg' : 'text-fg-subtle'} />
                  <span className="text-sm font-medium text-fg">{label}</span>
                  <span className="hidden text-xs leading-snug text-fg-muted sm:block">{description}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          icon={User}
          error={errors.name?.message}
          {...register('name', {
            required: 'Enter your name',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Enter your email address',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          icon={Lock}
          error={errors.password?.message}
          {...register('password', {
            required: 'Choose a password',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={Lock}
          error={errors.confirm?.message}
          {...register('confirm', {
            required: 'Confirm your password',
            validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
          })}
        />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Create account <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-fg hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
