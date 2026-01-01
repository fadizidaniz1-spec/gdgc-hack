// Stadium API Service
import { api } from './api';

export const stadiumService = {
  // Get all stadiums with filters
  getStadiums: (params = {}) => {
    return api.get('/stadiums', params);
  },

  // Get nearby stadiums
  getNearbyStadiums: async (latitude, longitude, radius = 10) => {
    const response = await api.get('/stadiums', { 
      latitude, 
      longitude, 
      radius, 
      sortBy: 'distance' 
    });
    return response;
  },

  // Get stadium details
  getStadiumById: async (id) => {
    const response = await api.get(`/stadiums/${id}`);
    return response;
  },

  // Create stadium
  createStadium: (data) => {
    return api.post('/stadiums', data);
  },

  // Update stadium
  updateStadium: (id, data) => {
    return api.put(`/stadiums/${id}`, data);
  },

  // Delete stadium
  deleteStadium: (id) => {
    return api.delete(`/stadiums/${id}`);
  },

  // Get stadium availability for a date
  getAvailability: async (stadiumId, date) => {
    const response = await api.get(`/stadiums/${stadiumId}/availability`, { date });
    return response;
  },

  // Get stadium reviews
  getReviews: async (stadiumId) => {
    const response = await api.get(`/stadiums/${stadiumId}/reviews`);
    return response;
  },

  // Add review
  addReview: (stadiumId, rating, comment) => {
    return api.post(`/stadiums/${stadiumId}/reviews`, { rating, comment });
  },
};
