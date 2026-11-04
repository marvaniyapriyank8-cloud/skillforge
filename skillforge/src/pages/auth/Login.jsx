import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { AuthLayout } from '../../components/shared/AuthLayout';
import { Input, PasswordInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ROLE_HOME } from '../../utils/ui';

const POINTS = [
  'Build a profile with your skills and projects',
  'Get AI-assisted resume and skill-gap feedback',
  'Apply to jobs and track every application',
];

export const Login = () => {
  useDocumentTitle('Sign in');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) navigate(ROLE_HOME[result.role] || '/');
  };

  return (
    <AuthLayout
      panelTitle="Welcome back"
      panelText="Sign in to pick up where you left off — your profile, applications and feedback are waiting."
      points={POINTS}
    >
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Sign in to SkillForge</h1>
      <p className="mt-1.5 text-sm text-fg-muted">Enter your email and password to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
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
          autoComplete="current-password"
          placeholder="Your password"
          icon={Lock}
          error={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
        />
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Sign in <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        New to SkillForge?{' '}
        <Link to="/register" className="font-medium text-brand-fg hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};
