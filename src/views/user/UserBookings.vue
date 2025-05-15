<template>
    <div>
      <h2>Your Bookings</h2>
      <ul v-if="bookings.length">
        <li v-for="booking in bookings" :key="booking.id">
          {{ booking.campingSpot.name }}: {{ booking.startDate }} to {{ booking.endDate }}
        </li>
      </ul>
      <p v-else>No bookings yet.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { fetchUserBookings } from '@/services/api';
  
  const bookings = ref([]);
  
  onMounted(async () => {
    try {
      const res = await fetchUserBookings();
      bookings.value = res.data;
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  });
  </script>
  