<template>
  <div class="min-h-screen bg-neutral-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="updateProfile" class="max-w-2xl">
          <!-- Profile Picture -->
          <div class="mb-6">
            <div class="flex items-center">
              <div v-if="user?.avatar" class="h-20 w-20 rounded-full overflow-hidden">
                <img :src="user.avatar" alt="Profile picture" class="h-full w-full object-cover">
              </div>
              <div v-else class="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-semibold">
                {{ user?.name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <button type="button" class="ml-4 text-sm text-primary-600 hover:text-primary-500">
                Change picture
              </button>
            </div>
          </div>
          
          <!-- Name -->
          <div class="mb-6">
            <label for="name" class="form-label">Name</label>
            <input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              class="form-input"
              :class="{ 'border-red-300': errors.name }"
            >
            <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
          </div>
          
          <!-- Email -->
          <div class="mb-6">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              :value="user?.email" 
              type="email" 
              class="form-input bg-neutral-50" 
              disabled
            >
            <p class="text-sm text-neutral-500 mt-1">Email cannot be changed</p>
          </div>
          
          <!-- Phone -->
          <div class="mb-6">
            <label for="phone" class="form-label">Phone number</label>
            <input 
              id="phone" 
              v-model="formData.phoneNumber" 
              type="tel" 
              class="form-input"
              :class="{ 'border-red-300': errors.phoneNumber }"
            >
            <p v-if="errors.phoneNumber" class="form-error">{{ errors.phoneNumber }}</p>
          </div>
          
          <!-- Bio -->
          <div class="mb-6">
            <label for="bio" class="form-label">Bio</label>
            <textarea 
              id="bio" 
              v-model="formData.bio" 
              rows="4" 
              class="form-input"
              :class="{ 'border-red-300': errors.bio }"
            ></textarea>
            <p v-if="errors.bio" class="form-error">{{ errors.bio }}</p>
          </div>
          
          <!-- Submit Button -->
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>
        
        <!-- Change Password Section -->
        <div class="mt-12 pt-8 border-t">
          <h2 class="text-xl font-semibold mb-6">Change Password</h2>
          
          <form @submit.prevent="changePassword" class="max-w-2xl">
            <div class="mb-6">
              <label for="currentPassword" class="form-label">Current Password</label>
              <input 
                id="currentPassword" 
                v-model="passwordData.currentPassword" 
                type="password" 
                class="form-input"
                :class="{ 'border-red-300': passwordErrors.currentPassword }"
              >
              <p v-if="passwordErrors.currentPassword" class="form-error">{{ passwordErrors.currentPassword }}</p>
            </div>
            
            <div class="mb-6">
              <label for="newPassword" class="form-label">New Password</label>
              <input 
                id="newPassword" 
                v-model="passwordData.newPassword" 
                type="password" 
                class="form-input"
                :class="{ 'border-red-300': passwordErrors.newPassword }"
              >
              <p v-if="passwordErrors.newPassword" class="form-error">{{ passwordErrors.newPassword }}</p>
            </div>
            
            <div class="mb-6">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input 
                id="confirmPassword" 
                v-model="passwordData.confirmPassword" 
                type="password" 
                class="form-input"
                :class="{ 'border-red-300': passwordErrors.confirmPassword }"
              >
              <p v-if="passwordErrors.confirmPassword" class="form-error">{{ passwordErrors.confirmPassword }}</p>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isChangingPassword"
              >
                <span v-if="isChangingPassword">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Changing Password...
                </span>
                <span v-else>Change Password</span>
              </button>
            </div>
          </form>
        </div>
        
        <!-- Delete Account Section -->
        <div class="mt-12 pt-8 border-t">
          <h2 class="text-xl font-semibold mb-4 text-error">Delete Account</h2>
          <p class="text-neutral-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            @click="confirmDeleteAccount" 
            class="btn bg-error text-white hover:bg-error/90"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  data() {
    return {
      formData: {
        name: '',
        phoneNumber: '',
        bio: ''
      },
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {},
      passwordErrors: {},
      isLoading: false,
      isChangingPassword: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    initializeForm() {
      this.formData = {
        name: this.user?.name || '',
        phoneNumber: this.user?.phoneNumber || '',
        bio: this.user?.bio || ''
      }
    },
    
    validateForm() {
      this.errors = {}
      let isValid = true
      
      if (!this.formData.name) {
        this.errors.name = 'Name is required'
        isValid = false
      }
      
      return isValid
    },
    
    validatePasswordForm() {
      this.passwordErrors = {}
      let isValid = true
      
      if (!this.passwordData.currentPassword) {
        this.passwordErrors.currentPassword = 'Current password is required'
        isValid = false
      }
      
      if (!this.passwordData.newPassword) {
        this.passwordErrors.newPassword = 'New password is required'
        isValid = false
      } else if (this.passwordData.newPassword.length < 8) {
        this.passwordErrors.newPassword = 'Password must be at least 8 characters'
        isValid = false
      }
      
      if (!this.passwordData.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Please confirm your new password'
        isValid = false
      } else if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.passwordErrors.confirmPassword = 'Passwords do not match'
        isValid = false
      }
      
      return isValid
    },
    
    async updateProfile() {
      if (!this.validateForm()) return
      
      try {
        this.isLoading = true
        await this.$store.dispatch('updateProfile', this.formData)
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Profile updated successfully'
        })
      } catch (error) {
        if (error.response?.data?.message) {
          this.$store.commit('setNotification', {
            type: 'error',
            message: error.response.data.message
          })
        }
      } finally {
        this.isLoading = false
      }
    },
    
    async changePassword() {
      if (!this.validatePasswordForm()) return
      
      try {
        this.isChangingPassword = true
        await this.$store.dispatch('changePassword', {
          currentPassword: this.passwordData.currentPassword,
          newPassword: this.passwordData.newPassword
        })
        
        // Clear password form
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        
        this.$store.commit('setNotification', {
          type: 'success',
          message: 'Password changed successfully'
        })
      } catch (error) {
        if (error.response?.data?.message) {
          this.passwordErrors.currentPassword = error.response.data.message
        }
      } finally {
        this.isChangingPassword = false
      }
    },
    
    async confirmDeleteAccount() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
          await this.$axios.delete('/users/account')
          this.$store.dispatch('logout')
          this.$router.push('/')
          this.$store.commit('setNotification', {
            type: 'success',
            message: 'Your account has been deleted'
          })
        } catch (error) {
          this.$store.commit('setNotification', {
            type: 'error',
            message: error.response?.data?.message || 'Error deleting account'
          })
        }
      }
    }
  },
  created() {
    this.initializeForm()
  },
  watch: {
    user() {
      this.initializeForm()
    }
  }
}
</script>