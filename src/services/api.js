// Description: Unified API service for handling all HTTP requests in a Vue.js application

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// Create Axios instance
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Optional: Add Vuex loading indicator
    store.commit('setLoading', true)

    console.log('API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data
    })

    return config
  },
  error => {
    store.commit('setLoading', false)
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    store.commit('setLoading', false)

    console.log('API Response:', {
      data: response.data,
      url: response?.request?.responseURL || 'unknown',
      status: response.status,
      headers: response.headers
    })

    if (!response.data) {
      return Promise.reject(new Error('No data received from server'))
    }

    return response.data
  },
  error => {
    store.commit('setLoading', false)

    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url || 'unknown'
    })

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      store.dispatch('logout')
      router.push('/login')
      store.commit('setNotification', {
        type: 'error',
        message: 'Your session has expired. Please log in again.'
      })
    }

    store.commit('setNotification', {
      type: 'error',
      message: error.response?.data?.message || 'An error occurred. Please try again later.'
    })

    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyToken: () => api.get('/auth/verify')
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getBookings: () => api.get('/users/bookings'),
  getReviews: () => api.get('/users/reviews')
}

export const reviewAPI = {
  // Combines both versions (yours + plugin-style)
  getAll: () => api.get('/reviews/my-reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
}

export const campingSpotAPI = {
  getAll: (params) => api.get('/users/camping-spots', { params }),
  getById: (id) => api.get(`/users/camping-spots/${id}`),
  create: (data) => api.post('/users/camping-spots', data),
  update: (id, data) => api.put(`/users/camping-spots/${id}`, data),
  delete: (id) => api.delete(`/users/camping-spots/${id}`),
  getFeatured: () => api.get('/users/camping-spots/featured'),
  search: (params) => api.get('/users/camping-spots/search', { params }),
  getCampingSpots: (params) => api.get('/users/camping-spots', { params }),
  checkAvailability: (id, data) => api.post(`/users/camping-spots/${id}/check-availability`, data),
  createReview: (data) => api.post('/users/reviews', data),
  uploadImages: (id, formData) => api.post(`/users/camping-spots/${id}/images`, formData),
  deleteImage: (id, imageId) => api.delete(`/users/camping-spots/${id}/images/${imageId}`)
}

export const bookingAPI = {
  create: (data) => api.post('/users/bookings', data),
  getAll: (params) => api.get('/users/bookings', { params }),
  getById: (id) => api.get(`/users/bookings/${id}`),
  cancel: (bookingId) => api.put(`/users/bookings/${bookingId}/cancel`)
}

export const ownerAPI = {
  getDashboardStats: () => api.get('/owner/dashboard/stats'),
  getCampingSpots: () => api.get('/owner/camping-spots'),
  getCampingSpotById: (id) => api.get(`/owner/camping-spots/${id}`),
  createCampingSpot: (data) => api.post('/owner/camping-spots', data, {
    headers: {
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  }),
  updateCampingSpot: (id, data) => api.put(`/owner/camping-spots/${id}`, data, {
    headers: {
      'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  }),
  deleteCampingSpot: (id) => api.delete(`/owner/camping-spots/${id}`),
  getBookings: () => api.get('/owner/bookings'),
  getReviews: () => api.get('/owner/reviews'),
  uploadImages: (id, formData) => api.post(`/owner/camping-spots/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updateBookingStatus: (bookingId, status) => api.put(`/owner/bookings/${bookingId}/status`, { status })
}

export default api
