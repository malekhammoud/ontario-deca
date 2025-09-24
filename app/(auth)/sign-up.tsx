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
import { useSignUp, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StyledText } from '@/components/ui/StyledText'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { COLORS, SPACING } from '@/constants/colors'
import { validateEmailInDatabase } from '@/utils/emailValidation'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { user } = useUser()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [verificationLoading, setVerificationLoading] = React.useState(false)
  const [emailValidating, setEmailValidating] = React.useState(false)
  const [errors, setErrors] = React.useState<{[key: string]: string}>({})
  const [step, setStep] = React.useState(1) // 1: Email/Password, 2: User Info, 3: Verification
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [school, setSchool] = React.useState('')
  const [linkedin, setLinkedin] = React.useState('')
  const [emailOrPhone, setEmailOrPhone] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>([])

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

  // Simplified function to validate email against database
  const validateEmail = async (email: string): Promise<boolean> => {
    try {
      return await validateEmailInDatabase(email);
    } catch (error) {
      console.error('Email validation error:', error);
      throw error;
    }
  };

  // Handle submission of sign-up form (step 1 - email/password)
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

    // Validate email exists in database
    setEmailValidating(true)
    setErrors({})

    try {
      const emailExists = await validateEmail(emailAddress)

      if (!emailExists) {
        setErrors({
          email: 'This email is not registered for the event. Please contact support if you believe this is an error.'
        })
        return
      }

      // Email is valid, proceed to step 2
      setStep(2)
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Unable to validate email. Please try again.'
      })
    } finally {
      setEmailValidating(false)
    }
  }

  // Handle user info submission (step 2)
  const onUserInfoSubmit = async () => {
    // Basic validation
    const newErrors: {[key: string]: string} = {}

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!school.trim()) {
      newErrors.school = 'School name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Create the account with all the collected information
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          firstName,
          lastName,
          school,
          networking: {
            linkedin,
            emailOrPhone,
            website
          },
          eventSelections: selectedEvents
        }
      })

      // Prepare for email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Move to verification step
      setPendingVerification(true)
      setStep(3)
    } catch (err: any) {
      console.error('Sign up error:', JSON.stringify(err, null, 2))
      const parsedErrors = parseClerkError(err)
      setErrors(parsedErrors)

      if (parsedErrors.general) {
        Alert.alert('Sign Up Error', parsedErrors.general)
      }
    } finally {
      setLoading(false)
    }
  }

  // Toggle event selection
  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents([])
    } else {
      setSelectedEvents([eventId])
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
        // Set the active session
        await setActive({ session: signUpAttempt.createdSessionId })

        // Navigate directly to the main app since profile is already complete
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
              label={verificationLoading ? "Verifying..." : "Complete Registration"}
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

  // Step 2: User Info Collection
  if (step === 2) {
    return (
      <Screen keyboardAvoiding>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <StyledText type="heading1" style={styles.title}>
              Complete Your Profile
            </StyledText>
            <StyledText style={styles.subtitle}>
              Tell us a bit about yourself to get the most out of the event
            </StyledText>
          </View>

          <View style={styles.form}>
            <Input
              label="First Name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text)
                clearError('firstName')
              }}
              placeholder="Enter your first name"
              error={errors.firstName}
              autoFocus
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />}
            />

            <Input
              label="Last Name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text)
                clearError('lastName')
              }}
              placeholder="Enter your last name"
              error={errors.lastName}
              leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />}
            />

            <Input
              label="School"
              value={school}
              onChangeText={(text) => {
                setSchool(text)
                clearError('school')
              }}
              placeholder="Enter your school name"
              error={errors.school}
              leftIcon={<Ionicons name="school-outline" size={20} color={COLORS.text_secondary} />}
            />

            <StyledText style={styles.sectionTitle}>
              Networking Information (Optional)
            </StyledText>

            <Input
              label="LinkedIn Profile"
              value={linkedin}
              onChangeText={setLinkedin}
              placeholder="Enter your LinkedIn URL"
              autoCapitalize="none"
              leftIcon={<Ionicons name="logo-linkedin" size={20} color={COLORS.text_secondary} />}
            />

            <Input
              label="Contact Email/Phone"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              placeholder="Alternative contact method"
              autoCapitalize="none"
              leftIcon={<Ionicons name="call-outline" size={20} color={COLORS.text_secondary} />}
            />

            <Input
              label="Website/Portfolio"
              value={website}
              onChangeText={setWebsite}
              placeholder="Enter your website URL"
              autoCapitalize="none"
              leftIcon={<Ionicons name="globe-outline" size={20} color={COLORS.text_secondary} />}
            />

            <StyledText style={styles.sectionTitle}>
              Event Networking Preferences
            </StyledText>
            <StyledText style={styles.eventSelectionSubtitle}>
              Select up to 1 event for networking opportunities
            </StyledText>

            <View style={styles.eventSelectionContainer}>
              {['Case Study Competition', 'Business Plan Presentation', 'Marketing Competition', 'Finance Competition', 'Entrepreneurship'].map((eventName, index) => {
                const eventId = `event${index + 1}`;
                return (
                  <TouchableOpacity
                    key={eventId}
                    onPress={() => toggleEvent(eventId)}
                    style={[
                      styles.eventButton,
                      selectedEvents.includes(eventId) && styles.eventButtonSelected
                    ]}
                  >
                    <StyledText
                      style={[
                        styles.eventButtonText,
                        selectedEvents.includes(eventId) && styles.eventButtonTextSelected
                      ]}
                    >
                      {eventName}
                    </StyledText>
                    {selectedEvents.includes(eventId) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.white}
                        style={styles.eventCheckIcon}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <StyledText style={styles.eventSelectionHelper}>
              {selectedEvents.length}/1 event selected
            </StyledText>

            {errors.general && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                <StyledText style={styles.errorText}>{errors.general}</StyledText>
              </View>
            )}

            <Button
              label={loading ? "Creating Account..." : "Create Account & Send Verification"}
              onPress={onUserInfoSubmit}
              disabled={loading || !firstName.trim() || !lastName.trim() || !school.trim()}
              loading={loading}
              style={styles.submitButton}
            />

            <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
              <StyledText style={styles.backButtonText}>← Back to Email & Password</StyledText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Screen>
    )
  }

  // Step 1: Email/Password - Render sign-up form
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
            label={emailValidating ? "Validating..." : "Next: Complete Profile"}
            onPress={onSignUpPress}
            disabled={!emailAddress.trim() || !password.trim()}
            loading={emailValidating}
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
  eventSelectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    color: COLORS.primary,
  },
  eventSelectionSubtitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: COLORS.text_secondary,
  },
  eventSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  eventButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    margin: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  eventButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    flex: 1,
  },
  eventButtonTextSelected: {
    fontWeight: '700',
  },
  eventCheckIcon: {
    marginLeft: SPACING.sm,
  },
  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    textAlign: 'left',
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 18,
  },
  backButton: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text_secondary,
    textDecorationLine: 'underline',
  },
  eventSelectionHelper: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.text_secondary,
    marginBottom: SPACING.md,
  },
})
