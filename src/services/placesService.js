// Google Places API Service for finding nearby stadiums
import { CONFIG } from '../config';

const GOOGLE_PLACES_API_KEY = CONFIG.GOOGLE_PLACES_API_KEY;

// Search for nearby football stadiums/fields
export const searchNearbyStadiums = async (latitude, longitude, radius = 10000) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=stadium&keyword=football|soccer|terrain|stade|ملعب&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results) {
      return data.results.map((place, index) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || 4.0,
        image: place.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
          : `https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400`,
        isOpen: place.opening_hours?.open_now ?? true,
        totalRatings: place.user_ratings_total || 0,
        // Default values for fields not in Google Places
        fieldSize: ['5v5', '7v7', '11v11'][index % 3],
        pricePerHour: 3000 + (index * 500),
        amenities: ['Parking', 'Lighting'],
        description: `Football stadium located at ${place.vicinity}`,
        distance: 0, // Will be calculated
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Places API Error:', error);
    return [];
  }
};

// Get place details for more info
export const getPlaceDetails = async (placeId) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,photos,rating,reviews,website,geometry&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    return null;
  } catch (error) {
    console.error('Place Details Error:', error);
    return null;
  }
};

// Calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};
