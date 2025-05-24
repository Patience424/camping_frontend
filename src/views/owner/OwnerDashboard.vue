<template>
  <div class="owner-dashboard">
    <div class="dashboard-header">
      <div class="owner-profile">
        <div class="profile-avatar">
          <div v-if="user?.avatar" class="avatar-image">
            <img :src="user.avatar" alt="Profile picture">
          </div>
          <div v-else class="avatar-placeholder">
            {{ user?.name?.[0]?.toUpperCase() || 'O' }}
          </div>
        </div>
        <div class="profile-info">
          <h1>Welcome, {{ user?.name || 'Owner' }}</h1>
          <p>{{ user?.email }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading dashboard data...</p>
    </div>
    
    <template v-else>
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Total Camping Spots</h3>
          <p class="stat-number">{{ totalSpots }}</p>
        </div>
        <div class="stat-card">
          <h3>Active Bookings</h3>
          <p class="stat-number">{{ activeBookings }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <p class="stat-number">€{{ totalRevenue.toFixed(2) }}</p>
        </div>
      </div>
      
      <div class="recent-bookings">
        <h2>Recent Bookings</h2>
        <div v-if="recentBookings.length" class="bookings-list">
          <div v-for="booking in recentBookings" :key="booking.id" class="booking-card">
            <div class="booking-header">
              <h4>{{ booking.campingSpotName }}</h4>
              <span class="status-badge" :class="booking.status.toLowerCase()">
                {{ formatStatus(booking.status) }}
              </span>
            </div>
            <div class="booking-details">
              <p><strong>Guest:</strong> {{ booking.guestName }}</p>
              <p><strong>Dates:</strong> {{ booking.checkIn }} - {{ booking.checkOut }}</p>
              <p><strong>Total:</strong> €{{ booking.total.toFixed(2) }}</p>
              <div class="booking-actions" v-if="booking.status === 'PENDING'">
                <button @click="updateBookingStatus(booking.id, 'CONFIRMED')" class="btn-confirm">
                  Confirm Booking
                </button>
                <button @click="updateBookingStatus(booking.id, 'CANCELLED')" class="btn-cancel">
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else>No recent bookings</p>
      </div>
    </template>
  </div>
</template>

<script>
import { ownerAPI } from '@/services/api'
import { mapState } from 'vuex'

export default {
  name: 'OwnerDashboard',
  data() {
    return {
      totalSpots: 0,
      activeBookings: 0,
      totalRevenue: 0,
      recentBookings: [],
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  async created() {
    await this.fetchDashboardData()
  },
  methods: {
    formatStatus(status) {
      if (!status) return 'Unknown'
      // Convert status to title case and handle special cases
      const statusMap = {
        'PENDING': 'Pending',
        'CONFIRMED': 'Confirmed',
        'CANCELLED': 'Cancelled',
        'COMPLETED': 'Completed'
      }
      return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    },
    async updateBookingStatus(bookingId, newStatus) {
      try {
        await ownerAPI.updateBookingStatus(bookingId, newStatus)
        // Refresh the dashboard data
        await this.fetchDashboardData()
        this.$store.commit('setNotification', {
          type: 'success',
          message: `Booking ${newStatus.toLowerCase()} successfully`
        })
      } catch (error) {
        console.error('Error updating booking status:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to update booking status'
        })
      }
    },
    async fetchDashboardData() {
      try {
        this.isLoading = true
        console.log('Fetching dashboard data...')
        
        const [statsResponse, bookingsResponse] = await Promise.all([
          ownerAPI.getDashboardStats().catch(error => {
            console.error('Error fetching dashboard stats:', error)
            return { stats: { totalSpots: 0, activeBookings: 0, totalRevenue: 0 } }
          }),
          ownerAPI.getBookings().catch(error => {
            console.error('Error fetching bookings:', error)
            return { data: [] }
          })
        ])

        console.log('Raw stats response:', statsResponse)
        console.log('Raw bookings response:', bookingsResponse)

        // Extract stats from the nested response
        const stats = statsResponse?.stats || {}
        console.log('Extracted stats:', stats)

        // Update stats with defensive checks using the correct property names
        this.totalSpots = stats.campingSpotCount || 0
        this.activeBookings = stats.activeBookings || 0
        this.totalRevenue = stats.revenue?.completed || 0

        // Extract bookings from the nested response
        const bookings = bookingsResponse?.data || []
        console.log('Extracted bookings:', bookings)
        
        this.recentBookings = bookings.slice(0, 5).map(booking => {
          console.log('Processing booking:', booking)
          return {
            id: booking?.id || 'unknown',
            campingSpotName: booking?.campingSpot?.name || booking?.spotName || 'Unknown Spot',
            guestName: booking?.user?.name || booking?.userName || 'Unknown Guest',
            checkIn: booking?.startDate || booking?.checkIn ? new Date(booking.startDate || booking.checkIn).toLocaleDateString() : 'Unknown',
            checkOut: booking?.endDate || booking?.checkOut ? new Date(booking.endDate || booking.checkOut).toLocaleDateString() : 'Unknown',
            status: booking?.status || 'Unknown',
            total: booking?.totalPrice || booking?.total || 0  // Updated to use totalPrice
          }
        })

        console.log('Processed dashboard stats:', {
          totalSpots: this.totalSpots,
          activeBookings: this.activeBookings,
          totalRevenue: this.totalRevenue
        })
        console.log('Processed recent bookings:', this.recentBookings)
      } catch (error) {
        console.error('Error in fetchDashboardData:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load dashboard data'
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.owner-dashboard {
  padding: 2rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.owner-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #42b983;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.profile-info h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.profile-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.recent-bookings {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recent-bookings h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.bookings-list {
  display: grid;
  gap: 1rem;
}

.booking-card {
  padding: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-header h4 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.confirmed {
  background: #e3fcef;
  color: #42b983;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #ef4444;
}

.status-badge.completed {
  background: #e0f2fe;
  color: #0ea5e9;
}

.booking-details {
  color: #4b5563;
}

.booking-details p {
  margin: 0.5rem 0;
}

.booking-details strong {
  color: #1f2937;
  font-weight: 500;
}

.booking-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-confirm,
.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm {
  background: #42b983;
  color: white;
  border: none;
}

.btn-confirm:hover {
  background: #3aa876;
}

.btn-cancel {
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.btn-cancel:hover {
  background: #fee2e2;
}
</style> 