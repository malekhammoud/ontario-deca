import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import { StyledText } from './StyledText';
import { COLORS, DESIGN_SYSTEM, SPACING } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const getTextColor = () => {
    if (disabled) return COLORS.text_tertiary;

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
      case 'outline':
      case 'text':
        return COLORS.primary;
      default:
        return COLORS.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style
      ]}
      disabled={disabled || loading}
      {...props}
    >
      <View style={styles.contentContainer}>
        {leftIcon && !loading && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : COLORS.primary}
          />
        ) : (
          <StyledText
            type="button"
            color={getTextColor()}
            style={styles.label}
          >
            {label}
          </StyledText>
        )}

        {rightIcon && !loading && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: DESIGN_SYSTEM.button.primary.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    ...DESIGN_SYSTEM.button.primary,
  },
  secondary: {
    ...DESIGN_SYSTEM.button.secondary,
  },
  outline: {
    ...DESIGN_SYSTEM.button.outline,
  },
  text: {
    ...DESIGN_SYSTEM.button.text,
  },
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: 52,
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: SPACING.sm,
  },
  rightIconContainer: {
    marginLeft: SPACING.sm,
  },
  label: {
    textAlign: 'center',
  },
});
