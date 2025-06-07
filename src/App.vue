<!-- App.vue
This is the main Vue.js application component for a camping booking application.
It includes the main layout with a navigation bar, footer, and global notification system.
It also handles global loading states and displays notifications for success, error, and info messages.
It uses Vue Router for navigation and Vuex for state management. 
-->


<template>
  <div id="app" class="min-h-screen flex flex-col">
    <AppNavbar />
    
    <main class="flex-grow">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </main>
    
    <AppFooter />
    
    <!-- Global Alert/Notification -->
    <transition name="slide-up">
      <div v-if="notification" 
           :class="[
             'fixed bottom-6 right-6 max-w-md p-4 rounded-lg shadow-lg z-50 transition-all transform',
             notificationStyles[notification.type]
           ]">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg v-if="notification.type === 'success'" class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="notification.type === 'error'" class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="inline-flex text-neutral-400 focus:outline-none focus:text-neutral-500 transition ease-in-out duration-150" @click="hideNotification">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-lg font-medium text-neutral-800">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppNavbar from '@/components/layout/Navbar.vue'
import AppFooter from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  },
  data() {
    return {
      notificationStyles: {
        success: 'bg-green-50 text-green-800 border border-green-200',
        error: 'bg-red-50 text-red-800 border border-red-200',
        info: 'bg-blue-50 text-blue-800 border border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      }
    }
  },
  computed: {
    ...mapState({
      notification: state => state.notification,
      isLoading: state => state.isLoading
    })
  },
  methods: {
    hideNotification() {
      this.$store.commit('clearNotification')
    }
  },
  created() {
    // Check for token on app start
    this.$store.dispatch('checkAuth')
  }
}
</script>

<style>
/* Make notification popups wider and more readable */
.fixed.bottom-6.right-6 {
  min-width: 340px;
  max-width: 480px;
  padding: 1.5rem 2.25rem;
  font-size: 1.1rem;
  box-sizing: border-box;
  border-radius: 14px;
  word-break: break-word;
}
</style>