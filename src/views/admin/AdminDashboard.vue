<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-number">{{ stats.totalUsers }}</p>
        <p class="stat-change" :class="{ positive: stats.userGrowth > 0 }">
          {{ stats.userGrowth > 0 ? '+' : '' }}{{ stats.userGrowth }}% this month
        </p>
      </div>
      
      <div class="stat-card">
        <h3>Total Camping Spots</h3>
        <p class="stat-number">{{ stats.totalSpots }}</p>
        <p class="stat-change" :class="{ positive: stats.spotGrowth > 0 }">
          {{ stats.spotGrowth > 0 ? '+' : '' }}{{ stats.spotGrowth }}% this month
        </p>
      </div>
      
      <div class="stat-card">
        <h3>Total Bookings</h3>
        <p class="stat-number">{{ stats.totalBookings }}</p>
        <p class="stat-change" :class="{ positive: stats.bookingGrowth > 0 }">
          {{ stats.bookingGrowth > 0 ? '+' : '' }}{{ stats.bookingGrowth }}% this month
        </p>
      </div>
      
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="stat-number">€{{ stats.totalRevenue }}</p>
        <p class="stat-change" :class="{ positive: stats.revenueGrowth > 0 }">
          {{ stats.revenueGrowth > 0 ? '+' : '' }}{{ stats.revenueGrowth }}% this month
        </p>
      </div>
    </div>

    <div class="dashboard-sections">
      <div class="section">
        <h2>Recent Users</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in recentUsers" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.joinedDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="section">
        <h2>Recent Bookings</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Camping Spot</th>
                <th>Dates</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in recentBookings" :key="booking.id">
                <td>{{ booking.userName }}</td>
                <td>{{ booking.spotName }}</td>
                <td>{{ booking.dates }}</td>
                <td>{{ booking.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        totalUsers: 0,
        userGrowth: 0,
        totalSpots: 0,
        spotGrowth: 0,
        totalBookings: 0,
        bookingGrowth: 0,
        totalRevenue: 0,
        revenueGrowth: 0
      },
      recentUsers: [],
      recentBookings: []
    }
  },
  async created() {
    // TODO: Fetch dashboard data from API
    this.stats = {
      totalUsers: 150,
      userGrowth: 5,
      totalSpots: 45,
      spotGrowth: 10,
      totalBookings: 320,
      bookingGrowth: 15,
      totalRevenue: 25000,
      revenueGrowth: 20
    }

    this.recentUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        joinedDate: '2024-03-01'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Owner',
        joinedDate: '2024-03-05'
      }
    ]

    this.recentBookings = [
      {
        id: 1,
        userName: 'John Doe',
        spotName: 'Mountain View Camp',
        dates: '2024-03-15 - 2024-03-20',
        status: 'Confirmed'
      },
      {
        id: 2,
        userName: 'Jane Smith',
        spotName: 'Lakeside Retreat',
        dates: '2024-03-18 - 2024-03-25',
        status: 'Pending'
      }
    ]
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.stats-grid {
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

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.stat-change {
  color: #ef4444;
  font-size: 0.875rem;
}

.stat-change.positive {
  color: #42b983;
}

.dashboard-sections {
  display: grid;
  gap: 2rem;
}

.section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #2c3e50;
}

td {
  color: #666;
}
</style> 