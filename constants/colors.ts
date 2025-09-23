/**
 * DECA Ontario App Theme Configuration
 * Professional design system with modern animations
 */

export const COLORS = {
  // Primary DECA Colors - more professional tones
  primary: '#00539E', // DECA Blue (PMS 287 C)
  primary_dark: '#003E77', // Darker shade of DECA Blue
  primary_light: '#2B6CB0', // More subtle lighter shade
  primary_gradient: ['#00539E', '#2B6CB0'], // Professional gradient

  // Professional accent colors
  secondary: '#4F46E5', // Professional indigo
  accent: '#059669', // Professional emerald
  success: '#10B981', // Clean green
  warning: '#F59E0B', // Professional amber
  error: '#EF4444', // Clean red
  info: '#3B82F6', // Professional blue

  // Professional backgrounds
  background: '#FFFFFF',
  background_secondary: '#F8FAFC',
  background_dark: '#0F172A',
  card: '#FFFFFF',
  card_dark: '#1E293B',
  surface: '#F1F5F9',
  surface_elevated: '#FFFFFF',

  // Professional text hierarchy
  text: '#0F172A',
  text_secondary: '#475569',
  text_tertiary: '#64748B',
  text_light: '#94A3B8',
  text_on_primary: '#FFFFFF',
  text_muted: '#94A3B8',

  // Professional interactive states
  border: '#E2E8F0',
  border_light: '#F1F5F9',
  border_focus: '#00539E',
  disabled: '#CBD5E1',
  placeholder: '#94A3B8',

  // Professional state colors
  stateActive: '#EFF6FF',
  statePressed: '#DBEAFE',
  stateHover: '#F0F9FF',

  // Professional overlays
  transparent: 'transparent',
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlay_light: 'rgba(15, 23, 42, 0.3)',
  backdrop: 'rgba(15, 23, 42, 0.8)',

  // Professional tab bar
  tab_background: '#FFFFFF',
  tab_shadow: 'rgba(0, 83, 158, 0.08)',
};

export const GRADIENTS = {
  primary: ['#00539E', '#2B6CB0'],
  secondary: ['#4F46E5', '#7C3AED'],
  success: ['#10B981', '#059669'],
  professional: ['#F8FAFC', '#FFFFFF'],
  subtle: ['rgba(0, 83, 158, 0.05)', 'rgba(0, 83, 158, 0.02)'],
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Professional spacing scale
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Mobile-specific spacing
  screen_horizontal: 20,
  screen_vertical: 16,
  card_margin: 12,
  section_gap: 24,
};

// Mobile-optimized border radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// Mobile-optimized font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  display: 36,
};

export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// Professional animation timings
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    ease: 'ease-out',
    spring: { damping: 20, stiffness: 300 },
  },
};

export const FONTS = {
  heading: {
    fontFamily: 'System',
    fontWeight: FONT_WEIGHTS.bold,
  },
  subheading: {
    fontFamily: 'System',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  body: {
    fontFamily: 'System',
    fontWeight: FONT_WEIGHTS.regular,
  },
  button: {
    fontFamily: 'System',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  caption: {
    fontFamily: 'System',
    fontWeight: FONT_WEIGHTS.medium,
  },
};

// Mobile device dimensions and safe areas
export const LAYOUT = {
  // Standard mobile breakpoints
  mobile: {
    small: 320,  // iPhone SE
    medium: 375, // iPhone 12/13/14
    large: 414,  // iPhone 12/13/14 Plus
    xl: 428,     // iPhone 14 Pro Max
  },
  // Component dimensions
  tab_bar_height: 84,
  header_height: 120,
  card_min_height: 80,
  button_height: 48,
  input_height: 44,
  // Safe area considerations
  safe_area_bottom: 34, // iPhone with home indicator
  safe_area_top: 44,    // iPhone with notch
};

// Professional design system
export const DESIGN_SYSTEM = {
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.text_on_primary,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: 12,
      paddingHorizontal: SPACING.lg,
      minHeight: LAYOUT.button_height,
      ...SHADOWS.small,
    },
    secondary: {
      backgroundColor: COLORS.background,
      color: COLORS.primary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: 12,
      paddingHorizontal: SPACING.lg,
      minHeight: LAYOUT.button_height,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: SPACING.lg,
      minHeight: LAYOUT.button_height,
    },
  },
  card: {
    default: {
      backgroundColor: COLORS.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginHorizontal: SPACING.screen_horizontal,
      marginVertical: SPACING.card_margin,
      ...SHADOWS.small,
    },
    elevated: {
      backgroundColor: COLORS.card,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginHorizontal: SPACING.screen_horizontal,
      marginVertical: SPACING.card_margin,
      ...SHADOWS.medium,
    },
  },
};
