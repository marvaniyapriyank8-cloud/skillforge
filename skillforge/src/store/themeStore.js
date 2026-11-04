import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const systemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const apply = (theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: systemTheme(),
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        apply(next);
        set({ theme: next });
      },
    }),
    {
      name: 'sf-theme',
      partialize: (s) => ({ theme: s.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) apply(state.theme);
      },
    }
  )
);
