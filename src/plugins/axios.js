import axios from 'axios'
import store from '@/store'
import router from '@/router'

// Create axios instance
const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for API calls
instance.interceptors.request.use(
  config => {
    const token = store.state.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    store.commit('setLoading', false)
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
instance.interceptors.response.use(
  response => {
    console.log('Axios: Response interceptor:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    
    // Check if response has data
    if (!response.data) {
      console.error('Axios: No data in response')
      return Promise.reject(new Error('No data received from server'))
    }
    
    // Return the response data
    return response.data
  },
  error => {
    console.error('Axios: Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    const originalRequest = error.config
    
    // If the error response is 401 (Unauthorized) and not a retry
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // If the path isn't login or auth-related, logout the user
      if (!originalRequest.url.includes('login') && !originalRequest.url.includes('auth')) {
        store.dispatch('logout')
        router.push('/login')
        
        store.commit('setNotification', {
          type: 'error',
          message: 'Your session has expired. Please log in again.'
        })
      }
    }
    
    // Show user-friendly error message
    if (error.response && error.response.data && error.response.data.message) {
      store.commit('setNotification', {
        type: 'error',
        message: error.response.data.message
      })
    } else {
      store.commit('setNotification', {
        type: 'error',
        message: 'An error occurred. Please try again later.'
      })
    }
    
    store.commit('setLoading', false)
    return Promise.reject(error)
  }
)

// Plugin
export default {
  install(Vue) {
    Vue.prototype.$axios = instance
  }
}

export const api = instance