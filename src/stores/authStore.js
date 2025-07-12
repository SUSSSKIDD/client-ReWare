import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      login: async (credentials) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.login(credentials)
          const { token, user } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success('Login successful!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.response?.data?.message }
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.register(userData)
          const { token, user } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success('Registration successful!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.response?.data?.message }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        toast.success('Logged out successfully')
      },

      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.updateProfile(profileData)
          const { user } = response.data

          set({
            user,
            isLoading: false,
          })

          toast.success('Profile updated successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.response?.data?.message }
        }
      },

      uploadAvatar: async (file) => {
        try {
          set({ isLoading: true })
          const formData = new FormData()
          formData.append('image', file)

          const response = await authAPI.uploadAvatar(formData)
          const { user } = response.data

          set({
            user,
            isLoading: false,
          })

          toast.success('Avatar uploaded successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.response?.data?.message }
        }
      },

      changePassword: async (passwordData) => {
        try {
          set({ isLoading: true })
          await authAPI.changePassword(passwordData)
          set({ isLoading: false })

          toast.success('Password changed successfully!')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.response?.data?.message }
        }
      },

      refreshProfile: async () => {
        try {
          const response = await authAPI.getProfile()
          const { user } = response.data

          set({ user })
          return { success: true }
        } catch (error) {
          // If refresh fails, user might be logged out
          get().logout()
          return { success: false }
        }
      },

      // Initialize auth state from localStorage
      initialize: async () => {
        const { token } = get()
        if (token) {
          try {
            const result = await get().refreshProfile()
            if (!result.success) {
              get().logout()
            }
          } catch (error) {
            get().logout()
          }
        }
        set({ isLoading: false })
      },

      // Update user points (for swaps)
      updatePoints: (newPoints) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              points: newPoints,
            },
          })
        }
      },

      // Update user stats
      updateStats: (stats) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              ...stats,
            },
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore 