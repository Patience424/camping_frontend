<!-- UserReviews.vue 
This is a Vue.js component for the user reviews page of a camping booking application.
It allows users to view, edit, and delete their reviews for camping spots.
It includes features for displaying reviews, editing them in a modal, and deleting them with confirmation.
It also handles loading states, error handling, and responsive design for better user experience.
-->
<template>
  <div class="min-h-screen bg-neutral-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Your Reviews</h1>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- No Reviews -->
      <div v-else-if="reviews.length === 0" class="text-center py-20">
        <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">No reviews yet</h3>
        <p class="text-neutral-600 mb-6">Share your experiences and help others find great camping spots!</p>
        <router-link to="/bookings" class="btn-primary">
          View Your Bookings
        </router-link>
      </div>
      
      <!-- Reviews List -->
      <div v-else class="space-y-6">
        <div 
          v-for="review in reviews" 
          :key="review.id" 
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="md:flex">
            <!-- Camping Spot Image -->
            <div class="md:w-1/4 h-48 md:h-auto relative">
              <img 
                :src="getFirstImage(review.campingSpot.images)" 
                :alt="review.campingSpot.name"
                class="w-full h-full object-cover"
              >
            </div>
            
            <!-- Review Details -->
            <div class="p-6 md:w-3/4">
              <div class="mb-4">
                <h3 class="text-xl font-bold mb-2">{{ review.campingSpot.name }}</h3>
                <p class="text-neutral-600 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ review.campingSpot.location }}
                </p>
              </div>
              
              <!-- Rating -->
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <svg 
                    v-for="i in 5" 
                    :key="i"
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-5 w-5" 
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-neutral-200'"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="ml-2 text-sm text-neutral-500">
                  {{ formatDate(review.createdAt) }}
                </span>
              </div>
              
              <!-- Review Comment -->
              <p class="text-neutral-700 mb-6">{{ review.comment }}</p>
              
              <!-- Actions -->
              <div class="flex flex-wrap gap-4">
                <router-link 
                  :to="`/camping-spots/${review.campingSpot.id}`" 
                  class="btn-primary"
                >
                  View Camping Spot
                </router-link>
                
                <button 
                  @click="editReview(review)"
                  class="btn-outline"
                >
                  Edit Review
                </button>
                
                <button 
                  @click="deleteReview(review.id)"
                  class="btn-outline text-error border-error hover:bg-error/5"
                  :disabled="isDeleting === review.id"
                >
                  <span v-if="isDeleting === review.id">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                  <span v-else>Delete Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Review Modal -->
      <div 
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
          <h3 class="text-xl font-bold mb-4">Edit Review</h3>
          
          <div class="mb-6">
            <label class="form-label">Rating</label>
            <div class="flex space-x-2">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="editedReview.rating = i"
                class="focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-8 w-8" 
                  :class="i <= editedReview.rating ? 'text-yellow-400' : 'text-neutral-200'"
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="mb-6">
            <label for="comment" class="form-label">Comment</label>
            <textarea 
              id="comment"
              v-model="editedReview.comment"
              rows="4"
              class="form-input"
              :class="{ 'border-red-300': error }"
            ></textarea>
            <p v-if="error" class="form-error">{{ error }}</p>
          </div>
          
          <div class="flex justify-end space-x-4">
            <button 
              @click="showEditModal = false"
              class="btn-outline"
            >
              Cancel
            </button>
            <button 
              @click="updateReview"
              class="btn-primary"
              :disabled="isUpdating"
            >
              <span v-if="isUpdating">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span v-else>Update Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import reviewAPI from '../../services/reviewAPI'

export default {
  name: 'UserReviews',
  data() {
    return {
      reviews: [],
      isLoading: true,
      isDeleting: null,
      showEditModal: false,
      editedReview: {
        id: null,
        rating: 5,
        comment: ''
      },
      isUpdating: false,
      error: ''
    }
  },
  methods: {
    async fetchReviews() {
      try {
        this.isLoading = true
        const response = await reviewAPI.getAll()
        this.reviews = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load reviews'
        })
        this.reviews = [] // fallback on error
      } finally {
        this.isLoading = false
      }
    },
    
    editReview(review) {
      this.editedReview = {
        id: review.id,
        rating: review.rating,
        comment: review.comment
      }
      this.showEditModal = true
    },
    
    async updateReview() {
      try {
        this.isUpdating = true
        this.error = ''
        
        if (!this.editedReview.comment) {
          this.error = 'Please enter a comment'
          return
        }
        
        await reviewAPI.update(this.editedReview.id, {
          rating: this.editedReview.rating,
          comment: this.editedReview.comment
        })
        
        // Update review in the list
        const index = this.reviews.findIndex(r => r.id === this.editedReview.id)
        if (index !== -1) {
          this.reviews[index] = {
            ...this.reviews[index],
            rating: this.editedReview.rating,
            comment: this.editedReview.comment
          }
        }
        
        this.showEditModal = false
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Review updated successfully'
        })
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update review'
      } finally {
        this.isUpdating = false
      }
    },
    
    async deleteReview(id) {
      try {
        if (!confirm('Are you sure you want to delete this review?')) return
        
        this.isDeleting = id
        await reviewAPI.delete(id)
        
        // Remove review from list
        this.reviews = this.reviews.filter(r => r.id !== id)
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Review deleted successfully'
        })
      } catch (error) {
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response?.data?.message || 'Failed to delete review'
        })
      } finally {
        this.isDeleting = null
      }
    },
    
    getFirstImage(images) {
      const backendUrl = 'http://localhost:3000';
      if (!images) return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600';

      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            let img = parsed[0];
            if (typeof img === 'object' && img.url) img = img.url;
            if (img && !img.startsWith('http')) return `${backendUrl}/${img.replace(/^\/?/, '')}`;
            return img;
          }
        } catch (e) {
          if (images.startsWith('http')) return images;
          return `${backendUrl}/${images.replace(/^\/?/, '')}`;
        }
      }

      if (Array.isArray(images) && images.length > 0) {
        let img = images[0];
        if (typeof img === 'object' && img.url) img = img.url;
        if (img && !img.startsWith('http')) return `${backendUrl}/${img.replace(/^\/?/, '')}`;
        return img;
      }

      return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600';
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    }
  },
  mounted() {
    this.fetchReviews()
  }
}
</script>