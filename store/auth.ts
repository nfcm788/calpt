import { create } from 'zustand';
import * as api from '@/lib/fake-data';

type AuthState = {
  user: api.User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: api.User | null) => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await api.signUp(email, password);
      set({ user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await api.signIn(email, password);
      set({ user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    await api.signOut();
    set({ user: null, loading: false });
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}));
