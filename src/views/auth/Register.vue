<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
    <div class="max-w-md w-full mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Create your account</h1>
        <p class="text-neutral-600">
          Join our community of campers and camping spot owners.
        </p>
      </div>
      
      <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="register">
          <div>
            <label for="name" class="form-label">Full name</label>
            <input 
              id="name" 
              v-model="userData.name" 
              type="text" 
              required 
              class="form-input" 
              :class="{ 'border-red-300': errors.name }"
            >
            <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
          </div>
          
          <div>
            <label for="email" class="form-label">Email address</label>
            <input 
              id="email" 
              v-model="userData.email" 
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
              v-model="userData.password" 
              type="password" 
              required 
              class="form-input"
              :class="{ 'border-red-300': errors.password }"
              autocomplete="new-password"
            >
            <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
            <p class="text-xs text-neutral-500 mt-1">
              Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
            </p>
          </div>
          
          <div>
            <label for="password-confirm" class="form-label">Confirm password</label>
            <input 
              id="password-confirm" 
              v-model="userData.passwordConfirm" 
              type="password" 
              required 
              class="form-input"
              :class="{ 'border-red-300': errors.passwordConfirm }"
              autocomplete="new-password"
            >
            <p v-if="errors.passwordConfirm" class="form-error">{{ errors.passwordConfirm }}</p>
          </div>
          
          <div>
            <label class="form-label">Account type</label>
            <div class="mt-2 grid grid-cols-2 gap-3">
              <div 
                @click="userData.role = 'USER'"
                :class="[
                  'border rounded-lg p-4 cursor-pointer transition-all duration-200',
                  userData.role === 'USER' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-neutral-300 hover:border-neutral-400'
                ]"
              >
                <div class="flex justify-between items-start mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="radio"
                    name="role"
                    value="USER"
                    v-model="userData.role"
                    class="h-4 w-4 text-primary-600"
                  >
                </div>
                <h3 class="font-medium">Camper</h3>
                <p class="text-xs mt-1">I want to book camping spots</p>
              </div>
              
              <div 
                @click="userData.role = 'OWNER'"
                :class="[
                  'border rounded-lg p-4 cursor-pointer transition-all duration-200',
                  userData.role === 'OWNER' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-neutral-300 hover:border-neutral-400'
                ]"
              >
                <div class="flex justify-between items-start mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <input
                    type="radio"
                    name="role"
                    value="OWNER"
                    v-model="userData.role"
                    class="h-4 w-4 text-primary-600"
                  >
                </div>
                <h3 class="font-medium">Owner</h3>
                <p class="text-xs mt-1">I want to list my camping spots</p>
              </div>
            </div>
            <p v-if="errors.role" class="form-error">{{ errors.role }}</p>
          </div>
          
          <div class="flex items-center">
            <input
              id="terms"
              v-model="userData.agreeToTerms"
              type="checkbox"
              required
              :class="[
                'h-4 w-4 focus:ring-primary-500 border-neutral-300 rounded',
                errors.agreeToTerms ? 'border-red-300' : ''
              ]"
            >
            <label for="terms" class="ml-2 block text-sm text-neutral-600">
              I agree to the 
              <a href="#" class="text-primary-600 hover:text-primary-500">Terms</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.agreeToTerms" class="form-error">{{ errors.agreeToTerms }}</p>
          
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
                Creating your account...
              </span>
              <span v-else>Create account</span>
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
                Sign up with Google
              </a>
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Sign in
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
  name: 'RegisterPage',
  data() {
    return {
      userData: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: 'USER',
        agreeToTerms: false
      },
      errors: {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: '',
        agreeToTerms: ''
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
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: '',
        agreeToTerms: ''
      }
      
      // Validate name
      if (!this.userData.name) {
        this.errors.name = 'Name is required'
        isValid = false
      } else if (this.userData.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters'
        isValid = false
      }
      
      // Validate email
      if (!this.userData.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.userData.email)) {
        this.errors.email = 'Please enter a valid email address'
        isValid = false
      }
      
      // Validate password
      if (!this.userData.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.userData.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters'
        isValid = false
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.userData.password)) {
        this.errors.password = 'Password must include at least one uppercase letter, one lowercase letter, and one number'
        isValid = false
      }
      
      // Validate password confirmation
      if (!this.userData.passwordConfirm) {
        this.errors.passwordConfirm = 'Please confirm your password'
        isValid = false
      } else if (this.userData.password !== this.userData.passwordConfirm) {
        this.errors.passwordConfirm = 'Passwords do not match'
        isValid = false
      }
      
      // Validate role
      if (!this.userData.role) {
        this.errors.role = 'Please select an account type'
        isValid = false
      }
      
      // Validate terms agreement
      if (!this.userData.agreeToTerms) {
        this.errors.agreeToTerms = 'You must agree to the terms and privacy policy'
        isValid = false
      }
      
      return isValid
    },
    
    async register() {
      if (!this.validateForm()) return
      
      try {
        // Prepare data for API
        const registerData = {
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
          role: this.userData.role
        }
        
        const user = await this.$store.dispatch('register', registerData)
        
        // Redirect based on user role
        if (user.role === 'OWNER') {
          this.$router.push('/owner/dashboard')
        } else {
          this.$router.push('/')
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
              message: message || 'Failed to create account'
            })
          }
        } else {
          this.$store.commit('setNotification', {
            type: 'error',
            message: 'An error occurred during registration'
          })
        }
      }
    }
  }
}
</script>