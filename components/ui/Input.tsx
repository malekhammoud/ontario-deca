import React, { useState } from 'react';
import { 
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { COLORS, DESIGN_SYSTEM, FONT_SIZES, SPACING } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from './StyledText';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextToggle?: boolean;
  helperText?: string;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  secureTextToggle = false,
  helperText,
  containerStyle,
  style,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureTextHidden, setIsSecureTextHidden] = useState(secureTextEntry);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus && props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur && props.onBlur(e);
  };

  const toggleSecureText = () => {
    setIsSecureTextHidden(!isSecureTextHidden);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <StyledText type="bodyBold" style={styles.label}>
          {label}
        </StyledText>
      )}

      <View style={styles.inputWrapper}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextToggle) && styles.inputWithRightIcon,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            style
          ]}
          placeholderTextColor={COLORS.text_tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextToggle ? isSecureTextHidden : secureTextEntry}
          {...props}
        />

        {secureTextToggle && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={toggleSecureText}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSecureTextHidden ? 'eye-off' : 'eye'}
              size={22}
              color={COLORS.text_secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextToggle && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>

      {(error || helperText) && (
        <StyledText
          type="caption"
          color={error ? COLORS.error : COLORS.text_secondary}
          style={styles.helperText}
        >
          {error || helperText}
        </StyledText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...DESIGN_SYSTEM.input.default,
    flex: 1,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xl + SPACING.sm,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xl + SPACING.sm,
  },
  inputFocused: {
    ...DESIGN_SYSTEM.input.focus,
  },
  inputError: {
    ...DESIGN_SYSTEM.input.error,
  },
  leftIconContainer: {
    position: 'absolute',
    left: SPACING.md,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: SPACING.md,
    zIndex: 1,
  },
  helperText: {
    marginTop: SPACING.xs,
  },
});
