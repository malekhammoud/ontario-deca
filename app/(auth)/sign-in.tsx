import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import {
  TouchableOpacity,
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

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
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
          case 'form_identifier_not_found':
            newErrors.email = 'No account found with this email address.'
            break
          case 'form_password_incorrect':
            newErrors.password = 'Incorrect password. Please try again.'
            break
          case 'form_param_format_invalid':
            if (meta?.param_name === 'identifier') {
              newErrors.email = 'Please enter a valid email address.'
            }
            break
          case 'session_exists':
            newErrors.general = 'You are already signed in.'
            break
          default:
            // Fallback to the raw message for unhandled cases
            if (meta?.param_name === 'password') {
              newErrors.password = message
            } else if (meta?.param_name === 'identifier') {
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

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
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
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        console.error('Sign in incomplete:', JSON.stringify(signInAttempt, null, 2))
        setErrors({ general: 'Sign in failed. Please check your credentials and try again.' })
      }
    } catch (err: any) {
      console.error('Sign in error:', JSON.stringify(err, null, 2))
      const parsedErrors = parseClerkError(err)
      setErrors(parsedErrors)

      // Show general errors in an alert if they exist
      if (parsedErrors.general) {
        Alert.alert('Sign In Error', parsedErrors.general)
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
            Welcome Back
          </StyledText>
          <StyledText style={styles.subtitle}>
            Sign in to your Ontario DECA account
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
            placeholder="Enter your password"
            secureTextEntry
            secureTextToggle
            autoComplete="password"
            error={errors.password}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.text_secondary} />}
          />

          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <StyledText style={styles.errorText}>{errors.general}</StyledText>
            </View>
          )}

          <Button
            label={loading ? "Signing In..." : "Sign In"}
            onPress={onSignInPress}
            disabled={loading || !emailAddress.trim() || !password.trim()}
            loading={loading}
            style={styles.submitButton}
          />

          <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={() => router.push('/(auth)/forgot-password' as any)}
          >
            <StyledText style={styles.forgotPasswordText}>
              Forgot your password?
            </StyledText>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <StyledText style={styles.linkText}>Don&apos;t have an account? </StyledText>
            <Link href="/(auth)/sign-up" style={styles.link}>
              <StyledText style={styles.linkHighlight}>Sign Up</StyledText>
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
    marginBottom: SPACING.md,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
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
