import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
      <Text style={styles.signOutButtonText}>Sign Out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  signOutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#00539E',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  signOutButtonText: {
    color: '#00539E',
    fontSize: 16,
    fontWeight: '600',
  },
})
