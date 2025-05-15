import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
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
  createReview: (id, data) => api.post(`/users/camping-spots/${id}/reviews`, data)
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
  getBookings: () => api.get('/owner/bookings'),
  getReviews: () => api.get('/owner/reviews')
}

export default api 