<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
    <div class="max-w-md w-full mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Sign in to your account</h1>
        <p class="text-neutral-600">
          Welcome back! Please enter your details.
        </p>
      </div>
      
      <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="login">
          <div>
            <label for="email" class="form-label">Email address</label>
            <input 
              id="email" 
              v-model="credentials.email" 
              type="email" 
              required 
              class="form-input" 
              :class="{ 'border-red-300': errors.email }"
            >
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>
          
          <div>
            <label for="password" class="form-label">Password</label>
            <input 
              id="password" 
              v-model="credentials.password" 
              type="password" 
              required 
              class="form-input"
              :class="{ 'border-red-300': errors.password }"
              autocomplete="current-password"
            >
            <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-neutral-600">
                Remember me
              </label>
            </div>
            
            <div class="text-sm">
              <router-link to="/forgot-password" class="text-primary-600 hover:text-primary-500">
                Forgot your password?
              </router-link>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="w-full btn-primary py-3 text-base"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-neutral-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-1 gap-3">
            <div>
              <a href="#" class="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600">
            Don't have an account?
            <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LoginPage',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      rememberMe: false,
      errors: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading
    })
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors = {
        email: '',
        password: ''
      }
      
      if (!this.credentials.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.credentials.email)) {
        this.errors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      if (!this.credentials.password) {
        this.errors.password = 'Password is required'
        isValid = false
      }
      
      return isValid
    },
    
    async login() {
      if (!this.validateForm()) return
      
      try {
        const user = await this.$store.dispatch('login', this.credentials)
        
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          this.$router.push('/admin/dashboard')
        } else if (user.role === 'OWNER') {
          this.$router.push('/owner/dashboard')
        } else {
          // Get the redirect URL from query parameters or go to the home page
          const redirectUrl = this.$route.query.redirect || '/'
          this.$router.push(redirectUrl)
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const { message } = error.response.data
          
          if (message.includes('email')) {
            this.errors.email = message
          } else if (message.includes('password')) {
            this.errors.password = message
          } else {
            this.$store.commit('setNotification', {
              type: 'error',
              message: message || 'Failed to sign in'
            })
          }
        } else {
          this.$store.commit('setNotification', {
            type: 'error',
            message: 'An error occurred during sign in'
          })
        }
      }
    }
  }
}
</script>