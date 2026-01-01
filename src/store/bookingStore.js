import { create } from 'zustand';
import { bookingService } from '../services';
import { CONFIG } from '../config';

const USE_API = CONFIG.USE_REAL_API;

// Mock bookings for fallback
const MOCK_BOOKINGS = [
  {
    id: '1',
    stadiumId: '1',
    stadiumName: 'Stade El Harrach',
    stadiumImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400',
    date: '2025-01-05',
    startTime: '18:00',
    endTime: '19:00',
    duration: 1,
    totalPrice: 5000,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
];

export const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  // Fetch user bookings
  fetchBookings: async (status = null) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        console.log('Fetching bookings from API...');
        const response = await bookingService.getBookings(status);
        console.log('Bookings API response:', response);
        const bookings = response.bookings || response.data || [];
        console.log('Bookings count:', bookings.length);
        set({ bookings, isLoading: false });
        return bookings;
      }
      
      let bookings = MOCK_BOOKINGS;
      if (status) {
        bookings = bookings.filter((b) => b.status === status);
      }
      set({ bookings, isLoading: false });
      return bookings;
    } catch (error) {
      console.error('Fetch bookings error:', error);
      set({ isLoading: false, error: error.message, bookings: [] });
      return [];
    }
  },

  // Get booking details
  getBookingDetails: async (bookingId) => {
    try {
      if (USE_API) {
        const response = await bookingService.getBookingById(bookingId);
        return response.booking || response.data;
      }
    } catch (error) {
      console.error('Get booking details error:', error);
    }
    return get().bookings.find((b) => b.id === bookingId);
  },

  // Create booking
  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const response = await bookingService.createBooking(bookingData);
        const newBooking = response.booking || response.data;
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          currentBooking: newBooking,
          isLoading: false,
        }));
        return newBooking;
      }

      // Mock create
      const newBooking = {
        id: Date.now().toString(),
        ...bookingData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        bookings: [newBooking, ...state.bookings],
        currentBooking: newBooking,
        isLoading: false,
      }));
      return newBooking;
    } catch (error) {
      console.error('Create booking error:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason = '') => {
    set({ isLoading: true });
    try {
      if (USE_API) {
        await bookingService.cancelBooking(bookingId, reason);
      }

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error('Cancel booking error:', error);
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  // Process payment
  processPayment: async (bookingId, paymentMethod, cardToken = null) => {
    set({ isLoading: true });
    try {
      let result;
      if (USE_API) {
        result = await bookingService.processPayment(bookingId, paymentMethod, cardToken);
      } else {
        result = { success: true, transactionId: `TXN_${Date.now()}` };
      }

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: 'confirmed', paymentStatus: 'paid' } : b
        ),
        isLoading: false,
      }));
      return result;
    } catch (error) {
      console.error('Process payment error:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  clearError: () => set({ error: null }),
}));
