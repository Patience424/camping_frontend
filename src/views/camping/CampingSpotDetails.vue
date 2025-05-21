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
          <div class="relative h-96 rounded-lg overflow-hidden">
            <img 
              :src="spot.images[0]" 
              :alt="spot.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(image, index) in spot.images.slice(1, 5)" :key="index" class="relative h-44 rounded-lg overflow-hidden">
              <img 
                :src="image" 
                :alt="`${spot.name} - Image ${index + 2}`"
                class="w-full h-full object-cover"
              >
            </div>
          </div>
        </div>
        <button 
          v-if="spot.images.length > 5"
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
                v-if="isAuthenticated"
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
                  <span class="ml-2 text-sm text-neutral-600">{{ review.userName }}</span>
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
                class="w-full btn-primary"
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
import { campingSpotAPI } from '@/services/api'

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
      spot: null,
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
    ...mapGetters(['isAuthenticated', 'userId']),
    
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
        console.log('Camping spot response:', response)
        this.spot = response
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

      try {
        this.isSubmittingReview = true
        await campingSpotAPI.createReview(this.spotId, {
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
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to submit review'
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

        if (response.data.available) {
          this.availabilityStatus = 'available'
          this.availabilityMessage = 'These dates are available!'
          this.showBookingModal = true
        } else {
          this.availabilityStatus = 'unavailable'
          this.availabilityMessage = 'These dates are not available. Please try different dates.'
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
        await campingSpotAPI.createBooking(this.spotId, {
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
  background-color: var(--color-primary-600);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-500);
  box-shadow: 0 0 0 4px white;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: var(--color-neutral-700);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-neutral-300);
}

.btn-secondary:hover {
  background-color: var(--color-neutral-50);
}

.btn-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-500);
  box-shadow: 0 0 0 4px white;
}
</style>