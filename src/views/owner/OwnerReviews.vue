<!-- OwnerReviews.vue 
This is a Vue.js component for the owner reviews management page of a camping booking application.
// It allows administrators to view, search, filter, and manage user reviews for camping spots.
// It includes features for approving, rejecting, and deleting reviews, as well as displaying user and camping spot information. 
-->
<template>
  <div class="owner-reviews">
    <div class="header">
      <h1>Reviews Management</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search reviews..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="filters">
      <select v-model="ratingFilter" @change="handleFilter">
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>
      <select v-model="campingSpotFilter" @change="handleFilter">
        <option value="">All Camping Spots</option>
        <option v-for="spot in uniqueCampingSpots" :key="spot.id" :value="spot.id">
          {{ spot.name }}
        </option>
      </select>
    </div>

    <div class="reviews-grid">
      <div v-for="review in filteredReviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="user-info">
            <h3>{{ review.user?.name }}</h3>
            <p class="camping-spot">{{ review.campingSpot?.name }}</p>
            <p class="location">{{ review.campingSpot?.location }}</p>
          </div>
          <div class="review-meta">
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= review.rating ? '★' : '☆' }}
              </span>
            </div>
            <span class="date">{{ formatDate(review.createdAt) }}</span>
          </div>
        </div>

        <div class="review-content">
          <p>{{ review.comment }}</p>
        </div>

        <div class="review-footer">
          <div class="actions">
            <!-- Delete button removed -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ownerAPI } from '@/services/api'

export default {
  name: 'OwnerReviews',
  data() {
    return {
      reviews: [],
      searchQuery: '',
      ratingFilter: '',
      campingSpotFilter: ''
    }
  },
  computed: {
    uniqueCampingSpots() {
      const spots = [];
      const seen = new Set();
      for (const review of this.reviews) {
        const spot = review.campingSpot;
        if (spot && !seen.has(spot.id)) {
          spots.push({ id: spot.id, name: spot.name });
          seen.add(spot.id);
        }
      }
      return spots;
    },
    filteredReviews() {
      return this.reviews.filter(review => {
        const matchesSearch =
          (review.user?.name?.toLowerCase() || '').includes(this.searchQuery.toLowerCase()) ||
          (review.campingSpot?.name?.toLowerCase() || '').includes(this.searchQuery.toLowerCase()) ||
          (review.comment?.toLowerCase() || '').includes(this.searchQuery.toLowerCase());

        const matchesRating = !this.ratingFilter ||
          review.rating === parseInt(this.ratingFilter);

        const matchesCampingSpot = !this.campingSpotFilter ||
          (review.campingSpot && String(review.campingSpot.id) === String(this.campingSpotFilter));

        return matchesSearch && matchesRating && matchesCampingSpot;
      });
    },
  },
  async created() {
    try {
      // Fetch reviews from API
      const response = await ownerAPI.getReviews();
      this.reviews = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched reviews:', this.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      this.$store?.commit?.('setNotification', {
        type: 'error',
        message: 'Failed to load reviews'
      });
      this.reviews = [];
    }
  },
  methods: {
    handleSearch() {
      // Search is handled by computed property
    },
    handleFilter() {
      // Filtering is handled by computed property
    },
    async updateStatus(review, newStatus) {
      try {
        // TODO: Update review status in API
        review.status = newStatus
      } catch (error) {
        console.error('Error updating review status:', error)
      }
    },
    async deleteReview(review) {
      if (confirm(`Are you sure you want to delete this review?`)) {
        try {
          // TODO: Delete review from API
          this.reviews = this.reviews.filter(r => r.id !== review.id)
        } catch (error) {
          console.error('Error deleting review:', error)
        }
      }
    },
    getStatusClass(status) {
      return (status && typeof status === 'string') ? status.toLowerCase() : '';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },
  }
}
</script>

<style scoped>
.owner-reviews {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.review-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.user-info h3 {
  margin: 0;
  color: #2c3e50;
}

.camping-spot {
  color: #666;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.location {
  color: #666;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.review-meta {
  text-align: right;
}

.rating {
  color: #f59e0b;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.date {
  color: #666;
  font-size: 0.875rem;
}

.review-content {
  margin: 1rem 0;
  color: #374151;
}

.owner-response {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
}

.owner-response strong {
  color: #2c3e50;
}

.owner-response p {
  margin: 0.5rem 0 0 0;
  color: #666;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-badge.published {
  background: #e3fcef;
  color: #42b983;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-approve,
.btn-reject,
.btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-approve {
  background: #e3fcef;
  color: #42b983;
}

.btn-reject {
  background: #fee2e2;
  color: #ef4444;
}

.btn-delete {
  background: #f3f4f6;
  color: #374151;
}
</style> 