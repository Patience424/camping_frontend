<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
    <div class="text-center max-w-md">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-32 w-32 mx-auto text-primary-500">
          <path fill="currentColor" d="M8 3a2 2 0 013.91-.5h2.18A2 2 0 0118 3v1h2v2h-2.09a2 2 0 01-3.82 0H8.91A2 2 0 015.09 6H3V4h2V3zm8 0a1 1 0 00-1 1h1V3zm-8 0v1h1a1 1 0 00-1-1zM6 8v1h1V8H6zm1 3v1H6v-1h1zm0 3v1H6v-1h1zm0 3v1H6v-1h1zM8 8h12v10H8V8zm2 2v6l5-3-5-3z"/>
        </svg>
      </div>
      
      <h1 class="text-4xl font-bold text-neutral-900 mb-2">Page not found</h1>
      <p class="text-neutral-600 mb-8">
        Oops! It seems like you've wandered off the trail. The page you're looking for is not available.
      </p>
      
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <router-link to="/" class="btn-primary px-8 py-3">
          Return Home
        </router-link>
        <router-link to="/camping-spots" class="btn-outline px-8 py-3">
          Explore Camping Spots
        </router-link>
      </div>
      
      <div class="mt-12 p-6 bg-white rounded-lg shadow-sm border border-neutral-200">
        <h2 class="text-lg font-semibold mb-3">Want some help?</h2>
        <p class="text-neutral-600 mb-4">
          If you believe this page should exist or you're encountering issues, please contact us.
        </p>
        <a href="mailto:support@campspot.com" class="text-primary-600 hover:text-primary-700 font-medium">
          support@campspot.com
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>