import { api } from './api';

export const chatService = {
  // Send message to AI chatbot
  sendMessage: async (message, options = {}) => {
    try {
      const response = await api.post('/chat', {
        message,
        latitude: options.latitude || 36.7538,
        longitude: options.longitude || 3.0588,
        skillLevel: options.skillLevel,
        fieldSize: options.fieldSize,
        date: options.date,
      });
      console.log('Chat API Response:', JSON.stringify(response, null, 2));
      // API returns the response directly, not wrapped in data
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  // Get chat history
  getHistory: async () => {
    try {
      const response = await api.get('/chat/history');
      return response;
    } catch (error) {
      console.error('Get history error:', error);
      throw error;
    }
  },

  // Clear chat history
  clearHistory: async () => {
    try {
      const response = await api.delete('/chat/history');
      return response;
    } catch (error) {
      console.error('Clear history error:', error);
      throw error;
    }
  },

  // Get suggestions (local only - no API endpoint)
  getSuggestions: async () => {
    return {
      suggestions: [
        'هل توجد مباريات اليوم؟',
        'أريد البحث عن ملعب قريب',
        'ما هي أفضل الملاعب؟',
        'كيف أحجز ملعب؟',
      ]
    };
  },
};
