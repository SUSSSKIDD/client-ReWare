import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    changePassword,
    refreshProfile,
    initialize,
    updatePoints,
    updateStats,
  } = useAuthStore()

  // Initialize auth state on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    changePassword,
    refreshProfile,
    updatePoints,
    updateStats,
  }
} 