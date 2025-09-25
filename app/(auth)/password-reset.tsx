import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { StyledText } from '@/components/ui/StyledText'
import { Screen } from '@/components/ui/Screen'
import { COLORS, SPACING } from '@/constants/colors'

export default function ResetPasswordHandler() {
  const router = useRouter()
  const params = useLocalSearchParams()

  useEffect(() => {
    // Extract the verification code from URL parameters
    const code = params.code || params.token || params.verification_code
    
    if (code) {
      // Navigate to reset password screen with the code
      router.replace({
        pathname: '/(auth)/reset-password',
        params: { code: code as string }
      } as any)
    } else {
      // No code found, redirect to forgot password
      router.replace('/(auth)/forgot-password' as any)
    }
  }, [params])

  return (
    <Screen>
      <View style={styles.container}>
        <StyledText style={styles.text}>Processing your password reset...</StyledText>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  text: {
    textAlign: 'center',
    color: COLORS.text_secondary,
  },
})
