import axios from 'axios'
import toast from 'react-hot-toast'
import useAuthStore from '../stores/authStore'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } else if (error.response?.status !== 404 && !error.config?.url?.includes('/admin/')) {
      // Don't show toasts for admin routes
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadAvatar: (formData) => api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// Items API
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getFeatured: () => api.get('/items/featured'),
  getById: (id) => api.get(`/items/${id}`),
  create: (formData) => api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  toggleLike: (id) => api.post(`/items/${id}/like`),
  getByUser: (userId, params) => api.get(`/items/user/${userId}`, { params }),
  markUnavailable: (id) => api.post(`/items/${id}/mark-unavailable`),
  redeemByOwner: (id) => {
    console.log('API call: redeemByOwner for item ID:', id)
    return api.post(`/items/${id}/redeem-owner`)
  },
}

// Swaps API
export const swapsAPI = {
  create: (data) => api.post('/swaps', data),
  getAll: (params) => api.get('/swaps', { params }),
  getById: (id) => api.get(`/swaps/${id}`),
  respond: (id, data) => api.put(`/swaps/${id}/respond`, data),
  complete: (id) => api.put(`/swaps/${id}/complete`),
  cancel: (id, data) => api.put(`/swaps/${id}/cancel`, data),
  rate: (id, data) => api.post(`/swaps/${id}/rate`, data),
}

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/profile/${username}`),
  search: (params) => api.get('/users/search', { params }),
  getTop: (params) => api.get('/users/top', { params }),
  getStats: () => api.get('/users/stats'),
  getActivity: (params) => api.get('/users/activity', { params }),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getItems: (params) => api.get('/admin/items', { params }),
  approveItem: (id) => api.put(`/admin/items/${id}/approve`),
  rejectItem: (id, data) => api.put(`/admin/items/${id}/reject`, data),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  updateUserPoints: (id, data) => api.put(`/admin/users/${id}/points`, data),
  getReports: (params) => api.get('/admin/reports', { params }),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api 