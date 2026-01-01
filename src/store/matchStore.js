import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { matchService } from '../services';
import { CONFIG } from '../config';

const USE_API = CONFIG.USE_REAL_API;
const LOCAL_MATCHES_KEY = 'local_team_matches';

const INITIAL_MATCHES = [
  {
    id: '1',
    stadiumId: 'stad_001',
    stadiumName: 'Stade El Harrach',
    stadiumImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400',
    stadiumAddress: 'El Harrach, Algiers',
    date: '2025-01-02',
    time: '18:00',
    fieldSize: '7v7',
    slotsNeeded: 4,
    maxPlayers: 14,
    currentPlayers: 10,
    skillLevel: 'intermediate',
    organizer: 'أمين',
    pricePerPlayer: 500,
    status: 'open',
    matchType: 'player',
  },
];

// Load local matches from AsyncStorage
const loadLocalMatches = async () => {
  try {
    const stored = await AsyncStorage.getItem(LOCAL_MATCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading local matches:', error);
    return [];
  }
};

// Save local matches to AsyncStorage
const saveLocalMatches = async (matches) => {
  try {
    await AsyncStorage.setItem(LOCAL_MATCHES_KEY, JSON.stringify(matches));
  } catch (error) {
    console.error('Error saving local matches:', error);
  }
};

export const useMatchStore = create((set, get) => ({
  matches: [...INITIAL_MATCHES],
  localMatches: [],
  currentMatch: null,
  matchPlayers: [],
  isLoading: false,
  error: null,

  // Initialize - load local matches from storage
  initializeMatches: async () => {
    const localMatches = await loadLocalMatches();
    set({ localMatches });
    // Then fetch all matches
    await get().fetchMatches();
  },

  // Fetch matches
  fetchMatches: async (params = {}) => {
    let { localMatches } = get();
    
    // Load from storage if empty
    if (localMatches.length === 0) {
      localMatches = await loadLocalMatches();
      set({ localMatches });
    }
    
    set({ isLoading: true, error: null });
    
    try {
      if (USE_API) {
        console.log('Fetching matches from API...');
        const response = await matchService.getMatches(params);
        
        const rawMatches = response.matches || response.data || response || [];
        const matchesArray = Array.isArray(rawMatches) ? rawMatches : [];
        
        const apiMatches = matchesArray.map(match => ({
          ...match,
          organizerName: match.organizerName || match.organizer || null,
        }));
        
        // Get local match IDs to filter out duplicates from API
        const localMatchIds = new Set(localMatches.map(m => m.id));
        const filteredApiMatches = apiMatches.filter(m => !localMatchIds.has(m.id));
        
        // Combine local matches with filtered API matches (local first)
        const allMatches = [...localMatches, ...filteredApiMatches];
        console.log('Total matches (local + API):', allMatches.length);
        set({ matches: allMatches, isLoading: false });
        return allMatches;
      }

      // Mock mode: combine local matches with initial matches
      const localMatchIds = new Set(localMatches.map(m => m.id));
      const filteredInitial = INITIAL_MATCHES.filter(m => !localMatchIds.has(m.id));
      let allMatches = [...localMatches, ...filteredInitial];
      
      if (params.skillLevel) {
        allMatches = allMatches.filter((m) => m.skillLevel === params.skillLevel);
      }
      set({ matches: allMatches, isLoading: false });
      return allMatches;
    } catch (error) {
      console.error('Fetch matches error:', error);
      const allMatches = [...localMatches, ...INITIAL_MATCHES];
      set({ isLoading: false, error: error.message, matches: allMatches });
      return allMatches;
    }
  },

  // Get match details with players
  fetchMatchDetails: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const response = await matchService.getMatchById(matchId);
        const match = response.match || response.data;
        const players = response.players || [];
        set({ currentMatch: match, matchPlayers: players, isLoading: false });
        return { match, players };
      }

      const match = get().matches.find((m) => m.id === matchId);
      set({ currentMatch: match, isLoading: false });
      return { match, players: [] };
    } catch (error) {
      console.error('Fetch match details error:', error);
      set({ isLoading: false, error: error.message });
      return null;
    }
  },

  // Get match players
  fetchMatchPlayers: async (matchId) => {
    try {
      if (USE_API) {
        const response = await matchService.getMatchPlayers(matchId);
        const players = response.players || [];
        set({ matchPlayers: players });
        return players;
      }
      return [];
    } catch (error) {
      console.error('Fetch match players error:', error);
      return [];
    }
  },

  // Create match
  addMatch: async (matchData) => {
    set({ isLoading: true, error: null });
    try {
      // Team matches are saved locally only
      if (matchData.matchType === 'team') {
        const newMatch = {
          id: `local_${Date.now()}`,
          ...matchData,
          status: 'open',
          currentPlayers: 0,
          maxPlayers: 2,
          createdAt: new Date().toISOString(),
          isLocal: true,
        };
        
        console.log('Creating local team match:', newMatch);
        
        set((state) => {
          const updatedLocalMatches = [newMatch, ...state.localMatches];
          // Save to AsyncStorage
          saveLocalMatches(updatedLocalMatches);
          return {
            matches: [newMatch, ...state.matches],
            localMatches: updatedLocalMatches,
            isLoading: false,
          };
        });
        
        return newMatch;
      }
      
      // Player matches go to API
      if (USE_API) {
        const response = await matchService.createMatch(matchData);
        const newMatch = response.match || response.data;
        
        set((state) => {
          const exists = state.matches.some(m => m.id === newMatch.id);
          if (exists) {
            return { isLoading: false };
          }
          return {
            matches: [newMatch, ...state.matches],
            isLoading: false,
          };
        });
        return newMatch;
      }

      // Mock create for player matches
      const newMatch = {
        id: `local_${Date.now()}`,
        ...matchData,
        status: 'open',
        currentPlayers: 1,
        maxPlayers: matchData.fieldSize === '5v5' ? 10 : matchData.fieldSize === '11v11' ? 22 : 14,
        createdAt: new Date().toISOString(),
        isLocal: true,
      };
      
      set((state) => {
        const updatedLocalMatches = [newMatch, ...state.localMatches];
        saveLocalMatches(updatedLocalMatches);
        return {
          matches: [newMatch, ...state.matches],
          localMatches: updatedLocalMatches,
          isLoading: false,
        };
      });
      
      return newMatch;
    } catch (error) {
      console.error('Create match error:', error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  // Join match
  joinMatch: async (matchId, playerName = null) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const response = await matchService.joinMatch(matchId, playerName);
        const updatedMatch = response.match;
        
        if (updatedMatch) {
          set((state) => ({
            matches: state.matches.map((m) => m.id === matchId ? updatedMatch : m),
            currentMatch: state.currentMatch?.id === matchId ? updatedMatch : state.currentMatch,
            isLoading: false,
          }));
        } else {
          set((state) => ({
            matches: state.matches.map((match) =>
              match.id === matchId && match.slotsNeeded > 0
                ? { ...match, slotsNeeded: match.slotsNeeded - 1, currentPlayers: (match.currentPlayers || 0) + 1 }
                : match
            ),
            isLoading: false,
          }));
        }
        return true;
      }

      set((state) => ({
        matches: state.matches.map((match) =>
          match.id === matchId && match.slotsNeeded > 0
            ? { ...match, slotsNeeded: match.slotsNeeded - 1, currentPlayers: (match.currentPlayers || 0) + 1 }
            : match
        ),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error('Join match error:', error);
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  // Leave match
  leaveMatch: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        await matchService.leaveMatch(matchId);
      }

      set((state) => ({
        matches: state.matches.map((match) =>
          match.id === matchId 
            ? { ...match, slotsNeeded: match.slotsNeeded + 1, currentPlayers: Math.max(0, (match.currentPlayers || 1) - 1) } 
            : match
        ),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error('Leave match error:', error);
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  getMatchById: (matchId) => {
    return get().matches.find((m) => m.id === matchId);
  },

  setCurrentMatch: (match) => set({ currentMatch: match }),
  clearError: () => set({ error: null }),
}));
