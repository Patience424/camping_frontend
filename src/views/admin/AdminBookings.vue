<template>
  <div class="admin-bookings">
    <div class="header">
      <h1>Bookings Management</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search bookings..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="filters">
      <select v-model="statusFilter" @change="handleFilter">
        <option value="">All Status</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
        <option value="completed">Completed</option>
      </select>
      <div class="date-filters">
        <div class="date-input">
          <label>From</label>
          <input type="date" v-model="dateFrom" @change="handleFilter">
        </div>
        <div class="date-input">
          <label>To</label>
          <input type="date" v-model="dateTo" @change="handleFilter">
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User</th>
            <th>Camping Spot</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td>#{{ booking.id }}</td>
            <td>{{ booking.userName }}</td>
            <td>{{ booking.spotName }}</td>
            <td>{{ booking.checkIn }}</td>
            <td>{{ booking.checkOut }}</td>
            <td>€{{ booking.total }}</td>
            <td>
              <span class="status-badge" :class="booking.status.toLowerCase()">
                {{ booking.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="viewDetails(booking)" class="btn-view">
                View
              </button>
              <button 
                v-if="booking.status === 'Pending'"
                @click="updateStatus(booking, 'Confirmed')" 
                class="btn-confirm"
              >
                Confirm
              </button>
              <button 
                v-if="['Pending', 'Confirmed'].includes(booking.status)"
                @click="updateStatus(booking, 'Cancelled')" 
                class="btn-cancel"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showDetailsModal" class="modal">
      <div class="modal-content">
        <h2>Booking Details</h2>
        <div class="booking-details" v-if="selectedBooking">
          <div class="detail-section">
            <h3>Booking Information</h3>
            <p><strong>Booking ID:</strong> #{{ selectedBooking.id }}</p>
            <p><strong>Status:</strong> {{ selectedBooking.status }}</p>
            <p><strong>Created:</strong> {{ selectedBooking.createdAt }}</p>
            <p><strong>Total Amount:</strong> €{{ selectedBooking.total }}</p>
          </div>

          <div class="detail-section">
            <h3>User Information</h3>
            <p><strong>Name:</strong> {{ selectedBooking.userName }}</p>
            <p><strong>Email:</strong> {{ selectedBooking.userEmail }}</p>
            <p><strong>Phone:</strong> {{ selectedBooking.userPhone }}</p>
          </div>

          <div class="detail-section">
            <h3>Camping Spot</h3>
            <p><strong>Name:</strong> {{ selectedBooking.spotName }}</p>
            <p><strong>Location:</strong> {{ selectedBooking.spotLocation }}</p>
            <p><strong>Owner:</strong> {{ selectedBooking.ownerName }}</p>
          </div>

          <div class="detail-section">
            <h3>Stay Details</h3>
            <p><strong>Check-in:</strong> {{ selectedBooking.checkIn }}</p>
            <p><strong>Check-out:</strong> {{ selectedBooking.checkOut }}</p>
            <p><strong>Guests:</strong> {{ selectedBooking.guests }}</p>
          </div>

          <div class="detail-section" v-if="selectedBooking.notes">
            <h3>Additional Notes</h3>
            <p>{{ selectedBooking.notes }}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showDetailsModal = false" class="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminBookings',
  data() {
    return {
      bookings: [],
      searchQuery: '',
      statusFilter: '',
      dateFrom: '',
      dateTo: '',
      showDetailsModal: false,
      selectedBooking: null
    }
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(booking => {
        const matchesSearch = 
          booking.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          booking.spotName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          booking.id.toString().includes(this.searchQuery)
        
        const matchesStatus = !this.statusFilter || 
          booking.status.toLowerCase() === this.statusFilter

        const matchesDates = this.checkDateRange(booking)

        return matchesSearch && matchesStatus && matchesDates
      })
    }
  },
  async created() {
    // TODO: Fetch bookings from API
    this.bookings = [
      {
        id: 1,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userPhone: '123-456-7890',
        spotName: 'Mountain View Camp',
        spotLocation: 'Rocky Mountains, CO',
        ownerName: 'Jane Smith',
        checkIn: '2024-03-15',
        checkOut: '2024-03-20',
        total: 375,
        status: 'Confirmed',
        guests: 2,
        createdAt: '2024-03-01',
        notes: 'Requesting early check-in if possible.'
      },
      {
        id: 2,
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        userPhone: '098-765-4321',
        spotName: 'Lakeside Retreat',
        spotLocation: 'Lake Tahoe, CA',
        ownerName: 'John Doe',
        checkIn: '2024-03-18',
        checkOut: '2024-03-25',
        total: 665,
        status: 'Pending',
        guests: 4,
        createdAt: '2024-03-02',
        notes: ''
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
    checkDateRange(booking) {
      if (!this.dateFrom && !this.dateTo) return true
      
      const bookingDate = new Date(booking.checkIn)
      const from = this.dateFrom ? new Date(this.dateFrom) : null
      const to = this.dateTo ? new Date(this.dateTo) : null

      if (from && to) {
        return bookingDate >= from && bookingDate <= to
      } else if (from) {
        return bookingDate >= from
      } else if (to) {
        return bookingDate <= to
      }
      
      return true
    },
    viewDetails(booking) {
      this.selectedBooking = booking
      this.showDetailsModal = true
    },
    async updateStatus(booking, newStatus) {
      try {
        // TODO: Update booking status in API
        booking.status = newStatus
      } catch (error) {
        console.error('Error updating booking status:', error)
      }
    }
  }
}
</script>

<style scoped>
.admin-bookings {
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
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.date-filters {
  display: flex;
  gap: 1rem;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-input label {
  font-size: 0.875rem;
  color: #666;
}

.date-input input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-badge.confirmed {
  background: #e3fcef;
  color: #42b983;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #ef4444;
}

.status-badge.completed {
  background: #e0f2fe;
  color: #0ea5e9;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-confirm,
.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-view {
  background: #e0f2fe;
  color: #0ea5e9;
}

.btn-confirm {
  background: #e3fcef;
  color: #42b983;
}

.btn-cancel {
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.booking-details {
  margin: 1.5rem 0;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.detail-section p {
  margin: 0.5rem 0;
  color: #666;
}

.detail-section strong {
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}
</style> 