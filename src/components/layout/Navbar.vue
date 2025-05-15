<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo and Site Name -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <svg class="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 22l10-10 10 10M15 6.5l-3-3-8.5 8.5 3 3M17 4l3 3"></path>
              <path d="M15.5 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
            </svg>
            <span class="ml-2 text-xl font-display font-bold text-primary-500">CampSpot</span>
          </router-link>
        </div>

        <!-- Main Navigation -->
        <div class="hidden md:flex items-center">
          <router-link to="/" class="px-3 py-2 text-neutral-600 hover:text-primary-500" exact>Home</router-link>
          <router-link to="/camping-spots" class="px-3 py-2 text-neutral-600 hover:text-primary-500">Explore</router-link>
          <router-link v-if="isOwner" to="/owner/camping-spots" class="px-3 py-2 text-neutral-600 hover:text-primary-500">My Listings</router-link>
          <router-link v-if="isAdmin" to="/admin/dashboard" class="px-3 py-2 text-neutral-600 hover:text-primary-500">Admin</router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="relative ml-3">
            <div>
              <button @click="toggleDropdown" class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span class="sr-only">Open user menu</span>
                <div v-if="user?.avatar" class="h-8 w-8 rounded-full overflow-hidden">
                  <img :src="user.avatar" alt="User avatar" class="h-full w-full object-cover">
                </div>
                <div v-else class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {{ user?.name?.[0]?.toUpperCase() || 'U' }}
                </div>
                <span class="ml-2 hidden md:block">{{ user?.name || 'User' }}</span>
                <svg class="ml-1 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="dropdownOpen" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Your Profile</router-link>
                  <router-link to="/bookings" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Your Bookings</router-link>
                  <router-link to="/reviews" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Your Reviews</router-link>
                  <router-link v-if="isOwner" to="/owner/dashboard" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Owner Dashboard</router-link>
                  <router-link v-if="isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Admin Dashboard</router-link>
                  <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100" role="menuitem">Sign out</a>
                </div>
              </div>
            </transition>
          </div>
          <div v-else class="flex">
            <router-link to="/login" class="btn-outline text-sm mr-2">Log in</router-link>
            <router-link to="/register" class="btn-primary text-sm">Sign up</router-link>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMobileMenu" class="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
            <span class="sr-only">Open main menu</span>
            <svg v-if="!mobileMenuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link to="/" exact class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path === '/' ? 'text-primary-500' : 'text-neutral-600']">Home</router-link>
          <router-link to="/camping-spots" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path.includes('/camping-spots') ? 'text-primary-500' : 'text-neutral-600']">Explore</router-link>
          <router-link v-if="isAuthenticated" to="/profile" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path === '/profile' ? 'text-primary-500' : 'text-neutral-600']">Profile</router-link>
          <router-link v-if="isAuthenticated" to="/bookings" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path.includes('/bookings') ? 'text-primary-500' : 'text-neutral-600']">Bookings</router-link>
          <router-link v-if="isOwner" to="/owner/dashboard" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path.includes('/owner') ? 'text-primary-500' : 'text-neutral-600']">Owner Dashboard</router-link>
          <router-link v-if="isAdmin" to="/admin/dashboard" class="block px-3 py-2 rounded-md text-base font-medium hover:bg-neutral-100" :class="[$route.path.includes('/admin') ? 'text-primary-500' : 'text-neutral-600']">Admin Dashboard</router-link>
          <a v-if="isAuthenticated" href="#" @click.prevent="logout" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100">Sign out</a>
          <router-link v-else to="/login" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100">Log in</router-link>
          <router-link v-if="!isAuthenticated" to="/register" class="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100">Sign up</router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'AppNavbar',
  data() {
    return {
      dropdownOpen: false,
      mobileMenuOpen: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isUser', 'isOwner', 'isAdmin']),
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    logout() {
      this.dropdownOpen = false
      this.mobileMenuOpen = false
      this.$store.dispatch('logout')
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
    hideMenus() {
      this.dropdownOpen = false
      this.mobileMenuOpen = false
    }
  },
  watch: {
    '$route'() {
      this.hideMenus()
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      const target = e.target
      if (!this.$el.contains(target)) {
        this.dropdownOpen = false
      }
    })
  }
}
</script>