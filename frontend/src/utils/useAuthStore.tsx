// utils/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  user_id: number;
  name: string;
  email: string;
};

type AuthStore = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  setLoggedIn: (val: boolean) => void;
  setAdmin: (val: boolean) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isAdmin: false,
      user: null,
      setLoggedIn: (val) => set({ isLoggedIn: val }),
      setAdmin: (val) => set({ isAdmin: val }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({ isLoggedIn: false, isAdmin: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
