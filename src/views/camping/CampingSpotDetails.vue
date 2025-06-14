<!--  
  It is a Vue.js component for displaying details of a specific camping spot, including images, reviews, and booking options.
  The component fetches data from an API and allows users to book the spot, write reviews, and view amenities.
  It also includes loading states and error handling for better user experience.
-->
<template>
  <div class="min-h-screen bg-neutral-50">
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>


    <div v-else-if="!spot" class="flex flex-col items-center justify-center min-h-screen">
      <svg class="w-16 h-16 text-neutral-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-semibold mb-2">Camping spot not found</h2>
      <p class="text-neutral-600 mb-6">The camping spot you're looking for doesn't exist or has been removed.</p>
      <router-link to="/camping-spots" class="btn-primary">Browse Camping Spots</router-link>
    </div>

    <div v-else class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ spot.name }}</h1>
        <div class="flex items-center text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          <span>{{ spot.location }}</span>
          <span class="mx-2">•</span>
          <div v-if="spot.averageRating !== null && spot.averageRating !== undefined" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="ml-1">{{ spot.averageRating.toFixed(1) }}</span>
            <span class="ml-1">({{ spot.reviewCount || 0 }} reviews)</span>
          </div>
        </div>
      </div>

      <!-- Image Gallery -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div v-if="spot.images && spot.images.length > 0" class="relative h-96 rounded-lg overflow-hidden">
            <img 
              :src="normalizedImages[0]?.url" 
              :alt="spot.name"
              class="w-full h-full object-cover"
            />

          </div>
          <div v-if="normalizedImages.length > 1" class="grid grid-cols-2 gap-4">
            <div
              v-for="(image, index) in normalizedImages.slice(1, 5)"
              :key="index"
              class="relative h-44 rounded-lg overflow-hidden"
            >
              <img 
                :src="image.url" 
                :alt="`${spot.name} - Image ${index + 2}`"
                class="w-full h-full object-cover"
              >
            </div>
          </div>

          <div v-if="!spot.images || spot.images.length === 0" class="relative h-96 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <button 
          v-if="spot.images && spot.images.length > 5"
          @click="showAllPhotos = true"
          class="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Show all {{ spot.images.length }} photos
        </button>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2">
          <!-- Description -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-4">About this camping spot</h2>
            <p class="text-neutral-600 whitespace-pre-line">{{ spot.description }}</p>
          </div>

          <!-- Amenities -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-4">Amenities</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="amenity in spot.amenities" :key="amenity" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>{{ amenity }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold">Reviews</h2>
              <button 
                v-if="isAuthenticated && isUser"
                @click="showReviewForm = true"
                class="btn-primary"
              >
                Write a Review
              </button>
            </div>

            <!-- Review Form -->
            <div v-if="showReviewForm" class="mb-8">
              <form @submit.prevent="submitReview" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-neutral-700 mb-1">Rating</label>
                  <div class="flex items-center">
                    <button 
                      v-for="rating in 5" 
                      :key="rating"
                      type="button"
                      @click="review.rating = rating"
                      class="focus:outline-none"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="h-8 w-8"
                        :class="rating <= review.rating ? 'text-yellow-400' : 'text-neutral-300'"
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label for="review" class="block text-sm font-medium text-neutral-700 mb-1">Your Review</label>
                  <textarea
                    id="review"
                    v-model="review.comment"
                    rows="4"
                    class="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Share your experience..."
                    required
                  ></textarea>
                </div>
                <div class="flex justify-end space-x-4">
                  <button 
                    type="button"
                    @click="showReviewForm = false"
                    class="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    class="btn-primary"
                    :disabled="isSubmittingReview"
                  >
                    {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Reviews List -->
            <div v-if="spot.reviews && spot.reviews.length > 0" class="space-y-6">
              <div 
                v-for="review in spot.reviews" 
                :key="review.id"
                class="border-b border-neutral-200 pb-6 last:border-0 last:pb-0"
              >
                <div class="flex items-center mb-2">
                  <div class="flex items-center">
                    <svg 
                      v-for="rating in 5" 
                      :key="rating"
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-5 w-5"
                      :class="rating <= review.rating ? 'text-yellow-400' : 'text-neutral-300'"
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-neutral-600">{{ review.user.name }}</span>
                  <span class="mx-2 text-neutral-400">•</span>
                  <span class="text-sm text-neutral-600">{{ formatDate(review.createdAt) }}</span>
                </div>
                <p class="text-neutral-600">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-neutral-600">No reviews yet. Be the first to review this camping spot!</p>
            </div>
          </div>
        </div>

        <!-- Right Column - Booking Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div class="mb-6">
              <div class="flex items-baseline mb-2">
                <span class="text-2xl font-bold">€{{ formatPrice(spot.pricePerNight) }}</span>
                <span class="text-neutral-600 ml-1">/night</span>
              </div>
              <div class="flex items-center text-neutral-600">
                <svg 
                  v-for="rating in 5" 
                  :key="rating"
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4"
                  :class="spot.averageRating && rating <= spot.averageRating ? 'text-yellow-400' : 'text-neutral-300'"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span v-if="spot.averageRating" class="ml-1">{{ spot.averageRating.toFixed(1) }}</span>
                <span class="ml-1">({{ spot.reviewCount || 0 }} reviews)</span>
              </div>
            </div>

            <form @submit.prevent="checkAvailability" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="startDate" class="block text-sm font-medium text-neutral-700 mb-1">Check-in</label>
                  <input
                    id="startDate"
                    v-model="booking.startDate"
                    type="date"
                    :min="minDate"
                    required
                    class="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                </div>
                <div>
                  <label for="endDate" class="block text-sm font-medium text-neutral-700 mb-1">Check-out</label>
                  <input
                    id="endDate"
                    v-model="booking.endDate"
                    type="date"
                    :min="booking.startDate || minDate"
                    required
                    class="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                </div>
              </div>

              <div>
                <label for="guestCount" class="block text-sm font-medium text-neutral-700 mb-1">Guests</label>
                <select
                  id="guestCount"
                  v-model="booking.guestCount"
                  required
                  class="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option v-for="n in spot.capacity" :key="n" :value="n">{{ n }} {{ n === 1 ? 'guest' : 'guests' }}</option>
                </select>
              </div>

              <div v-if="availabilityStatus" class="p-4 rounded-md" :class="availabilityStatus === 'available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                {{ availabilityMessage }}
              </div>

              <div v-if="bookingCalculation.nights > 0" class="space-y-2 pt-4 border-t border-neutral-200">
                <div class="flex justify-between">
                  <span>€{{ formatPrice(spot.pricePerNight) }} × {{ bookingCalculation.nights }} nights</span>
                  <span>€{{ formatPrice(bookingCalculation.subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Service fee</span>
                  <span>€{{ formatPrice(bookingCalculation.serviceFee) }}</span>
                </div>
                <div class="flex justify-between font-bold pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>€{{ formatPrice(bookingCalculation.total) }}</span>
                </div>
              </div>

              <button 
                type="submit"
                class="btn-primary btn-block"
                :disabled="isCheckingAvailability || !booking.startDate || !booking.endDate"
              >
                {{ isCheckingAvailability ? 'Checking...' : 'Check Availability' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <h2 class="text-2xl font-semibold mb-4">Complete Your Booking</h2>
        <form @submit.prevent="submitBooking" class="space-y-4">
          <div>
            <label for="specialRequests" class="block text-sm font-medium text-neutral-700 mb-1">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              v-model="booking.specialRequests"
              rows="4"
              class="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Any special requests or requirements?"
            ></textarea>
          </div>

          <div class="space-y-2 pt-4 border-t border-neutral-200">
            <div class="flex justify-between">
              <span>€{{ formatPrice(spot.pricePerNight) }} × {{ bookingCalculation.nights }} nights</span>
              <span>€{{ formatPrice(bookingCalculation.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Service fee</span>
              <span>€{{ formatPrice(bookingCalculation.serviceFee) }}</span>
            </div>
            <div class="flex justify-between font-bold pt-2 border-t border-neutral-200">
              <span>Total</span>
              <span>€{{ formatPrice(bookingCalculation.total) }}</span>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button 
              type="button"
              @click="showBookingModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="btn-primary"
              :disabled="isSubmittingBooking"
            >
              {{ isSubmittingBooking ? 'Processing...' : 'Confirm Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { campingSpotAPI, bookingAPI, reviewAPI } from '@/services/api'

export default {
  name: 'CampingSpotDetails',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      spot: {
        images: [],
        name: '',
        location: '',
        description: '',
        pricePerNight: 0,
        capacity: 1,
        amenities: [],
        reviews: [],
        averageRating: null,
        reviewCount: 0
      },
      isLoading: true,
      showAllPhotos: false,
      showReviewForm: false,
      showBookingModal: false,
      review: {
        rating: 5,
        comment: ''
      },
      booking: {
        startDate: '',
        endDate: '',
        guestCount: 1,
        specialRequests: ''
      },
      isSubmittingReview: false,
      isSubmittingBooking: false,
      isCheckingAvailability: false,
      availabilityStatus: null,
      availabilityMessage: '',
      bookingCalculation: {
        nights: 0,
        subtotal: 0,
        serviceFee: 0,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'userId', 'isUser']),
    normalizedImages() {
      console.log('Raw spot images:', this.spot?.images)
      if (!this.spot || !this.spot.images) return []
      
      const normalized = this.spot.images.map(img => {
        console.log('Processing image:', img)
        let url = ''
        
        if (typeof img === 'string') {
          url = img
        } else if (typeof img === 'object') {
          url = img.url || img.path || ''
        }
        
        if (!url) {
          console.warn('Invalid image format:', img)
          return null
        }
        
        // If it's already a full URL, use it as is
        if (url.startsWith('http')) {
          return { url }
        }
        
        // Otherwise, prepend the API base URL
        return { url: `http://localhost:3000${url.startsWith('/') ? url : '/' + url}` }
      }).filter(Boolean)
      
      console.log('Normalized images:', normalized)
      return normalized
    },
    spotId() {
      const id = parseInt(this.id)
      if (isNaN(id)) {
        console.error('Invalid camping spot ID:', this.id)
        return null
      }
      return id
    },
    
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  methods: {
    formatPrice(price) {
      return price.toFixed(2)
    },

    async fetchCampingSpot() {
      try {
        this.isLoading = true
        console.log('Fetching camping spot with ID:', this.spotId)
        if (!this.spotId) {
          throw new Error('Invalid camping spot ID')
        }
        const response = await campingSpotAPI.getById(this.spotId)
        console.log('Camping spot full response:', JSON.stringify(response, null, 2))
        console.log('Response type:', typeof response)
        console.log('Response data type:', typeof response.data)
        console.log('Response images:', response?.images)
        console.log('Response images type:', typeof response?.images)
        console.log('Response images is array:', Array.isArray(response?.images))
        
        this.spot = response
        console.log('Spot after assignment:', JSON.stringify(this.spot, null, 2))
        console.log('Spot images after assignment:', this.spot.images)
        console.log('Spot images type after assignment:', typeof this.spot.images)
        console.log('Spot images is array after assignment:', Array.isArray(this.spot.images))

      } catch (error) {
        console.error('Error fetching camping spot:', error)
        console.error('Error response:', error.response)
        console.error('Error status:', error.response?.status)
        console.error('Error data:', error.response?.data)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load camping spot details'
        })
      } finally {
        this.isLoading = false
      }
    },
    getImageUrl(path) {
    if (!path) return '';
    if (typeof path === 'object') path = path.url; // support { url: '...' }
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path.startsWith('/') ? path : '/' + path}`;
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    async submitReview() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      if (!this.isUser) {
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Only regular users can submit reviews'
        })
        return
      }

      try {
        this.isSubmittingReview = true
        console.log('Submitting review with data:', {
          campingSpotId: this.spotId,
          rating: this.review.rating,
          comment: this.review.comment
        })
        
        await reviewAPI.create({
          campingSpotId: this.spotId,
          rating: this.review.rating,
          comment: this.review.comment
        })
        
        this.showReviewForm = false
        this.review = { rating: 5, comment: '' }
        await this.fetchCampingSpot()
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Review submitted successfully'
        })
      } catch (error) {
        console.error('Error submitting review:', error)
        console.error('Error response:', error.response)
        console.error('Error status:', error.response?.status)
        console.error('Error data:', error.response?.data)
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response?.data?.message || 'Failed to submit review'
        })
      } finally {
        this.isSubmittingReview = false
      }
    },

    calculateBookingDetails() {
      if (!this.booking.startDate || !this.booking.endDate) {
        this.bookingCalculation = {
          nights: 0,
          subtotal: 0,
          serviceFee: 0,
          total: 0
        }
        return
      }

      const start = new Date(this.booking.startDate)
      const end = new Date(this.booking.endDate)
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      
      const subtotal = nights * this.spot.pricePerNight
      const serviceFee = Math.round(subtotal * 0.1) // 10% service fee
      const total = subtotal + serviceFee

      this.bookingCalculation = {
        nights,
        subtotal,
        serviceFee,
        total
      }
    },

    async checkAvailability() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      try {
        this.isCheckingAvailability = true
        const response = await campingSpotAPI.checkAvailability(this.spotId, {
          startDate: this.booking.startDate,
          endDate: this.booking.endDate,
          guestCount: this.booking.guestCount
        })

        if (response.available) {
          this.availabilityStatus = 'available'
          this.availabilityMessage = response.message || 'These dates are available!'
          this.showBookingModal = true
        } else {
          this.availabilityStatus = 'unavailable'
          this.availabilityMessage = response.message || 'These dates are not available. Please try different dates.'
        }
      } catch (error) {
        console.error('Error checking availability:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to check availability'
        })
      } finally {
        this.isCheckingAvailability = false
      }
    },

    async submitBooking() {
      try {
        this.isSubmittingBooking = true
        await bookingAPI.create({
          campingSpotId: this.spotId,
          startDate: this.booking.startDate,
          endDate: this.booking.endDate,
          guestCount: this.booking.guestCount,
          specialRequests: this.booking.specialRequests
        })

        this.showBookingModal = false
        this.$router.push('/bookings')
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Booking confirmed successfully'
        })
      } catch (error) {
        console.error('Error submitting booking:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to confirm booking'
        })
      } finally {
        this.isSubmittingBooking = false
      }
    }
  },
  watch: {
    'booking.startDate'() {
      this.calculateBookingDetails()
    },
    'booking.endDate'() {
      this.calculateBookingDetails()
    },
    'booking.guestCount'() {
      this.calculateBookingDetails()
    },
    '$route.params.id'() {
      this.fetchCampingSpot()
    }
  },
  created() {
    this.fetchCampingSpot()
  }
}
</script>

<style scoped>
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: white;
  transition: all 0.2s;
  transform: translateZ(0);
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.25), 0 3px 6px -1px rgba(37, 99, 235, 0.15);
  transform: scale(1.02);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px white;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
  box-shadow: none;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  background: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px white;
}

/* Modal button styles */
.modal .btn-primary {
  width: auto;
}

.modal .btn-secondary {
  width: auto;
}

/* Availability status styles */
.availability-status {
  transition: all 0.3s ease-in-out;
}

.availability-status.available {
  background-color: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.availability-status.unavailable {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Booking calculation styles */
.booking-calculation {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.booking-calculation-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.booking-calculation-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  font-size: 1rem;
}

.btn-block {
  width: 100%;
  display: block;
}
</style>