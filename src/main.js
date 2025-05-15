import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'

Vue.config.productionTip = false

// Global error handler
Vue.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  
  // Add error to store to display in UI if needed
  store.commit('setError', {
    message: err.message || 'An error occurred',
    details: err.stack || '',
    component: vm?.$options?.name || 'Unknown',
    info
  })
}

// Setup axios as a plugin
import axiosPlugin from './plugins/axios'
Vue.use(axiosPlugin)

// Global filters
import { format, formatDistance } from 'date-fns'

Vue.filter('formatDate', function(value) {
  if (!value) return ''
  return format(new Date(value), 'MMM dd, yyyy')
})

Vue.filter('formatDateTime', function(value) {
  if (!value) return ''
  return format(new Date(value), 'MMM dd, yyyy HH:mm')
})

Vue.filter('timeAgo', function(value) {
  if (!value) return ''
  return formatDistance(new Date(value), new Date(), { addSuffix: true })
})

Vue.filter('formatCurrency', function(value) {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
})

Vue.filter('truncate', function(text, length = 100, suffix = '...') {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + suffix
})

// Initialize the app
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')