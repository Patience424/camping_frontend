<template>
  <div class="owner-dashboard">
    <h1>Owner Dashboard</h1>
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
        <p class="stat-number">€{{ totalRevenue }}</p>
      </div>
    </div>
    <div class="recent-bookings">
      <h2>Recent Bookings</h2>
      <div v-if="recentBookings.length" class="bookings-list">
        <div v-for="booking in recentBookings" :key="booking.id" class="booking-card">
          <h4>{{ booking.campingSpotName }}</h4>
          <p>Guest: {{ booking.guestName }}</p>
          <p>Dates: {{ booking.checkIn }} - {{ booking.checkOut }}</p>
          <p>Status: {{ booking.status }}</p>
        </div>
      </div>
      <p v-else>No recent bookings</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OwnerDashboard',
  data() {
    return {
      totalSpots: 0,
      activeBookings: 0,
      totalRevenue: 0,
      recentBookings: []
    }
  },
  async created() {
    // TODO: Fetch dashboard data from API
    this.totalSpots = 5
    this.activeBookings = 3
    this.totalRevenue = 1500
    this.recentBookings = [
      {
        id: 1,
        campingSpotName: 'Mountain View Camp',
        guestName: 'John Doe',
        checkIn: '2024-03-15',
        checkOut: '2024-03-20',
        status: 'Confirmed'
      }
    ]
  }
}
</script>

<style scoped>
.owner-dashboard {
  padding: 2rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.recent-bookings {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bookings-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.booking-card {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.booking-card h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.booking-card p {
  margin: 0.25rem 0;
  color: #666;
}
</style> 