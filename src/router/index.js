import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

// Route components
import Home from '@/views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import CampingSpots from '@/views/camping/CampingSpots.vue'
import CampingSpotDetails from '@/views/camping/CampingSpotDetails.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserBookings from '@/views/user/UserBookings.vue'
import UserBookingDetails from '@/views/user/UserBookingDetails.vue'
import UserReviews from '@/views/user/UserReviews.vue'
import OwnerDashboard from '@/views/owner/OwnerDashboard.vue'
import OwnerCampingSpots from '@/views/owner/OwnerCampingSpots.vue'
import OwnerCampingSpotForm from '@/views/owner/OwnerCampingSpotForm.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminCampingSpots from '@/views/admin/AdminCampingSpots.vue'
import AdminBookings from '@/views/admin/AdminBookings.vue'
import AdminReviews from '@/views/admin/AdminReviews.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/camping-spots',
    name: 'CampingSpots',
    component: CampingSpots
  },
  {
    path: '/camping-spots/:id',
    name: 'CampingSpotDetails',
    component: CampingSpotDetails,
    props: true
  },
  
  // User routes
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings',
    name: 'UserBookings',
    component: UserBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id',
    name: 'UserBookingDetails',
    component: UserBookingDetails,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews',
    name: 'UserReviews',
    component: UserReviews,
    meta: { requiresAuth: true }
  },
  
  // Owner routes
  {
    path: '/owner/dashboard',
    name: 'OwnerDashboard',
    component: OwnerDashboard,
    meta: { requiresAuth: true, ownerOnly: true }
  },
  {
    path: '/owner/camping-spots',
    name: 'OwnerCampingSpots',
    component: OwnerCampingSpots,
    meta: { requiresAuth: true, ownerOnly: true }
  },
  {
    path: '/owner/camping-spots/new',
    name: 'NewCampingSpot',
    component: OwnerCampingSpotForm,
    meta: { requiresAuth: true, ownerOnly: true }
  },
  {
    path: '/owner/camping-spots/:id/edit',
    name: 'EditCampingSpot',
    component: OwnerCampingSpotForm,
    props: true,
    meta: { requiresAuth: true, ownerOnly: true }
  },
  
  // Admin routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/camping-spots',
    name: 'AdminCampingSpots',
    component: AdminCampingSpots,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: AdminBookings,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/reviews',
    name: 'AdminReviews',
    component: AdminReviews,
    meta: { requiresAuth: true, adminOnly: true }
  },
  
  // 404 Not Found
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  const ownerOnly = to.matched.some(record => record.meta.ownerOnly)
  const adminOnly = to.matched.some(record => record.meta.adminOnly)
  
  // Check authentication status
  const isAuthenticated = await store.dispatch('checkAuth')
  
  // Logic for authentication routes
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (guestOnly && isAuthenticated) {
    next('/')
  } else if (ownerOnly && (!isAuthenticated || !store.getters.isOwner)) {
    next('/')
  } else if (adminOnly && (!isAuthenticated || !store.getters.isAdmin)) {
    next('/')
  } else {
    next()
  }
})

export default router