<!-- UserBookings.vue 
This is a Vue.js component for the user bookings page of a camping booking application.
It allows users to view their bookings, cancel them, and see details such as check-in/check-out dates, guest count, and special requests.  
It includes loading states, error handling, and responsive design for better user experience. 
-->
<template>
  <div class="bookings-page">
    <h2>Your Bookings</h2>
    
    <div v-if="loading" class="loading">
      Loading your bookings...
    </div>
    
    <template v-else>
      <div v-if="error" class="error">
        {{ error }}
      </div>
      
      <template v-else>
        <div v-if="bookings && bookings.length > 0" class="bookings-list">
          <div v-for="booking in bookings" :key="booking.id" class="booking-card">
            <div class="booking-header">
              <h3>{{ booking.campingSpot?.name || 'Unknown Spot' }}</h3>
              <span class="status" :class="booking.status?.toLowerCase() || 'confirmed'">
                {{ booking.status || 'Confirmed' }}
              </span>
            </div>
            
            <div class="booking-info">
              <div class="info-row">
                <span class="label">Check-in:</span>
                <span class="value">{{ formatDate(booking.startDate) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Check-out:</span>
                <span class="value">{{ formatDate(booking.endDate) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Guests:</span>
                <span class="value">{{ booking.guestCount || 1 }} person(s)</span>
              </div>
              <div class="info-row" v-if="booking.specialRequests">
                <span class="label">Special Requests:</span>
                <span class="value">{{ booking.specialRequests }}</span>
              </div>
              <div class="booking-actions" v-if="booking.status === 'PENDING' || booking.status === 'CONFIRMED'">
                <button 
                  @click="cancelBooking(booking.id)" 
                  class="btn-cancel"
                  :disabled="isCancelling === booking.id"
                >
                  {{ isCancelling === booking.id ? 'Cancelling...' : 'Cancel Booking' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-bookings">
          <p>No bookings yet.</p>
          <router-link to="/camping-spots" class="browse-link">
            Browse Camping Spots
          </router-link>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { userAPI, bookingAPI } from '@/services/api';

export default {
  name: 'UserBookings',
  data() {
    return {
      bookings: [],
      loading: true,
      error: null,
      isCancelling: null
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Not specified';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
      }
    },
    async cancelBooking(bookingId) {
      if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
      }

      try {
        this.isCancelling = bookingId;
        await bookingAPI.cancel(bookingId);
        
        // Refresh the bookings list to get updated data
        await this.fetchBookings();

        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Booking cancelled successfully'
        });
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        this.$store.commit('setNotification', {
          type: 'error',
          message: err.response?.data?.message || 'Failed to cancel booking'
        });
      } finally {
        this.isCancelling = null;
      }
    },
    async fetchBookings() {
      try {
        console.log('Fetching bookings...');
        const data = await userAPI.getBookings();
        console.log('Bookings data:', data);
        this.bookings = Array.isArray(data) ? data : [];
        console.log('Processed bookings:', this.bookings);
      } catch (err) {
        console.error('Failed to load bookings:', err);
        this.error = err.response?.data?.message || 'Failed to load bookings';
        this.bookings = [];
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchBookings();
  }
}
</script>

<style scoped>
.bookings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.booking-header {
  background: #f8fafc;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.confirmed {
  background: #e3fcef;
  color: #42b983;
}

.status.pending {
  background: #fef3c7;
  color: #d97706;
}

.status.cancelled {
  background: #fee2e2;
  color: #ef4444;
}

.booking-info {
  padding: 1.5rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  flex: 0 0 120px;
  color: #64748b;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #1e293b;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.error {
  text-align: center;
  padding: 1rem;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 8px;
  margin: 1rem 0;
}

.no-bookings {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-bookings p {
  color: #64748b;
  margin-bottom: 1rem;
}

.browse-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.browse-link:hover {
  background: #2563eb;
}

@media (max-width: 640px) {
  .info-row {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .label {
    flex: none;
  }
}

.booking-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover:not(:disabled) {
  background: #fee2e2;
}

.btn-cancel:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status.cancelled {
  background: #fee2e2;
  color: #ef4444;
}
</style>
  