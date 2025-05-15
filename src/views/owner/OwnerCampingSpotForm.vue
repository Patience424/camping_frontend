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
              <img :src="image.url" :alt="'Camping spot image ' + (index + 1)">
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
        <button type="submit" class="btn-primary">
          {{ isEdit ? 'Update' : 'Create' }} Camping Spot
        </button>
      </div>
    </form>
  </div>
</template>

<script>
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
      ]
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    }
  },
  async created() {
    if (this.isEdit) {
      // TODO: Fetch camping spot data from API
      this.form = {
        name: 'Mountain View Camp',
        location: 'Rocky Mountains, CO',
        description: 'Beautiful mountain view camping spot with amazing scenery.',
        pricePerNight: 75,
        capacity: 4,
        images: [
          { url: 'https://example.com/camp1.jpg' },
          { url: 'https://example.com/camp2.jpg' }
        ],
        amenities: ['Electricity', 'Water', 'Fire Pit']
      }
    }
  },
  methods: {
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
          // TODO: Implement actual image upload to server
          // For now, we'll create a local URL
          const imageUrl = URL.createObjectURL(file)
          this.form.images.push({ url: imageUrl, file })
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Error uploading image')
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
        // TODO: Implement actual image upload to server before saving the form
        const formData = {
          ...this.form,
          images: this.form.images.map(img => img.url)
        }

        if (this.isEdit) {
          // TODO: Update camping spot
          console.log('Updating camping spot:', formData)
        } else {
          // TODO: Create new camping spot
          console.log('Creating new camping spot:', formData)
        }
        this.$router.push('/owner/camping-spots')
      } catch (error) {
        console.error('Error saving camping spot:', error)
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