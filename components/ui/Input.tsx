import React, { useState } from 'react';
import { 
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import { COLORS } from '@/constants/colors';
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
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 44,
    flex: 1,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  helperText: {
    marginTop: 8,
  },
});

export default Input;
