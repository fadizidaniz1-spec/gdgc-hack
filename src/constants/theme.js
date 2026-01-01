// Theme constants for consistent styling across the app
// Premium Sports App Design - Modern & Attractive

// Gradient Colors for premium look
export const GRADIENTS = {
  // Primary Gradient - Emerald Green
  primary: ['#00C853', '#1B8B3D', '#0F5C28'],
  primarySoft: ['#E8F5E9', '#C8E6C9', '#A5D6A7'],
  
  // Secondary Gradient - Sunset Orange
  secondary: ['#FF9500', '#FF6B00', '#E65100'],
  secondarySoft: ['#FFF3E0', '#FFE0B2', '#FFCC80'],
  
  // Accent Gradient - Electric Blue
  accent: ['#00B4D8', '#0096C7', '#0077B6'],
  
  // Premium Dark Gradient
  dark: ['#1A1A2E', '#16213E', '#0F3460'],
  darkSoft: ['#2D3748', '#1A202C', '#171923'],
  
  // Success Gradient
  success: ['#00E676', '#00C853', '#00A844'],
  
  // Warning Gradient  
  warning: ['#FFD54F', '#FFC107', '#FFB300'],
  
  // Error Gradient
  error: ['#FF5252', '#F44336', '#D32F2F'],
  
  // Card Overlay Gradient
  cardOverlay: ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)'],
  
  // Glass Effect
  glass: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'],
  glassDark: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)'],
};

// Light Theme Colors - Sports-inspired palette
export const LIGHT_COLORS = {
  // Primary - Vibrant Green
  primary: '#00C853',
  primaryLight: '#69F0AE',
  primaryDark: '#00A844',
  
  // Secondary - Energetic Orange
  secondary: '#FF6B00',
  secondaryLight: '#FF9E40',
  secondaryDark: '#E65100',
  
  // Accent - Electric Blue
  accent: '#00B4D8',
  accentLight: '#48CAE4',
  accentDark: '#0077B6',
  
  // Backgrounds
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceVariant: '#EEF2F6',
  surfaceElevated: '#FFFFFF',
  
  // Status Colors
  error: '#FF5252',
  success: '#00E676',
  warning: '#FFD54F',
  info: '#40C4FF',
  
  // Text Colors
  text: '#1A1A2E',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textLight: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  
  // UI Elements
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  disabled: '#CBD5E1',
  placeholder: '#94A3B8',
  
  // Card Colors
  card: '#FFFFFF',
  cardBorder: 'rgba(0,0,0,0.05)',
  
  // Booking Status
  pending: '#FFB300',
  confirmed: '#00C853',
  rejected: '#FF5252',
  cancelled: '#78909C',
  
  // Skill Levels (for Matchmaking) - Vibrant
  beginner: '#4CAF50',
  intermediate: '#2196F3',
  advanced: '#9C27B0',
  professional: '#FF5722',
  
  // Overlay
  overlay: 'rgba(26, 26, 46, 0.6)',
  overlayLight: 'rgba(26, 26, 46, 0.3)',
  
  // Gradient references
  gradients: GRADIENTS,
};

// Dark Theme Colors - Premium Sports Look
export const DARK_COLORS = {
  // Primary - Neon Green
  primary: '#00E676',
  primaryLight: '#69F0AE',
  primaryDark: '#00C853',
  
  // Secondary - Bright Orange
  secondary: '#FF9100',
  secondaryLight: '#FFAB40',
  secondaryDark: '#FF6D00',
  
  // Accent - Cyan
  accent: '#00E5FF',
  accentLight: '#18FFFF',
  accentDark: '#00B8D4',
  
  // Backgrounds - Deep Navy
  background: '#0A0E14',
  surface: '#12171E',
  surfaceVariant: '#1A2028',
  surfaceElevated: '#1E252E',
  
  // Status Colors
  error: '#FF6B6B',
  success: '#69F0AE',
  warning: '#FFE57F',
  info: '#80D8FF',
  
  // Text Colors
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textLight: '#FFFFFF',
  textOnPrimary: '#0A0E14',
  textOnSecondary: '#0A0E14',
  
  // UI Elements
  border: '#2D3748',
  borderLight: '#1E252E',
  disabled: '#4A5568',
  placeholder: '#64748B',
  
  // Card Colors
  card: '#12171E',
  cardBorder: 'rgba(255,255,255,0.08)',
  
  // Booking Status
  pending: '#FFE57F',
  confirmed: '#69F0AE',
  rejected: '#FF6B6B',
  cancelled: '#78909C',
  
  // Skill Levels (for Matchmaking) - Neon
  beginner: '#69F0AE',
  intermediate: '#40C4FF',
  advanced: '#E040FB',
  professional: '#FF6E40',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  
  // Gradient references
  gradients: GRADIENTS,
};

// Default to Light Colors (will be switched by ThemeContext)
export const COLORS = LIGHT_COLORS;

// Sizes - Optimized for Thumb Zone accessibility
export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  
  // Border Radius - More rounded for modern look
  radius: 16,
  radiusSm: 12,
  radiusLg: 24,
  radiusXl: 32,
  radiusFull: 9999,
  
  // Touch Targets (minimum 44px for accessibility)
  touchTarget: 48,
  touchTargetLg: 56,
  
  // Icon Sizes
  iconSm: 18,
  iconMd: 24,
  iconLg: 28,
  iconXl: 36,
  
  // Screen Padding
  screenPadding: 20,
  screenPaddingLg: 24,
  
  // Card
  cardPadding: 16,
  cardRadius: 20,
};

// Typography - Modern & Clean
export const FONTS = {
  // Font Weights
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

// Font Sizes - Larger for better readability
export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  display: 44,
  hero: 56,
};

// Line Heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// Shadows - More dramatic for depth
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  glowSecondary: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Animation Durations (for Micro-interactions)
export const ANIMATIONS = {
  fast: 150,
  normal: 250,
  slow: 400,
  spring: {
    damping: 12,
    stiffness: 180,
    mass: 1,
  },
  bounce: {
    damping: 8,
    stiffness: 200,
  },
};

// Accessibility - WCAG 2.1 AA compliant contrast ratios
export const ACCESSIBILITY = {
  minContrastRatio: 4.5,
  largeTextContrastRatio: 3,
  focusRingWidth: 3,
  focusRingColor: '#00C853',
};
