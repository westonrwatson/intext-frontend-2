// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
    isLoggedIn: boolean
    isAdmin: boolean
    setLoggedIn: (val: boolean) => void
    setAdmin: (val: boolean) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            isAdmin: false,
            setLoggedIn: (val) => set({ isLoggedIn: val }),
            setAdmin: (val) => set({ isAdmin: val }),
            logout: () => set({ isLoggedIn: false, isAdmin: false }),
        }),
        {
            name: 'auth-storage', // Key in localStorage
        }
    )
)