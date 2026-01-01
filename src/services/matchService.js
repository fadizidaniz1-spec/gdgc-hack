// Match API Service
import { api } from './api';

export const matchService = {
  // Get available matches
  getMatches: async (params = {}) => {
    const response = await api.get('/matches', params);
    return response;
  },

  // Get matches by location
  getNearbyMatches: async (latitude, longitude, skillLevel = null) => {
    const params = { latitude, longitude };
    if (skillLevel) params.skillLevel = skillLevel;
    const response = await api.get('/matches', params);
    return response;
  },

  // Get match details
  getMatchById: async (id) => {
    const response = await api.get(`/matches/${id}`);
    return response;
  },

  // Create new match
  createMatch: async (data) => {
    const response = await api.post('/matches', data);
    return response;
  },

  // Join match - send player name for backend to use
  joinMatch: async (matchId, playerName = null) => {
    const body = playerName ? { playerName } : {};
    const response = await api.post(`/matches/${matchId}/join`);
    return response;
  },

  // Leave match
  leaveMatch: async (matchId) => {
    const response = await api.post(`/matches/${matchId}/leave`, {});
    return response;
  },

  // Get match players
  getMatchPlayers: async (matchId) => {
    const response = await api.get(`/matches/${matchId}/players`);
    return response;
  },
};
