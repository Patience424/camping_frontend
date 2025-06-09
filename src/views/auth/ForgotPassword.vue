<!-- ForgotPassword.vue 
can be used to request a password reset link via email 
-> will be implimented later 
-->
<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
    <div class="max-w-md w-full mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-neutral-900 mb-2">Reset your password</h1>
        <p class="text-neutral-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="requestReset">
          <div>
            <label for="email" class="form-label">Email address</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="form-input" 
              :class="{ 'border-red-300': error }"
            >
            <p v-if="error" class="form-error">{{ error }}</p>
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
                Sending reset link...
              </span>
              <span v-else>Send reset link</span>
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-neutral-600">
            Remember your password?
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
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      error: '',
      isLoading: false
    }
  },
  methods: {
    async requestReset() {
      try {
        this.isLoading = true
        this.error = ''
        
        await this.$axios.post('/auth/reset-password-request', {
          email: this.email
        })
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'If your email exists in our system, you will receive a password reset link'
        })
        
        this.$router.push('/login')
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>