<template>
  <div>
    <!-- Hero Section -->
    <section class="relative h-[600px] md:h-[700px] bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      <!-- Background Image Overlay -->
      <div class="absolute inset-0 bg-black opacity-40 z-10"></div>
      
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          alt="Mountain camping view" 
          class="w-full h-full object-cover"
        >
      </div>
      
      <!-- Hero Content -->
      <div class="container mx-auto px-4 h-full flex items-center relative z-20">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Find Your Perfect <span class="text-accent">Camping Adventure</span>
          </h1>
          <p class="text-xl md:text-2xl text-white opacity-90 mb-8">
            Discover unique camping experiences in the great outdoors. Book with ease and connect with nature.
          </p>
          
          <!-- Search Box -->
          <div class="bg-white p-4 md:p-6 rounded-xl shadow-lg">
            <form @submit.prevent="searchSpots" class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div class="flex-grow">
                <label for="location" class="form-label">Where</label>
                <input
                  type="text"
                  id="location"
                  v-model="searchQuery.location"
                  placeholder="Search by location or spot name"
                  class="form-input"
                >
              </div>
              <div class="md:w-1/4">
                <label for="dates" class="form-label">Dates</label>
                <input
                  type="date"
                  id="dates"
                  v-model="searchQuery.date"
                  class="form-input"
                >
              </div>
              <div class="md:w-1/5">
                <label for="guests" class="form-label">Guests</label>
                <select id="guests" v-model="searchQuery.guests" class="form-input">
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
              <div class="md:self-end">
                <button type="submit" class="w-full btn-accent rounded-lg px-6 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Spots Section -->
    <section class="py-16 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="mb-10 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Featured Camping Spots</h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our handpicked selection of unique camping spots with amazing views and experiences
          </p>
        </div>

        <div v-if="isLoading" class="flex justify-center py-20">
          <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="featuredSpots.length === 0" class="text-center py-10">
          <p class="text-lg text-neutral-600">No featured spots available at the moment.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="spot in featuredSpots" :key="spot.id" class="card group hover:transform hover:scale-[1.02] transition-all duration-300">
            <div class="relative h-48 md:h-56 rounded-lg overflow-hidden mb-4">
              <img :src="getFirstImage(spot.images)" :alt="spot.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                <div class="flex items-center">
                  <div class="bg-accent rounded-full text-white px-2 py-1 text-xs font-bold">
                    Featured
                  </div>
                  <div v-if="spot.averageRating" class="ml-2 flex items-center bg-black/50 rounded-full px-2 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-xs">{{ spot.averageRating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-2">
              <h3 class="text-xl font-bold mb-2">{{ spot.name }}</h3>
              <p class="text-neutral-600 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-neutral-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                {{ spot.location }}
              </p>
              <p class="text-neutral-600 mb-4">{{ truncateDescription(spot.description, 100) }}</p>
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-bold text-lg">{{ formatPrice(spot.pricePerNight) }}</span>
                  <span class="text-neutral-600">/night</span>
                </div>
                <router-link :to="`/camping-spots/${spot.id}`" class="btn-primary">View Details</router-link>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <router-link to="/camping-spots" class="btn-outline px-6 py-3">View All Camping Spots</router-link>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="mb-10 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Why Camp With Us</h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Experience the best camping has to offer with our top-rated service
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div class="inline-block p-4 bg-primary-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Easy to Discover</h3>
            <p class="text-neutral-600">
              Find the perfect camping spot with our advanced search and filtering capabilities. Browse by location, amenities, or price.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div class="inline-block p-4 bg-primary-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Verified Quality</h3>
            <p class="text-neutral-600">
              All camping spots are thoroughly vetted for quality and safety. Read honest reviews from fellow campers.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div class="inline-block p-4 bg-primary-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Easy Booking</h3>
            <p class="text-neutral-600">
              Simple, straightforward booking process with instant confirmation. Manage your reservations in one place.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-neutral-50">
      <div class="container mx-auto px-4">
        <div class="mb-10 text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">What Campers Say</h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Hear from happy campers who found their perfect outdoor getaway
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "Finding the perfect camping spot was so easy! The booking process was smooth, and the spot was exactly as described. I'll definitely be using CampSpot for all my future camping trips."
            </p>
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold">
                JD
              </div>
              <div class="ml-3">
                <p class="font-semibold">Jason Doe</p>
                <p class="text-sm text-neutral-500">Mountain Explorer</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "As a camping enthusiast, I've tried many booking platforms, but CampSpot stands out with its detailed spot descriptions and user reviews. The customer service was also exceptional when I needed to change my reservation."
            </p>
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold">
                LS
              </div>
              <div class="ml-3">
                <p class="font-semibold">Laura Smith</p>
                <p class="text-sm text-neutral-500">Nature Photographer</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-neutral-700 mb-4">
              "Our family had an amazing weekend at a lakeside spot we found on CampSpot. The kids loved it, and the amenities were exactly as listed. The filtering options made it easy to find family-friendly locations."
            </p>
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold">
                MJ
              </div>
              <div class="ml-3">
                <p class="font-semibold">Mike Johnson</p>
                <p class="text-sm text-neutral-500">Family Camper</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-500 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
        <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Find the perfect camping spot and start planning your outdoor getaway today.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/camping-spots" class="btn-accent px-8 py-3 text-lg font-semibold">
            Explore Camping Spots
          </router-link>
          <!--
          <router-link to="/register" class="btn bg-white text-primary-500 hover:bg-neutral-100 px-8 py-3 text-lg font-semibold">
            Sign Up Now
          </router-link>
          -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { campingSpotAPI } from '@/services/api'

export default {
  name: 'HomePage',
  data() {
    return {
      searchQuery: {
        location: '',
        date: '',
        guests: '2'
      },
      featuredSpots: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    searchSpots() {
      // Construct query params
      const queryParams = new URLSearchParams()
      
      if (this.searchQuery.location) {
        queryParams.append('location', this.searchQuery.location)
      }
      
      if (this.searchQuery.date) {
        queryParams.append('date', this.searchQuery.date)
      }
      
      if (this.searchQuery.guests) {
        queryParams.append('capacity', this.searchQuery.guests)
      }
      
      // Navigate to camping spots page with search params
      this.$router.push({
        path: '/camping-spots',
        query: Object.fromEntries(queryParams)
      })
    },
    
    getFirstImage(images) {
      // Parse images string or return a default image
      try {
        if (!images) return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
        
        // If images is a JSON string, parse it and get the first one
        if (typeof images === 'string') {
          const parsedImages = JSON.parse(images)
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            return parsedImages[0]
          }
          return images // Just return the string if not an array
        }
        
        // If images is already an array, get the first one
        if (Array.isArray(images) && images.length > 0) {
          return images[0]
        }
        
        return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
      } catch (e) {
        console.error('Error parsing images:', e)
        return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
      }
    },
    
    truncateDescription(description, length) {
      if (!description) return ''
      if (description.length <= length) return description
      return description.slice(0, length) + '...'
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(price)
    },
    
    async fetchFeaturedSpots() {
      try {
        this.isLoading = true
        // Fetch camping spots with limit 3 as featured spots
        const response = await campingSpotAPI.getCampingSpots({
          limit: 3
        })
        this.featuredSpots = response.data.data || []
      } catch (error) {
        console.error('Error fetching featured spots:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load featured camping spots'
        })
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    this.fetchFeaturedSpots()
  }
}
</script>