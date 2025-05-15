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
  import { createBooking } from '@/services/api';
  
  const campingSpotId = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const guestCount = ref(1);
  const specialRequests = ref('');
  
  async function submitBooking() {
    try {
      await createBooking({
        campingSpotId: campingSpotId.value,
        startDate: startDate.value,
        endDate: endDate.value,
        guestCount: guestCount.value,
        specialRequests
      });
      alert('Booking successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  }
  </script>
  