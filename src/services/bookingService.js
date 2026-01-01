// Booking API Service
import { api } from './api';

export const bookingService = {
  // Get user bookings
  getBookings: async (status = null) => {
    const params = {};
    if (status) params.status = status;
    const response = await api.get('/bookings', params);
    return response;
  },

  // Get booking details
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response;
  },

  // Create new booking
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response;
  },

  // Cancel booking
  cancelBooking: async (id, reason = '') => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason });
    return response;
  },

  // Process payment
  processPayment: async (bookingId, paymentMethod, cardToken = null) => {
    const body = { paymentMethod };
    if (cardToken) body.cardToken = cardToken;
    const response = await api.post(`/bookings/${bookingId}/payment`, body);
    return response;
  },
};
