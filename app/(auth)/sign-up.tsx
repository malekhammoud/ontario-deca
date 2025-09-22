import * as React from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StyledText } from '@/components/ui/StyledText'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { COLORS, SPACING } from '@/constants/colors'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [verificationLoading, setVerificationLoading] = React.useState(false)
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
          case 'form_password_pwned':
            newErrors.password = 'This password has been found in a data breach. Please choose a different password.'
            break
          case 'form_password_length_too_short':
            newErrors.password = `Password must be at least ${meta?.minimum_length || 8} characters long.`
            break
          case 'form_password_validation_failed':
            newErrors.password = 'Password must contain at least 8 characters with a mix of letters, numbers, and symbols.'
            break
          case 'form_identifier_exists':
            newErrors.email = 'An account with this email already exists. Try signing in instead.'
            break
          case 'form_param_format_invalid':
            if (meta?.param_name === 'email_address') {
              newErrors.email = 'Please enter a valid email address.'
            }
            break
          default:
            // Fallback to the raw message for unhandled cases
            if (meta?.param_name === 'password') {
              newErrors.password = message
            } else if (meta?.param_name === 'email_address') {
              newErrors.email = message
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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Basic validation
    const newErrors: {[key: string]: string} = {}

    if (!emailAddress.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true)
    } catch (err: any) {
      console.error('Sign up error:', JSON.stringify(err, null, 2))
      const parsedErrors = parseClerkError(err)
      setErrors(parsedErrors)

      // Show general errors in an alert if they exist
      if (parsedErrors.general) {
        Alert.alert('Sign Up Error', parsedErrors.general)
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    if (!code.trim()) {
      setErrors({ code: 'Verification code is required' })
      return
    }

    setVerificationLoading(true)
    setErrors({})

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error('Verification incomplete:', JSON.stringify(signUpAttempt, null, 2))
        setErrors({ code: 'Verification failed. Please check the code and try again.' })
      }
    } catch (err: any) {
      console.error('Verification error:', JSON.stringify(err, null, 2))
      const parsedErrors = parseClerkError(err)

      if (parsedErrors.general) {
        setErrors({ code: parsedErrors.general })
      } else {
        setErrors({ code: 'Invalid verification code. Please try again.' })
      }
    } finally {
      setVerificationLoading(false)
    }
  }

  // Resend verification code
  const onResendPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.')
    } catch (err: any) {
      console.error('Resend error:', JSON.stringify(err, null, 2))
      Alert.alert('Error', 'Failed to resend verification code. Please try again.')
    }
  }

  if (pendingVerification) {
    return (
      <Screen keyboardAvoiding>
        <View style={styles.container}>
          <View style={styles.header}>
            <StyledText type="heading1" style={styles.title}>
              Verify Your Email
            </StyledText>
            <StyledText style={styles.subtitle}>
              We've sent a 6-digit verification code to {emailAddress}
            </StyledText>
          </View>

          <View style={styles.form}>
            <Input
              label="Verification Code"
              value={code}
              onChangeText={(text) => {
                setCode(text)
                clearError('code')
              }}
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              error={errors.code}
              autoFocus
            />

            <Button
              label={verificationLoading ? "Verifying..." : "Verify Email"}
              onPress={onVerifyPress}
              disabled={verificationLoading || !code.trim()}
              loading={verificationLoading}
              style={styles.submitButton}
            />

            <TouchableOpacity onPress={onResendPress} style={styles.resendButton}>
              <StyledText style={styles.resendText}>
                Didn't receive the code? Resend
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <StyledText type="heading1" style={styles.title}>
            Join DECA Ontario
          </StyledText>
          <StyledText style={styles.subtitle}>
            Create your account to access the Provincials Event App
          </StyledText>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            value={emailAddress}
            onChangeText={(text) => {
              setEmailAddress(text)
              clearError('email')
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.text_secondary} />}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              clearError('password')
            }}
            placeholder="Create a secure password"
            secureTextEntry
            secureTextToggle
            autoComplete="password-new"
            error={errors.password}
            helperText="Minimum 8 characters with letters, numbers, and symbols"
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.text_secondary} />}
          />

          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <StyledText style={styles.errorText}>{errors.general}</StyledText>
            </View>
          )}

          <Button
            label={loading ? "Creating Account..." : "Create Account"}
            onPress={onSignUpPress}
            disabled={loading || !emailAddress.trim() || !password.trim()}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.linkContainer}>
            <StyledText style={styles.linkText}>Already have an account? </StyledText>
            <Link href="/(auth)/sign-in" style={styles.link}>
              <StyledText style={styles.linkHighlight}>Sign In</StyledText>
            </Link>
          </View>
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
  submitButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  linkText: {
    color: COLORS.text_secondary,
  },
  link: {
    fontSize: 16,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  resendText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
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
