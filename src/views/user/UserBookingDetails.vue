<!-- UserBookingDetails.vue 
This is a Vue.js component for the user booking details page of a camping booking application.
It allows users to book a camping spot by providing details such as spot ID, dates, guest count, and special requests.
It handles form submission and displays success or error messages based on the booking outcome.
-->
<template>
    <form @submit.prevent="submitBooking">
      <input v-model="campingSpotId" placeholder="Spot ID" required />
      <input v-model="startDate" type="date" required />
      <input v-model="endDate" type="date" required />
      <input v-model.number="guestCount" type="number" required />
      <textarea v-model="specialRequests" placeholder="Special requests" />
      <button type="submit">Book</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { bookingAPI } from '@/services/api';
  
  const campingSpotId = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const guestCount = ref(1);
  const specialRequests = ref('');
  
  async function submitBooking() {
    try {
      await bookingAPI.create({
        campingSpotId: campingSpotId.value,
        startDate: startDate.value,
        endDate: endDate.value,
        guestCount: guestCount.value,
        specialRequests: specialRequests.value
      });
      alert('Booking successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  }
  </script>
  