import { create } from 'zustand';
import { stadiumService, calculateDistance } from '../services';
import { CONFIG } from '../config';

export const useStadiumStore = create((set, get) => ({
  stadiums: [],
  filteredStadiums: [],
  selectedStadium: null,
  userLocation: null,
  locationLoading: false,
  searchError: null,
  usingRealData: false,
  filters: {
    fieldSize: null,
    maxPrice: null,
    maxDistance: null,
    sortBy: 'distance',
  },

  // Fetch stadiums from API
  fetchStadiums: async (latitude, longitude) => {
    console.log('=== fetchStadiums called ===');
    console.log('Coordinates:', latitude, longitude);
    set({ locationLoading: true, searchError: null });
    
    try {
      console.log('Fetching from API...');
      const response = await stadiumService.getNearbyStadiums(latitude, longitude);
      console.log('API Response:', response);
      const stadiums = response.stadiums || response.data || [];
      
      if (stadiums.length === 0) {
        set({
          stadiums: [],
          filteredStadiums: [],
          userLocation: { latitude, longitude },
          locationLoading: false,
          usingRealData: false,
          searchError: 'لا توجد ملاعب قريبة',
        });
        return [];
      }

      console.log('Stadiums count:', stadiums.length);

      // Calculate distances if not provided
      const stadiumsWithDistance = stadiums.map((stadium) => ({
        ...stadium,
        distance: stadium.distance || calculateDistance(
          latitude, 
          longitude, 
          stadium.latitude, 
          stadium.longitude
        ),
      }));

      const sorted = stadiumsWithDistance.sort((a, b) => a.distance - b.distance);

      set({
        stadiums: sorted,
        filteredStadiums: sorted,
        userLocation: { latitude, longitude },
        locationLoading: false,
        usingRealData: true,
      });

      console.log('Stadiums loaded successfully:', sorted.length);
      return sorted;
    } catch (error) {
      console.error('Fetch stadiums error:', error);
      
      set({
        stadiums: [],
        filteredStadiums: [],
        userLocation: { latitude, longitude },
        locationLoading: false,
        usingRealData: false,
        searchError: 'تعذر جلب الملاعب من الخادم',
      });

      return [];
    }
  },

  // Get stadium details
  getStadiumDetails: async (stadiumId) => {
    try {
      if (USE_API) {
        const response = await stadiumService.getStadiumById(stadiumId);
        return response.stadium || response.data;
      }
    } catch (error) {
      console.error('Get stadium details error:', error);
    }
    return get().stadiums.find((s) => s.id === stadiumId);
  },

  // Get availability
  getAvailability: async (stadiumId, date) => {
    try {
      if (USE_API) {
        const response = await stadiumService.getAvailability(stadiumId, date);
        return response.slots || [];
      }
    } catch (error) {
      console.error('Get availability error:', error);
    }
    // Mock availability
    return [
      { time: '08:00', available: true, price: 3000 },
      { time: '09:00', available: true, price: 3000 },
      { time: '10:00', available: false, price: 3000 },
      { time: '18:00', available: true, price: 5000 },
      { time: '19:00', available: true, price: 5000 },
      { time: '20:00', available: false, price: 5000 },
    ];
  },

  // Get reviews
  getReviews: async (stadiumId) => {
    try {
      if (USE_API) {
        const response = await stadiumService.getReviews(stadiumId);
        return response.reviews || [];
      }
    } catch (error) {
      console.error('Get reviews error:', error);
    }
    return [];
  },

  // Add review
  addReview: async (stadiumId, rating, comment) => {
    try {
      if (USE_API) {
        const response = await stadiumService.addReview(stadiumId, rating, comment);
        return response.review;
      }
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  },

  setUserLocation: (location) => {
    const stadiums = get().stadiums.map((stadium) => ({
      ...stadium,
      distance: location
        ? calculateDistance(location.latitude, location.longitude, stadium.latitude, stadium.longitude)
        : stadium.distance,
    }));
    const sorted = [...stadiums].sort((a, b) => a.distance - b.distance);
    set({ userLocation: location, stadiums: sorted, filteredStadiums: sorted, locationLoading: false });
  },

  setLocationLoading: (loading) => set({ locationLoading: loading }),
  setSelectedStadium: (stadium) => set({ selectedStadium: stadium }),

  applyFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    let filtered = get().stadiums.filter((stadium) => {
      if (filters.fieldSize && stadium.fieldSize !== filters.fieldSize) return false;
      if (filters.maxPrice && stadium.pricePerHour > filters.maxPrice) return false;
      if (filters.maxDistance && stadium.distance > filters.maxDistance) return false;
      return true;
    });

    if (filters.sortBy === 'distance') filtered.sort((a, b) => a.distance - b.distance);
    else if (filters.sortBy === 'price') filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (filters.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    set({ filters, filteredStadiums: filtered });
  },

  clearFilters: () => {
    const stadiums = get().stadiums;
    set({
      filters: { fieldSize: null, maxPrice: null, maxDistance: null, sortBy: 'distance' },
      filteredStadiums: [...stadiums].sort((a, b) => a.distance - b.distance),
    });
  },

  clearSearchError: () => set({ searchError: null }),

  // Alias for backward compatibility
  searchNearbyStadiums: (lat, lng) => get().fetchStadiums(lat, lng),
}));
