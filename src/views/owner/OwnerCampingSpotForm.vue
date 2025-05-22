<template>
  <div class="camping-spot-form">
    <h1>{{ isEdit ? 'Edit Camping Spot' : 'Add New Camping Spot' }}</h1>
    
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter camping spot name"
        >
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          required
          placeholder="Enter location"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          required
          placeholder="Describe your camping spot"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="pricePerNight">Price per Night (€)</label>
        <input
          id="pricePerNight"
          v-model.number="form.pricePerNight"
          type="number"
          required
          min="0"
          step="0.01"
        >
      </div>

      <div class="form-group">
        <label for="capacity">Capacity</label>
        <input
          id="capacity"
          v-model.number="form.capacity"
          type="number"
          required
          min="1"
        >
      </div>

      <div class="form-group">
        <label for="images">Images</label>
        <div class="image-upload-container">
          <div class="image-preview-grid">
            <div v-for="(image, index) in form.images" :key="index" class="image-preview">
              <img 
                :src="getImageUrl(image)" 
                :alt="'Camping spot image ' + (index + 1)"
                @error="e => e.target.src = 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'"
              >
              <button type="button" @click="removeImage(index)" class="remove-image">
                ×
              </button>
            </div>
            <div v-if="form.images.length < 5" class="image-upload-box" @click="triggerFileInput">
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                multiple
                class="hidden"
              >
              <div class="upload-placeholder">
                <span>+</span>
                <p>Add Image</p>
              </div>
            </div>
          </div>
          <p class="image-help-text">Upload up to 5 images (max 5MB each)</p>
        </div>
      </div>

      <div class="form-group">
        <label for="amenities">Amenities</label>
        <div class="amenities-grid">
          <label v-for="amenity in availableAmenities" :key="amenity" class="amenity-checkbox">
            <input
              type="checkbox"
              v-model="form.amenities"
              :value="amenity"
            >
            {{ amenity }}
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="$router.back()" class="btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isEdit ? 'Update' : 'Create' }} Camping Spot
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ownerAPI } from '@/services/api'

export default {
  name: 'OwnerCampingSpotForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        location: '',
        description: '',
        pricePerNight: 0,
        capacity: 1,
        images: [],
        amenities: []
      },
      availableAmenities: [
        'Electricity',
        'Water',
        'Showers',
        'Restrooms',
        'Fire Pit',
        'Picnic Table',
        'RV Hookup',
        'WiFi',
        'Pets Allowed'
      ],
      isSubmitting: false
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    }
  },
  async created() {
    if (this.isEdit) {
      try {
        const response = await ownerAPI.getCampingSpotById(this.id)
        console.log('Camping spot response (full):', JSON.stringify(response, null, 2))
        console.log('Camping spot images:', response?.images)
        
        if (response) {
          const spotData = response
          // Ensure images is an array and each image has the correct format
          const formattedImages = Array.isArray(spotData.images) 
            ? spotData.images.map(img => {
                console.log('Processing image:', img)
                if (typeof img === 'string') {
                  return { url: img, isNew: false }
                }
                if (typeof img === 'object') {
                  return { 
                    url: img.url || img.path || img, 
                    isNew: false 
                  }
                }
                return null
              }).filter(Boolean)
            : []
          
          console.log('Formatted images:', formattedImages)
          
          this.form = {
            name: spotData.name || '',
            location: spotData.location || '',
            description: spotData.description || '',
            pricePerNight: spotData.pricePerNight || 0,
            capacity: spotData.capacity || 1,
            images: formattedImages,
            amenities: Array.isArray(spotData.amenities) ? spotData.amenities : []
          }
          console.log('Form data after loading:', JSON.stringify(this.form, null, 2))
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Error fetching camping spot:', error)
        this.$store.commit('setNotification', {
          type: 'error',
          message: 'Failed to load camping spot details'
        })
      }
    }
  },
  methods: {
    getImageUrl(image) {
      if (!image) return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
      
      // If image is an object with url property
      if (typeof image === 'object' && image.url) {
        return this.getImageUrl(image.url)
      }
      
      // If image is a string
      if (typeof image === 'string') {
        // If it's a full URL, return it
        if (image.startsWith('http')) {
          return image
        }
        // If it's a relative path, prepend the API base URL
        return `http://localhost:3000${image.startsWith('/') ? image : '/' + image}`
      }
      
      return 'https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    async handleImageUpload(event) {
      const files = event.target.files
      if (!files.length) return

      for (const file of files) {
        if (this.form.images.length >= 5) {
          alert('Maximum 5 images allowed')
          break
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image size should be less than 5MB')
          continue
        }

        try {
          // Create a preview URL for the image
          const imageUrl = URL.createObjectURL(file)
          // Add both the preview URL and the file object
          this.form.images.push({ 
            url: imageUrl,
            file,
            isNew: true  // Mark as new image for upload
          })
          console.log('Added new image:', { url: imageUrl, file })
        } catch (error) {
          console.error('Error creating image preview:', error)
          alert('Error creating image preview')
        }
      }

      // Reset the file input
      event.target.value = ''
    },
    removeImage(index) {
      this.form.images.splice(index, 1)
    },
    async handleSubmit() {
      try {
        this.isSubmitting = true
        console.log('Starting form submission with images:', JSON.stringify(this.form.images, null, 2))
        
        // Create FormData for the request
        const formData = new FormData()
        
        // Add basic camping spot data
        formData.append('name', this.form.name)
        formData.append('location', this.form.location)
        formData.append('description', this.form.description)
        formData.append('pricePerNight', this.form.pricePerNight)
        formData.append('capacity', this.form.capacity)
        formData.append('amenities', JSON.stringify(this.form.amenities))
        
        // Handle images
        const newImages = this.form.images.filter(img => img.isNew)
        const existingImages = this.form.images.filter(img => !img.isNew)
        
        console.log('New images to upload:', JSON.stringify(newImages, null, 2))
        console.log('Existing images:', JSON.stringify(existingImages, null, 2))
        
        // Add new image files
        newImages.forEach(img => {
          if (img.file) {
            formData.append('images', img.file)
          }
        })
        
        // Add existing image URLs
        if (existingImages.length > 0) {
          formData.append('existingImages', JSON.stringify(existingImages.map(img => img.url)))
        }

        // Log all FormData entries
        console.log('FormData entries:')
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value)
        }

        if (this.isEdit) {
          const response = await ownerAPI.updateCampingSpot(this.id, formData)
          console.log('Update response:', response)
          this.$store.commit('setNotification', {
            type: 'success',
            message: 'Camping spot updated successfully'
          })
        } else {
          const response = await ownerAPI.createCampingSpot(formData)
          console.log('Create response:', response)
          this.$store.commit('setNotification', {
            type: 'success',
            message: 'Camping spot created successfully'
          })
        }
        
        this.$router.push('/owner/camping-spots')
      } catch (error) {
        console.error('Error saving camping spot:', error)
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        })
        this.$store.commit('setNotification', {
          type: 'error',
          message: error.response?.data?.message || error.message || 'Failed to save camping spot'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.camping-spot-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input[type="text"],
input[type="number"],
input[type="url"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
}

.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: #42b983;
  color: white;
  border: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.image-upload-container {
  margin-top: 0.5rem;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
}

.image-upload-box {
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s;
}

.image-upload-box:hover {
  border-color: #42b983;
}

.upload-placeholder {
  text-align: center;
  color: #666;
}

.upload-placeholder span {
  font-size: 2rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  color: #42b983;
}

.upload-placeholder p {
  margin: 0;
  font-size: 0.875rem;
}

.hidden {
  display: none;
}

.image-help-text {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}
</style> 