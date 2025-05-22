import { api } from '@/plugins/axios'

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data
    })
    return config
  },
  error => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    // Response is already transformed by the axios instance interceptor
    console.log('API Response:', {
      data: response,
      url: response?.request?.responseURL || 'unknown'
    })
    return response
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url || 'unknown'
    })
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
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
  createReview: (id, data) => api.post(`/users/camping-spots/${id}/reviews`, data),
  uploadImages: (id, formData) => api.post(`/users/camping-spots/${id}/images`, formData),
  deleteImage: (id, imageId) => api.delete(`/users/camping-spots/${id}/images/${imageId}`),
  createBooking: (id, data) => api.post(`/users/camping-spots/${id}/bookings`, data)
}

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.post(`/bookings/${id}/cancel`)
}

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getAll: (params) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
}

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
  updateBooking: (id, data) => api.put(`/admin/bookings/${id}`, data),
  getAllReviews: (params) => api.get('/admin/reviews', { params }),
  updateReview: (id, data) => api.put(`/admin/reviews/${id}`, data)
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
  getBookings: () => api.get('/users/bookings'),
  getReviews: () => api.get('/owner/reviews'),
  uploadImages: (id, formData) => api.post(`/owner/camping-spots/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default api 