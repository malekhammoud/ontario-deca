/**
 * DECA Ontario App Theme Configuration
 */

export const COLORS = {
  // Primary DECA Colors
  primary: '#00539E', // DECA Blue (PMS 287 C)
  primary_dark: '#003E77', // Darker shade of DECA Blue
  primary_light: '#3379B5', // Lighter shade of DECA Blue

  // Neutrals & Backgrounds
  background: '#FFFFFF',
  card: '#FFFFFF',
  surface: '#F8F9FA',

  // Text
  text: '#202124',
  text_secondary: '#5F6368',
  text_tertiary: '#9AA0A6',

  // Utility
  border: '#E1E3E5',
  disabled: '#DADCE0',
  error: '#D93025',
  success: '#0F9D58',
  warning: '#F4B400',

  // State colors
  stateActive: '#E8F0FE',
  statePressed: '#D2E3FC',

  // System
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const FONTS = {
  heading: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  subheading: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  body: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  button: {
    fontFamily: 'System',
    fontWeight: '600',
  },
  caption: {
    fontFamily: 'System',
    fontWeight: '400',
  },
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const NAV_THEME = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.primary,
  },
};

// Design system for consistent component styling
export const DESIGN_SYSTEM = {
  // Button styles
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      color: '#FFFFFF',
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      ...SHADOWS.md,
    },
    secondary: {
      backgroundColor: COLORS.background,
      color: COLORS.primary,
      borderWidth: 2,
      borderColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
    },
    text: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      padding: SPACING.md,
    },
  },

  // Card styles
  card: {
    default: {
      backgroundColor: COLORS.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      ...SHADOWS.sm,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    elevated: {
      backgroundColor: COLORS.card,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      ...SHADOWS.md,
    },
    flat: {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
    },
  },

  // Form input styles
  input: {
    default: {
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZES.md,
      color: COLORS.text,
    },
    focus: {
      borderColor: COLORS.primary,
    },
    error: {
      borderColor: COLORS.error,
    },
  },
};
