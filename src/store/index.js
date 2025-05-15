import Vue from 'vue'
import Vuex from 'vuex'
import { api } from '@/plugins/axios'
import jwtDecode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    notification: null,
    isLoading: false,
    error: null
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isUser: state => state.user && state.user.role === 'USER',
    isOwner: state => state.user && state.user.role === 'OWNER',
    isAdmin: state => state.user && state.user.role === 'ADMIN',
    userRole: state => state.user ? state.user.role : null,
    userId: state => state.user ? state.user.id : null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearAuth(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setNotification(state, notification) {
      state.notification = notification
      
      // Auto-clear notification after 5 seconds
      setTimeout(() => {
        if (state.notification === notification) {
          state.notification = null
        }
      }, 5000)
    },
    clearNotification(state) {
      state.notification = null
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        commit('setLoading', true)
        const response = await api.post('/auth/login', credentials)
        
        const { token, user } = response.data
        
        commit('setToken', token)
        commit('setUser', user)
        
        commit('setNotification', {
          type: 'success',
          message: 'Successfully logged in!'
        })
        
        return user
      } catch (error) {
        console.error('Login error:', error.response || error)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    async register({ commit }, userData) {
      try {
        commit('setLoading', true)
        const response = await api.post('/auth/register', userData)
        
        const { token, user } = response.data
        
        commit('setToken', token)
        commit('setUser', user)
        
        commit('setNotification', {
          type: 'success',
          message: 'Successfully registered!'
        })
        
        return user
      } catch (error) {
        console.error('Registration error:', error.response || error)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    logout({ commit }) {
      commit('clearAuth')
      commit('setNotification', {
        type: 'info',
        message: 'You have been logged out.'
      })
    },
    
    async checkAuth({ state, commit }) {
      if (!state.token) return false
      
      try {
        // Check if token is expired
        const decoded = jwtDecode(state.token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp < currentTime) {
          // Token expired
          commit('clearAuth')
          return false
        }
        
        // Token still valid, get current user profile
        const response = await api.get('/auth/profile')
        commit('setUser', response.data.user)
        return true
      } catch (error) {
        console.error('Auth check error:', error)
        commit('clearAuth')
        return false
      }
    },
    
    async updateProfile({ commit, state }, profileData) {
      try {
        commit('setLoading', true)
        const response = await api.put('/users/profile', profileData)
        
        // Update user data in store
        const updatedUser = { ...state.user, ...response.data.user }
        commit('setUser', updatedUser)
        
        commit('setNotification', {
          type: 'success',
          message: 'Profile updated successfully!'
        })
        
        return updatedUser
      } catch (error) {
        console.error('Update profile error:', error.response || error)
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    async changePassword({ commit }, passwordData) {
      try {
        commit('setLoading', true)
        await api.put('/users/change-password', passwordData)
        
        commit('setNotification', {
          type: 'success',
          message: 'Password changed successfully!'
        })
      } catch (error) {
        console.error('Change password error:', error.response || error)
        throw error
      } finally {
        commit('setLoading', false)
      }
    }
  }
})