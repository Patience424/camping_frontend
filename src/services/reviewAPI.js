import axios from './axiosInstance'

const reviewAPI = {
  // Get all reviews for the current user
  getAll() {
    return axios.get('/reviews/my-reviews')
  },

  // Get a specific review by ID
  getById(id) {
    return axios.get(`/reviews/${id}`)
  },

  // Create a new review
  create(data) {
    return axios.post('/reviews', data)
  },

  // Update an existing review
  update(id, data) {
    return axios.put(`/reviews/${id}`, data)
  },

  // Delete a review
  delete(id) {
    return axios.delete(`/reviews/${id}`)
  }
}

export default reviewAPI 