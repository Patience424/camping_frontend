<template>
  <div class="admin-camping-spots">
    <div class="header">
      <h1>Camping Spots Management</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search camping spots..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="filters">
      <select v-model="ownerFilter" @change="handleFilter">
        <option value="">All Owners</option>
        <option v-for="owner in owners" :key="owner.id" :value="owner.id">
          {{ owner.name }}
        </option>
      </select>
      <select v-model="statusFilter" @change="handleFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending Review</option>
      </select>
    </div>

    <div class="spots-grid">
      <div v-for="spot in filteredSpots" :key="spot.id" class="spot-card">
        <img :src="spot.imageUrl" :alt="spot.name" class="spot-image">
        <div class="spot-info">
          <div class="spot-header">
            <h3>{{ spot.name }}</h3>
            <span class="status-badge" :class="spot.status.toLowerCase()">
              {{ spot.status }}
            </span>
          </div>
          <p class="owner">Owner: {{ spot.ownerName }}</p>
          <p class="location">{{ spot.location }}</p>
          <p class="price">€{{ spot.pricePerNight }} per night</p>
          <div class="stats">
            <div class="stat">
              <span class="label">Bookings</span>
              <span class="value">{{ spot.totalBookings }}</span>
            </div>
            <div class="stat">
              <span class="label">Revenue</span>
              <span class="value">€{{ spot.totalRevenue }}</span>
            </div>
            <div class="stat">
              <span class="label">Rating</span>
              <span class="value">{{ spot.rating }}/5</span>
            </div>
          </div>
          <div class="actions">
            <button @click="reviewSpot(spot)" class="btn-review" v-if="spot.status === 'Pending'">
              Review
            </button>
            <button @click="toggleSpotStatus(spot)" class="btn-status">
              {{ spot.status === 'Active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button @click="deleteSpot(spot)" class="btn-delete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal">
      <div class="modal-content">
        <h2>Review Camping Spot</h2>
        <div class="spot-preview">
          <h3>{{ reviewingSpot.name }}</h3>
          <p>{{ reviewingSpot.location }}</p>
          <p>€{{ reviewingSpot.pricePerNight }} per night</p>
        </div>
        <div class="form-group">
          <label for="reviewNotes">Review Notes</label>
          <textarea
            id="reviewNotes"
            v-model="reviewNotes"
            rows="4"
            placeholder="Enter your review notes..."
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="rejectSpot" class="btn-reject">
            Reject
          </button>
          <button @click="approveSpot" class="btn-approve">
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCampingSpots',
  data() {
    return {
      spots: [],
      owners: [],
      searchQuery: '',
      ownerFilter: '',
      statusFilter: '',
      showReviewModal: false,
      reviewingSpot: null,
      reviewNotes: ''
    }
  },
  computed: {
    filteredSpots() {
      return this.spots.filter(spot => {
        const matchesSearch = spot.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            spot.location.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesOwner = !this.ownerFilter || spot.ownerId === this.ownerFilter
        const matchesStatus = !this.statusFilter || spot.status.toLowerCase() === this.statusFilter
        return matchesSearch && matchesOwner && matchesStatus
      })
    }
  },
  async created() {
    // TODO: Fetch camping spots and owners from API
    this.owners = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]
    
    this.spots = [
      {
        id: 1,
        name: 'Mountain View Camp',
        location: 'Rocky Mountains, CO',
        pricePerNight: 75,
        status: 'Active',
        imageUrl: 'https://example.com/camp1.jpg',
        ownerId: 1,
        ownerName: 'John Doe',
        totalBookings: 25,
        totalRevenue: 1875,
        rating: 4.5
      },
      {
        id: 2,
        name: 'Lakeside Retreat',
        location: 'Lake Tahoe, CA',
        pricePerNight: 95,
        status: 'Pending',
        imageUrl: 'https://example.com/camp2.jpg',
        ownerId: 2,
        ownerName: 'Jane Smith',
        totalBookings: 0,
        totalRevenue: 0,
        rating: 0
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
    reviewSpot(spot) {
      this.reviewingSpot = spot
      this.reviewNotes = ''
      this.showReviewModal = true
    },
    async approveSpot() {
      try {
        // TODO: Update spot status in API
        this.reviewingSpot.status = 'Active'
        this.showReviewModal = false
      } catch (error) {
        console.error('Error approving spot:', error)
      }
    },
    async rejectSpot() {
      try {
        // TODO: Update spot status in API
        this.reviewingSpot.status = 'Rejected'
        this.showReviewModal = false
      } catch (error) {
        console.error('Error rejecting spot:', error)
      }
    },
    async toggleSpotStatus(spot) {
      try {
        // TODO: Update spot status in API
        spot.status = spot.status === 'Active' ? 'Inactive' : 'Active'
      } catch (error) {
        console.error('Error updating spot status:', error)
      }
    },
    async deleteSpot(spot) {
      if (confirm(`Are you sure you want to delete ${spot.name}?`)) {
        try {
          // TODO: Delete spot from API
          this.spots = this.spots.filter(s => s.id !== spot.id)
        } catch (error) {
          console.error('Error deleting spot:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-camping-spots {
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
  min-width: 200px;
}

.spots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.spot-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.spot-info {
  padding: 1.5rem;
}

.spot-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.spot-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-badge.active {
  background: #e3fcef;
  color: #42b983;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #ef4444;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.owner, .location {
  color: #666;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  color: #42b983;
  margin-bottom: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.stat .value {
  font-weight: bold;
  color: #2c3e50;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-review,
.btn-status,
.btn-delete {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-review {
  background: #fef3c7;
  color: #d97706;
}

.btn-status {
  background: #e3fcef;
  color: #42b983;
}

.btn-delete {
  background: #fee2e2;
  color: #ef4444;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.spot-preview {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.spot-preview h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.spot-preview p {
  margin: 0.25rem 0;
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-approve,
.btn-reject {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-approve {
  background: #42b983;
  color: white;
}

.btn-reject {
  background: #ef4444;
  color: white;
}
</style> 