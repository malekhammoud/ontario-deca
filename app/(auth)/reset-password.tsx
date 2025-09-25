import { useSignIn } from '@clerk/clerk-expo'
import { useRouter, useLocalSearchParams } from 'expo-router'
import {
  View,
  StyleSheet,
  Alert
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { StyledText } from '@/components/ui/StyledText'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { COLORS, SPACING } from '@/constants/colors'

export default function ResetPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { code } = useLocalSearchParams<{ code?: string }>()

  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [verificationCode, setVerificationCode] = React.useState(code || '')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{[key: string]: string}>({})

  // Clear errors when user types
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Parse Clerk errors into user-friendly messages
  const parseClerkError = (err: any) => {
    const newErrors: {[key: string]: string} = {}

    if (err.errors && Array.isArray(err.errors)) {
      err.errors.forEach((error: any) => {
        const { code, message, meta } = error

        switch (code) {
          case 'form_code_incorrect':
            newErrors.code = 'Invalid verification code. Please check your email for the correct code.'
            break
          case 'form_password_pwned':
            newErrors.password = 'This password has been found in a data breach. Please choose a different password.'
            break
          case 'form_password_length_too_short':
            newErrors.password = 'Password must be at least 8 characters long.'
            break
          case 'form_password_not_strong_enough':
            newErrors.password = 'Password is not strong enough. Include uppercase, lowercase, numbers, and special characters.'
            break
          case 'verification_expired':
            newErrors.code = 'Verification code has expired. Please request a new password reset.'
            break
          case 'verification_failed':
            newErrors.code = 'Verification failed. Please check your code and try again.'
            break
          default:
            if (meta?.param_name === 'password') {
              newErrors.password = message
            } else if (meta?.param_name === 'code') {
              newErrors.code = message
            } else {
              newErrors.general = message
            }
        }
      })
    } else {
      newErrors.general = 'An unexpected error occurred. Please try again.'
    }

    return newErrors
  }

  // Validate password strength
  const validatePassword = (pwd: string) => {
    const errors: string[] = []
    
    if (pwd.length < 8) {
      errors.push('at least 8 characters')
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('a lowercase letter')
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('an uppercase letter')
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('a number')
    }
    if (!/[^a-zA-Z0-9]/.test(pwd)) {
      errors.push('a special character')
    }
    
    return errors
  }

  // Handle the submission of the reset password form
  const onResetPasswordPress = async () => {
    if (!isLoaded) return

    // Basic validation
    const newErrors: {[key: string]: string} = {}

    if (!verificationCode.trim()) {
      newErrors.code = 'Verification code is required'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else {
      const passwordErrors = validatePassword(password)
      if (passwordErrors.length > 0) {
        newErrors.password = `Password must include: ${passwordErrors.join(', ')}`
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const resetAttempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: verificationCode,
        password: password,
      })

      if (resetAttempt.status === 'complete') {
        await setActive({ session: resetAttempt.createdSessionId })
        
        Alert.alert(
          'Password Reset Successful',
          'Your password has been reset successfully. You are now signed in.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        )
      } else {
        console.error('Reset incomplete:', JSON.stringify(resetAttempt, null, 2))
        setErrors({ general: 'Password reset failed. Please try again.' })
      }
    } catch (err: any) {
      console.error('Reset password error:', JSON.stringify(err, null, 2))
      const parsedErrors = parseClerkError(err)
      setErrors(parsedErrors)

      if (parsedErrors.general) {
        Alert.alert('Reset Failed', parsedErrors.general)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <StyledText type="heading1" style={styles.title}>
            Reset Password
          </StyledText>
          <StyledText style={styles.subtitle}>
            Enter the verification code from your email and choose a new password.
          </StyledText>
        </View>

        <View style={styles.form}>
          <Input
            label="Verification Code"
            value={verificationCode}
            onChangeText={(text) => {
              setVerificationCode(text)
              clearError('code')
            }}
            placeholder="Enter verification code"
            keyboardType="default"
            autoCapitalize="none"
            error={errors.code}
            leftIcon={<Ionicons name="key-outline" size={20} color={COLORS.text_secondary} />}
          />

          <Input
            label="New Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              clearError('password')
            }}
            placeholder="Enter new password"
            secureTextEntry
            secureTextToggle
            autoComplete="new-password"
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.text_secondary} />}
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              clearError('confirmPassword')
            }}
            placeholder="Confirm new password"
            secureTextEntry
            secureTextToggle
            autoComplete="new-password"
            error={errors.confirmPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.text_secondary} />}
          />

          <View style={styles.passwordRequirements}>
            <StyledText style={styles.requirementsTitle}>Password Requirements:</StyledText>
            <StyledText style={styles.requirementsText}>
              • At least 8 characters long{'\n'}
              • Include uppercase and lowercase letters{'\n'}
              • Include at least one number{'\n'}
              • Include at least one special character
            </StyledText>
          </View>

          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <StyledText style={styles.errorText}>{errors.general}</StyledText>
            </View>
          )}

          <Button
            label={loading ? "Resetting..." : "Reset Password"}
            onPress={onResetPasswordPress}
            disabled={loading || !verificationCode.trim() || !password.trim() || !confirmPassword.trim()}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  passwordRequirements: {
    backgroundColor: COLORS.primary + '08',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  requirementsTitle: {
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  requirementsText: {
    color: COLORS.text_secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },
})
