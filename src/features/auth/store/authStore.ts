import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@shared/types'
import { supabase } from '@shared/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,

      signIn: async (email, password) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single()
            const user: User = profile ?? {
              id: data.user.id,
              email: data.user.email ?? '',
              name: data.user.user_metadata?.name ?? data.user.email ?? 'Usuário',
              role: data.user.user_metadata?.role ?? 'consultant',
              avatar_url: data.user.user_metadata?.avatar_url ?? undefined,
              created_at: data.user.created_at,
            }
            set({ user })
          }
        } catch (error) {
          throw error
        } finally {
          set({ loading: false })
        }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'agv-auth', partialize: (s) => ({ user: s.user }) },
  ),
)