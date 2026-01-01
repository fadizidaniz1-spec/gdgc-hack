export * from './theme';

export const FIELD_SIZES = [
  { id: '5v5', label: '5v5', players: 10, icon: 'people-outline' },
  { id: '7v7', label: '7v7', players: 14, icon: 'people' },
  { id: '11v11', label: '11v11', players: 22, icon: 'football' },
];

export const SKILL_LEVELS = [
  { id: 'beginner', label: 'مبتدئ', labelEn: 'Beginner', color: 'beginner' },
  { id: 'intermediate', label: 'متوسط', labelEn: 'Intermediate', color: 'intermediate' },
  { id: 'advanced', label: 'متقدم', labelEn: 'Advanced', color: 'advanced' },
  { id: 'professional', label: 'محترف', labelEn: 'Professional', color: 'professional' },
];

export const POSITIONS = [
  { id: 'goalkeeper', label: 'حارس مرمى', labelEn: 'Goalkeeper', icon: 'hand-left-outline' },
  { id: 'defender', label: 'مدافع', labelEn: 'Defender', icon: 'shield-outline' },
  { id: 'midfielder', label: 'لاعب وسط', labelEn: 'Midfielder', icon: 'swap-horizontal-outline' },
  { id: 'forward', label: 'مهاجم', labelEn: 'Forward', icon: 'flash-outline' },
];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

// User Journey Steps
export const USER_JOURNEY = {
  SEARCH: 'search',
  STADIUM_DETAILS: 'stadium_details',
  SELECT_TIME: 'select_time',
  CONFIRM_BOOKING: 'confirm_booking',
  INVITE_FRIENDS: 'invite_friends',
  PAYMENT: 'payment',
  REVIEW: 'review',
};

// Matchmaking Status
export const MATCH_STATUS = {
  OPEN: 'open',
  FULL: 'full',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Error Types for Error Handling
export const ERROR_TYPES = {
  NETWORK: 'network',
  SERVER: 'server',
  VALIDATION: 'validation',
  AUTH: 'auth',
  BOOKING: 'booking',
  PAYMENT: 'payment',
};
