// Store configuration for Vuex in a Vue.js application
// This file sets up the Vuex store, defines state, getters, mutations, and actions
// for managing authentication, user profiles, notifications, and loading states.

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
    //isAdmin: state => state.user && state.user.role === 'ADMIN',
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
      }, 7000)
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
        console.log('Store: Sending login request with credentials:', credentials)
        const response = await api.post('/auth/login', credentials)
        console.log('Store: Login response:', response)
        
        if (!response) {
          console.error('Store: No response received')
          throw new Error('No response received from server')
        }
        
        // Check if response has the expected structure
        if (!response.token || !response.user) {
          console.error('Store: Invalid response format:', response)
          throw new Error('Invalid response format from server')
        }
        
        // Store the token and user data
        commit('setToken', response.token)
        commit('setUser', response.user)
        
        commit('setNotification', {
          type: 'success',
          message: response.message || 'Successfully logged in!'
        })
        
        return response.user
      } catch (error) {
        console.error('Store: Login error:', error)
        if (error.response) {
          console.error('Store: Error response:', error.response)
        }
        throw error
      } finally {
        commit('setLoading', false)
      }
    },
    
    async register({ commit }, userData) {
      try {
        commit('setLoading', true)
        const response = await api.post('/auth/register', userData)
        
        // Response is already the data object from the axios interceptor
        const { token, user } = response
        
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
        // The response is already transformed by axios interceptor
        commit('setUser', response.user)
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