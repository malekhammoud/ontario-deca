import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
  Text
} from 'react-native';

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

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    variant = 'primary',
    size = 'medium',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    style,
    disabled,
    ...touchableProps
  } = props;

  // Define styles based on variant
  let buttonStyles = [styles.base, styles[size]];
  let textColor = '#00539E';

  if (variant === 'primary') {
    buttonStyles.push(styles.primary);
    textColor = '#FFFFFF';
  } else if (variant === 'secondary') {
    buttonStyles.push(styles.secondary);
    textColor = '#00539E';
  } else if (variant === 'outline') {
    buttonStyles.push(styles.outline);
    textColor = '#00539E';
  } else if (variant === 'text') {
    buttonStyles.push(styles.text);
    textColor = '#00539E';
  }

  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  }

  if (disabled) {
    buttonStyles.push(styles.disabled);
    textColor = '#64748B';
  }

  if (style) {
    buttonStyles.push(style);
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      {...touchableProps}
    >
      <View style={styles.contentContainer}>
        {leftIcon && !loading && (
          <View style={styles.leftIconContainer}>{leftIcon}</View>
        )}

        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? '#FFFFFF' : '#00539E'}
          />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>
            {label}
          </Text>
        )}

        {rightIcon && !loading && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#00539E',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export { Button };
export default Button;
