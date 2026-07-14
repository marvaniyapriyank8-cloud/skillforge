import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

// Backend uses fullName, frontend uses name everywhere in UI
const normalizeUser = (user) => {
  if (!user) return null;
  return { ...user, name: user.fullName || user.name };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login(credentials);
          const token = data.token;
          const user = normalizeUser(data.user);
          localStorage.setItem('sf_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          toast.success(`Welcome back, ${user.name}!`);
          return { success: true, role: user.role };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Login failed');
          return { success: false };
        }
      },

      register: async (formData) => {
        set({ isLoading: true });
        try {
          const payload = {
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role || 'student',
          };
          const { data } = await authApi.register(payload);
          // Backend now returns token on register directly
          const token = data.token;
          const user = normalizeUser(data.user);
          localStorage.setItem('sf_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
          toast.success(`Welcome to SkillForge, ${user.name}!`);
          return { success: true, role: user.role };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Registration failed');
          return { success: false };
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch {}
        localStorage.removeItem('sf_token');
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      fetchMe: async () => {
        try {
          const { data } = await authApi.getMe();
          const user = normalizeUser(data.user);
          set({ user, isAuthenticated: true });
        } catch {
          localStorage.removeItem('sf_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      updateUser: (updates) =>
        set((s) => ({ user: { ...s.user, ...updates } })),
    }),
    {
      name: 'sf-auth',
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
