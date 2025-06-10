<!-- CampingSpots.vue 
This is a Vue.js component for the camping spots listing page of a camping booking application.
It allows users to filter, search, and sort camping spots based on various criteria.
It includes features for viewing spot details, active filters.  
-->

<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Filter Header -->
    <div class="bg-white shadow-sm py-4 sticky top-16 z-30">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <h1 class="text-2xl font-bold mb-4 md:mb-0">{{ pageTitle }}</h1>
          
          <div class="flex flex-wrap gap-2">
            <!-- Location filter -->
            <div class="relative">
              <input
                type="text"
                v-model="filters.location"
                placeholder="Location"
                class="form-input py-2 pl-8 pr-4 rounded-full text-sm"
              >
              <svg class="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Price range filter -->
            <div class="relative">
              <select v-model="filters.priceRange" class="form-input py-2 pl-8 pr-4 rounded-full text-sm">
                <option value="">Any price</option>
                <option value="0-50">Under €50</option>
                <option value="50-100">€50 - €100</option>
                <option value="100-200">€100 - €200</option>
                <option value="200+">€200+</option>
              </select>
              <svg class="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Capacity filter -->
            <div class="relative">
              <select v-model="filters.capacity" class="form-input py-2 pl-8 pr-4 rounded-full text-sm">
                <option value="">Any capacity</option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5+ People</option>
              </select>
              <svg class="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            
            <!-- Amenities filter (dropdown) -->
            <div class="relative">
              <button 
                @click.stop="toggleAmenitiesDropdown" 
                class="form-input py-2 pl-8 pr-4 rounded-full text-sm flex items-center"
              >
                <span>Amenities</span>
                <svg class="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <svg class="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
              </svg>
              
              <!-- Amenities dropdown -->
              <div v-if="showAmenitiesDropdown" class="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg p-3 z-10 w-56 amenities-dropdown" @click.stop>
                <div v-for="amenity in amenitiesList" :key="amenity.id" class="flex items-center mb-2">
                  <input
                    type="checkbox"
                    :id="`amenity-${amenity.id}`"
                    v-model="filters.selectedAmenities"
                    :value="amenity.id"
                    class="mr-2"
                  >
                  <label :for="`amenity-${amenity.id}`" class="text-sm">{{ amenity.name }}</label>
                </div>
                <div class="mt-3 flex justify-end">
                  <button @click.stop="clearAmenities" class="text-xs text-neutral-500 mr-2">Clear</button>
                  <button @click.stop="applyAmenities" class="text-xs text-primary-500 font-medium">Apply</button>
                </div>
              </div>
            </div>
            
            <!-- Sort dropdown -->
            <div class="relative ml-auto">
              <select v-model="filters.sort" class="form-input py-2 pl-8 pr-4 rounded-full text-sm">
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <svg class="h-4 w-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="mb-6 w-full">
        <div class="flex flex-wrap gap-2 items-center">
          <span class="text-sm font-medium text-neutral-600">Active filters:</span>
          
          <button 
            v-if="filters.location" 
            @click="clearFilter('location')" 
            class="inline-flex items-center bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs"
          >
            Location: {{ filters.location }}
            <svg class="h-3 w-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            v-if="filters.capacity" 
            @click="clearFilter('capacity')" 
            class="inline-flex items-center bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs"
          >
            Capacity: {{ filters.capacity }}+ people
            <svg class="h-3 w-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            v-if="filters.priceRange" 
            @click="clearFilter('priceRange')" 
            class="inline-flex items-center bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs"
          >
            Price: {{ formatPriceRange(filters.priceRange) }}
            <svg class="h-3 w-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            v-if="filters.appliedAmenities.length > 0" 
            @click="clearFilter('selectedAmenities')" 
            class="inline-flex items-center bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs"
          >
            {{ filters.appliedAmenities.length }} amenities selected
            <svg class="h-3 w-3 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button 
            @click="clearAllFilters" 
            class="text-neutral-600 text-xs hover:text-neutral-800 underline ml-2"
          >
            Clear all filters
          </button>
        </div>
      </div>
      
      <!-- Camping Spots List -->
      <div class="w-full">
        <div v-if="isLoading" class="flex justify-center py-20">
          <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="campingSpots.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No camping spots found</h3>
          <p class="text-neutral-600 mb-6">Try adjusting your filters to find more options</p>
          <button @click="clearAllFilters" class="btn-primary">Clear all filters</button>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="spot in campingSpots" 
            :key="spot.id" 
            class="card group cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-300"
            @click="viewSpotDetails(spot.id)"
          >
            <div class="relative h-48 md:h-56 rounded-lg overflow-hidden mb-4">
              <img 
                :src="getFirstImage(spot.images)" 
                :alt="spot.name" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError"
                loading="lazy"
              >
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
                <div v-if="spot.averageRating" class="flex items-center bg-black/50 rounded-full px-2 py-1 w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1 text-xs">{{ spot.averageRating.toFixed(1) }}</span>
                  <span class="ml-1 text-xs">({{ spot.reviewCount || 0 }})</span>
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
        
        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="mt-10 flex justify-center">
          <div class="flex space-x-1">
            <button 
              @click="goToPage(pagination.page - 1)" 
              :disabled="pagination.page === 1"
              :class="[
                'px-3 py-1 rounded-md',
                pagination.page === 1 
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              ]"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <button 
              v-for="page in displayedPages" 
              :key="page" 
              @click="goToPage(page)"
              :class="[
                'px-3 py-1 rounded-md',
                page === pagination.page 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              ]"
            >
              {{ page }}
            </button>
            
            <button 
              @click="goToPage(pagination.page + 1)" 
              :disabled="pagination.page === pagination.pages"
              :class="[
                'px-3 py-1 rounded-md',
                pagination.page === pagination.pages 
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              ]"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { campingSpotAPI } from '@/services/api'

export default {
  name: 'CampingSpots',
  data() {
    return {
      campingSpots: [],
      pagination: {
        page: 1,
        limit: 9,
        total: 0,
        pages: 0
      },
      filters: {
        location: '',
        priceRange: '',
        capacity: '',
        selectedAmenities: [],
        sort: 'price_asc',
        appliedAmenities: []
      },
      isLoading: false,
      showAmenitiesDropdown: false,
      amenitiesList: [
        { id: 'WiFi', name: 'WiFi' },
        { id: 'Parking', name: 'Parking' },
        { id: 'Shower', name: 'Shower' },
        { id: 'Toilet', name: 'Toilet' },
        { id: 'Fire Pit', name: 'Fire Pit' },
        { id: 'Picnic Table', name: 'Picnic Table' },
        { id: 'Pets Allowed', name: 'Pets Allowed' },
        { id: 'Electricity', name: 'Electricity' },
        { id: 'Water', name: 'Water' },
        { id: 'Hiking Trails', name: 'Hiking Trails' }
      ],
      isMobile: false
    }
  },
  computed: {
    pageTitle() {
      if (this.filters.location) {
        return `Camping Spots in ${this.filters.location}`
      }
      return 'Explore Camping Spots'
    },
    hasActiveFilters() {
      return (
        this.filters.location ||
        this.filters.priceRange ||
        this.filters.capacity ||
        this.filters.selectedAmenities.length > 0
      )
    },
    displayedPages() {
      const { page, pages } = this.pagination
      const maxPagesToShow = 5
      
      if (pages <= maxPagesToShow) {
        // If total pages is less than the max to show, display all pages
        return Array.from({ length: pages }, (_, i) => i + 1)
      }
      
      // Calculate start and end page numbers
      let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1
      
      // Adjust if end page exceeds total pages
      if (endPage > pages) {
        endPage = pages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }
      
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    }
  },
  methods: {
    async fetchCampingSpots() {
      console.log('fetchCampingSpots called')
      try {
        this.isLoading = true
        console.log('Fetching camping spots with params:', {
          page: this.pagination.page,
          limit: this.pagination.limit,
          location: this.filters.location,
          capacity: this.filters.capacity,
          priceRange: this.filters.priceRange,
          amenities: this.filters.appliedAmenities,
          sort: this.filters.sort
        })
        
        // Build query parameters
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        if (this.filters.location) {
          params.location = this.filters.location
        }
        
        if (this.filters.capacity) {
          params.capacity = this.filters.capacity
        }
        
        // Parse price range
        if (this.filters.priceRange) {
          const [min, max] = this.filters.priceRange.split('-')
          if (min) params.minPrice = min
          if (max) params.maxPrice = max
        }
        
        // Add amenities filter if any are selected
        if (this.filters.appliedAmenities.length > 0) {
          params.amenities = this.filters.appliedAmenities.join(',')
        }
        
        // Apply sorting
        if (this.filters.sort) {
          const [field, direction] = this.filters.sort.split('_')
          params.sortBy = field
          params.sortDir = direction
        }
        
        console.log('Making API request with params:', params)
        const response = await campingSpotAPI.getCampingSpots(params)
        console.log('Camping spots API response:', response)
        console.log('Camping spots data:', response.data)
        
        // Add detailed logging for the first camping spot's images
        if (response.data && response.data.length > 0) {
          const firstSpot = response.data[0]
          console.log('First camping spot:', firstSpot)
          console.log('First camping spot images:', firstSpot.images)
          console.log('First camping spot images type:', typeof firstSpot.images)
          console.log('First camping spot images is array:', Array.isArray(firstSpot.images))
          if (Array.isArray(firstSpot.images) && firstSpot.images.length > 0) {
            console.log('First image in array:', firstSpot.images[0])
            console.log('First image type:', typeof firstSpot.images[0])
            if (typeof firstSpot.images[0] === 'object') {
              console.log('First image object keys:', Object.keys(firstSpot.images[0]))
            }
          }
        }
        
        this.campingSpots = response.data || []
        this.pagination = {
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 9,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }
      } catch (error) {
        console.error('Error fetching camping spots:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        })
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load camping spots'
        })
      } finally {
        this.isLoading = false
      }
    },
    
    toggleAmenitiesDropdown() {
      this.showAmenitiesDropdown = !this.showAmenitiesDropdown
    },
    
    applyAmenities() {
      this.filters.appliedAmenities = [...this.filters.selectedAmenities]
      this.showAmenitiesDropdown = false
      this.pagination.page = 1 // Reset to first page
      this.fetchCampingSpots()
    },
    
    clearAmenities() {
      this.filters.selectedAmenities = []
      this.filters.appliedAmenities = []
      this.showAmenitiesDropdown = false
      this.fetchCampingSpots()
    },
    
    clearFilter(filterName) {
      if (filterName === 'selectedAmenities') {
        this.filters.selectedAmenities = []
        this.filters.appliedAmenities = []
      } else {
        this.filters[filterName] = ''
      }
      this.pagination.page = 1 // Reset to first page
      this.fetchCampingSpots()
    },
    
    clearAllFilters() {
      this.filters = {
        location: '',
        priceRange: '',
        capacity: '',
        selectedAmenities: [],
        appliedAmenities: [],
        sort: 'price_asc'
      }
      this.pagination.page = 1 // Reset to first page
      this.fetchCampingSpots()
    },
    
    goToPage(page) {
      if (page < 1 || page > this.pagination.pages) return
      this.pagination.page = page
      this.fetchCampingSpots()
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    
    viewSpotDetails(id) {
      this.$router.push(`/camping-spots/${id}`)
    },
    
    getFirstImage(images) {
      const defaultImage = 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
      
      console.log('getFirstImage called with:', images)
      console.log('images type:', typeof images)
      console.log('is array:', Array.isArray(images))
      
      try {
        if (!images) {
          console.log('No images provided, returning default')
          return defaultImage
        }
        
        // If images is an array, get the first one
        if (Array.isArray(images) && images.length > 0) {
          console.log('Images is an array, getting first image')
          const firstImage = images[0]
          console.log('First array image:', firstImage)
          console.log('First image type:', typeof firstImage)
          
          // Check if firstImage is an object with a url property
          if (firstImage && typeof firstImage === 'object') {
            console.log('First image is an object, keys:', Object.keys(firstImage))
            if (firstImage.url) {
              console.log('Found image object with URL:', firstImage.url)
              const formattedUrl = this.formatImageUrl(firstImage.url)
              console.log('Formatted URL:', formattedUrl)
              return formattedUrl
            }
          }
          
          // If firstImage is a string
          if (typeof firstImage === 'string') {
            console.log('First image is a string:', firstImage)
            const formattedUrl = this.formatImageUrl(firstImage)
            console.log('Formatted URL:', formattedUrl)
            return formattedUrl
          }
        }
        
        console.log('No valid image found, returning default')
        return defaultImage
      } catch (e) {
        console.error('Error parsing images:', e)
        return defaultImage
      }
    },
    
    formatImageUrl(url) {
      console.log('formatImageUrl called with:', url)
      if (!url) {
        console.log('No URL provided')
        return ''
      }
      if (url.startsWith('http')) {
        console.log('URL is already absolute:', url)
        return url
      }
      const formattedUrl = `http://localhost:3000${url.startsWith('/') ? url : '/' + url}`
      console.log('Formatted relative URL:', formattedUrl)
      return formattedUrl
    },
    
    isValidImageUrl(url) {
      if (!url) return false
      if (typeof url !== 'string') return false
      if (url.startsWith('blob:')) return false
      
      // Check if the URL is a valid image URL
      try {
        const urlObj = new URL(url)
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
      } catch (e) {
        // If URL parsing fails, it might be a relative path
        return true
      }
    },
    
    handleImageError(event) {
      console.warn('Image failed to load:', event.target.src)
      event.target.src = 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
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
    
    formatPriceRange(range) {
      if (!range) return ''
      
      const [min, max] = range.split('-')
      
      if (min && max) {
        return `€${min} - €${max}`
      } else if (min) {
        return `Over €${min}`
      } else if (max) {
        return `Under €${max}`
      }
      
      return range
    },
    
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768
    },
    
    // Apply URL query parameters
    applyQueryParams() {
      const query = this.$route.query
      
      if (query.location) {
        this.filters.location = query.location
      }
      
      if (query.capacity) {
        this.filters.capacity = query.capacity
      }
      
      if (query.minPrice && query.maxPrice) {
        this.filters.priceRange = `${query.minPrice}-${query.maxPrice}`
      } else if (query.minPrice) {
        this.filters.priceRange = `${query.minPrice}+`
      } else if (query.maxPrice) {
        this.filters.priceRange = `0-${query.maxPrice}`
      }
      
      if (query.amenities) {
        const amenitiesList = query.amenities.split(',')
        this.filters.selectedAmenities = amenitiesList
        this.filters.appliedAmenities = amenitiesList
      }
      
      if (query.page) {
        this.pagination.page = parseInt(query.page)
      }
      
      if (query.sort) {
        this.filters.sort = query.sort
      }
    }
  },
  created() {
    console.log('CampingSpots component created')
    this.fetchCampingSpots()
  },
  mounted() {
    console.log('CampingSpots component mounted')
    this.applyQueryParams()
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
    
    // Close amenities dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (this.showAmenitiesDropdown && !e.target.closest('.amenities-dropdown') && !e.target.closest('button')) {
        this.showAmenitiesDropdown = false
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile)
  },
  watch: {
    // Watch for filter changes
    'filters.location'() {
      this.pagination.page = 1
      this.fetchCampingSpots()
    },
    'filters.priceRange'() {
      this.pagination.page = 1
      this.fetchCampingSpots()
    },
    'filters.capacity'() {
      this.pagination.page = 1
      this.fetchCampingSpots()
    },
    'filters.sort'() {
      this.fetchCampingSpots()
    },
    // Watch for route query changes
    '$route.query'() {
      this.applyQueryParams()
      this.fetchCampingSpots()
    }
  }
}
</script>
<style scoped>
.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  transition: transform 0.2s ease-in-out;
}

.spot-image:hover {
  transform: scale(1.05);
}

.image-container {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}
</style>
