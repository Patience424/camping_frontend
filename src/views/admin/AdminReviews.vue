<template>
  <div class="admin-reviews">
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
      <select v-model="statusFilter" @change="handleFilter">
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <div class="reviews-grid">
      <div v-for="review in filteredReviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="user-info">
            <h3>{{ review.userName }}</h3>
            <p class="camping-spot">{{ review.spotName }}</p>
          </div>
          <div class="review-meta">
            <div class="rating">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= review.rating ? '★' : '☆' }}
              </span>
            </div>
            <span class="date">{{ review.date }}</span>
          </div>
        </div>

        <div class="review-content">
          <p>{{ review.content }}</p>
          <div v-if="review.response" class="owner-response">
            <strong>Owner Response:</strong>
            <p>{{ review.response }}</p>
          </div>
        </div>

        <div class="review-footer">
          <span class="status-badge" :class="review.status.toLowerCase()">
            {{ review.status }}
          </span>
          <div class="actions">
            <button 
              v-if="review.status === 'Pending'"
              @click="updateStatus(review, 'Published')" 
              class="btn-approve"
            >
              Approve
            </button>
            <button 
              v-if="review.status === 'Pending'"
              @click="updateStatus(review, 'Rejected')" 
              class="btn-reject"
            >
              Reject
            </button>
            <button @click="deleteReview(review)" class="btn-delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReviews',
  data() {
    return {
      reviews: [],
      searchQuery: '',
      ratingFilter: '',
      statusFilter: ''
    }
  },
  computed: {
    filteredReviews() {
      return this.reviews.filter(review => {
        const matchesSearch = 
          review.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          review.spotName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesRating = !this.ratingFilter || 
          review.rating === parseInt(this.ratingFilter)
        
        const matchesStatus = !this.statusFilter || 
          review.status.toLowerCase() === this.statusFilter

        return matchesSearch && matchesRating && matchesStatus
      })
    }
  },
  async created() {
    // TODO: Fetch reviews from API
    this.reviews = [
      {
        id: 1,
        userName: 'John Doe',
        spotName: 'Mountain View Camp',
        rating: 5,
        content: 'Amazing experience! The views were breathtaking and the facilities were clean and well-maintained.',
        date: '2024-03-01',
        status: 'Published',
        response: 'Thank you for your wonderful review! We\'re glad you enjoyed your stay.'
      },
      {
        id: 2,
        userName: 'Jane Smith',
        spotName: 'Lakeside Retreat',
        rating: 4,
        content: 'Great location and friendly staff. Could use more amenities.',
        date: '2024-03-05',
        status: 'Pending',
        response: null
      },
      {
        id: 3,
        userName: 'Mike Johnson',
        spotName: 'Forest Haven',
        rating: 2,
        content: 'Disappointing experience. The site was not as described and quite dirty.',
        date: '2024-03-10',
        status: 'Pending',
        response: null
      }
    ]
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
    }
  }
}
</script>

<style scoped>
.admin-reviews {
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