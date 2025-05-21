<template>
  <div class="owner-camping-spots">
    <div class="header">
      <h1>My Camping Spots</h1>
      <router-link to="/owner/camping-spots/new" class="btn-primary">
        Add New Camping Spot
      </router-link>
    </div>

    <div class="spots-list">
      <div v-if="isLoading" class="loading">
        Loading camping spots...
      </div>
      <div v-else-if="campingSpots.length" class="spots-grid">
        <div v-for="spot in campingSpots" :key="spot.id" class="spot-card">
          <div class="image-carousel">
            <img 
              v-for="(image, index) in spot.images" 
              :key="index"
              :src="image" 
              :alt="spot.name"
              class="spot-image"
              :class="{ active: currentImageIndex[spot.id] === index }"
            >
            <div v-if="spot.images.length > 1" class="carousel-controls">
              <button 
                @click="prevImage(spot.id)" 
                class="carousel-btn prev"
                :disabled="currentImageIndex[spot.id] === 0"
              >
                ‹
              </button>
              <button 
                @click="nextImage(spot.id)" 
                class="carousel-btn next"
                :disabled="currentImageIndex[spot.id] === spot.images.length - 1"
              >
                ›
              </button>
            </div>
            <div v-if="spot.images.length > 1" class="carousel-dots">
              <button
                v-for="(_, index) in spot.images"
                :key="index"
                @click="setImageIndex(spot.id, index)"
                class="dot"
                :class="{ active: currentImageIndex[spot.id] === index }"
              ></button>
            </div>
          </div>
          <div class="spot-info">
            <h3>{{ spot.name }}</h3>
            <p class="location">{{ spot.location }}</p>
            <p class="price">€{{ spot.pricePerNight }} per night</p>
            <div class="status" :class="(spot.status || 'active').toLowerCase()">
              {{ spot.status || 'Active' }}
            </div>
            <div class="actions">
              <router-link :to="`/owner/camping-spots/${spot.id}/edit`" class="btn-edit">
                Edit
              </router-link>
              <button @click="deleteSpot(spot.id)" class="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="no-spots">You haven't added any camping spots yet.</p>
    </div>
  </div>
</template>

<script>
import { ownerAPI } from '@/services/api'

export default {
  name: 'OwnerCampingSpots',
  data() {
    return {
      campingSpots: [],
      currentImageIndex: {},
      isLoading: false
    }
  },
  async created() {
    await this.fetchCampingSpots()
  },
  methods: {
    async fetchCampingSpots() {
      try {
        this.isLoading = true
        const response = await ownerAPI.getCampingSpots()
        console.log('API Response:', response)
        console.log('Response data:', response.data)
        this.campingSpots = Array.isArray(response.data.data) ? response.data.data : []
        console.log('Camping spots after assignment:', this.campingSpots)
        
        // Initialize current image index for each spot
        this.campingSpots.forEach(spot => {
          this.$set(this.currentImageIndex, spot.id, 0)
        })
      } catch (error) {
        console.error('Error fetching camping spots:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load camping spots'
        })
      } finally {
        this.isLoading = false
      }
    },
    prevImage(spotId) {
      if (this.currentImageIndex[spotId] > 0) {
        this.$set(this.currentImageIndex, spotId, this.currentImageIndex[spotId] - 1)
      }
    },
    nextImage(spotId) {
      const spot = this.campingSpots.find(s => s.id === spotId)
      if (this.currentImageIndex[spotId] < spot.images.length - 1) {
        this.$set(this.currentImageIndex, spotId, this.currentImageIndex[spotId] + 1)
      }
    },
    setImageIndex(spotId, index) {
      this.$set(this.currentImageIndex, spotId, index)
    },
    async deleteSpot(id) {
      if (confirm('Are you sure you want to delete this camping spot?')) {
        try {
          await ownerAPI.deleteCampingSpot(id)
          this.campingSpots = this.campingSpots.filter(spot => spot.id !== id)
          this.$store.commit('setNotification', {
            type: 'success',
            message: 'Camping spot deleted successfully'
          })
        } catch (error) {
          console.error('Error deleting camping spot:', error)
          this.$store.commit('setNotification', {
            type: 'error',
            message: 'Failed to delete camping spot'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.owner-camping-spots {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.spot-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-carousel {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.spot-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spot-image.active {
  opacity: 1;
}

.spot-info {
  padding: 1.5rem;
}

.spot-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.location {
  color: #666;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  color: #42b983;
  margin-bottom: 1rem;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.status.active {
  background: #e3fcef;
  color: #42b983;
}

.status.inactive {
  background: #fee2e2;
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.btn-edit {
  background: #e3fcef;
  color: #42b983;
}

.btn-delete {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  cursor: pointer;
}

.no-spots {
  text-align: center;
  color: #666;
  margin-top: 2rem;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: none;
}

.carousel-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: background-color 0.2s;
}

.carousel-btn:hover {
  background: white;
}

.carousel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s;
}

.dot.active {
  background: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}
</style> 