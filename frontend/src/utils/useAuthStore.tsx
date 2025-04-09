// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
    isLoggedIn: boolean
    setLoggedIn: (val: boolean) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            setLoggedIn: (val) => set({ isLoggedIn: val }),
            logout: () => set({ isLoggedIn: false }),
        }),
        {
            name: 'auth-storage', // Key in localStorage
        }
    )
)