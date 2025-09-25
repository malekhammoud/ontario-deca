import * as React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useUser, useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StyledText } from '@/components/ui/StyledText'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { Card } from '@/components/ui/Card'
import { Header } from '@/components/ui/Header'
import { COLORS, SPACING } from '@/constants/colors'

const EVENT_NAMES = {
  event1: 'Case Study Competition',
  event2: 'Business Plan Presentation', 
  event3: 'Marketing Competition',
  event4: 'Finance Competition',
  event5: 'Entrepreneurship'
}

export default function ProfileScreen() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  // Extract user metadata
  const metadata = user?.unsafeMetadata || {}
  const networking = metadata.networking || {}
  const eventSelections = metadata.eventSelections || []

  // Edit form state
  const [firstName, setFirstName] = React.useState(metadata.firstName || '')
  const [lastName, setLastName] = React.useState(metadata.lastName || '')
  const [school, setSchool] = React.useState(metadata.school || '')
  const [linkedin, setLinkedin] = React.useState(networking.linkedin || '')
  const [emailOrPhone, setEmailOrPhone] = React.useState(networking.emailOrPhone || '')
  const [website, setWebsite] = React.useState(networking.website || '')
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>(eventSelections)

  // Check if user data came from database (not editable)
  const isFromDatabase = metadata.isFromDatabase || false

  // Toggle event selection
  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents([])
    } else {
      setSelectedEvents([eventId])
    }
  }

  // Save profile changes - only allow editing of networking info and events
  const saveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
          // Keep database-sourced info unchanged
          networking: {
            linkedin,
            emailOrPhone,
            website
          },
          eventSelections: selectedEvents
        }
      })
      
      setIsEditing(false)
      Alert.alert('Success', 'Your profile has been updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    // Reset form to original values (only networking info)
    setLinkedin(networking.linkedin || '')
    setEmailOrPhone(networking.emailOrPhone || '')
    setWebsite(networking.website || '')
    setSelectedEvents(eventSelections)
    setIsEditing(false)
  }

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/sign-in') // Redirect to sign-in screen
    } catch (error) {
      console.error('Error signing out:', error)
      Alert.alert('Error', 'Failed to sign out. Please try again.')
    }
  }

  if (!isLoaded) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <StyledText>Loading profile...</StyledText>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <Header
        title="My Profile"
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Edit Profile Prompt - More Prominent */}
        {!isEditing && (
          <Card style={styles.editPromptCard}>
            <TouchableOpacity 
              style={styles.editPromptButton}
              onPress={() => setIsEditing(true)}
            >
              <View style={styles.editPromptContent}>
                <View style={styles.editPromptIconContainer}>
                  <Ionicons name="pencil" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.editPromptTextContainer}>
                  <StyledText style={styles.editPromptTitle}>
                    Edit Your Profile
                  </StyledText>
                  <StyledText style={styles.editPromptSubtitle}>
                    Update networking info & event preferences
                  </StyledText>
                </View>
                <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </Card>
        )}

        {/* Edit Mode Header */}
        {isEditing && (
          <Card style={styles.editModeCard}>
            <View style={styles.editModeHeader}>
              <View style={styles.editModeIconContainer}>
                <Ionicons name="create-outline" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.editModeTextContainer}>
                <StyledText style={styles.editModeTitle}>
                  Edit Mode
                </StyledText>
                <StyledText style={styles.editModeSubtitle}>
                  Make your changes below
                </StyledText>
              </View>
              <TouchableOpacity 
                onPress={cancelEdit}
                style={styles.closeEditButton}
              >
                <Ionicons name="close" size={24} color={COLORS.text_secondary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Personal Information */}
        <Card style={styles.section}>
          <StyledText type="heading2" style={styles.sectionTitle}>
            Personal Information
            {isFromDatabase && (
              <StyledText style={styles.databaseBadge}> (From Database)</StyledText>
            )}
          </StyledText>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />
            <View style={styles.infoContent}>
              <StyledText style={styles.infoLabel}>Name</StyledText>
              <StyledText style={styles.infoValue}>
                {metadata.firstName && metadata.lastName ? `${metadata.firstName} ${metadata.lastName}` : 'Not provided'}
              </StyledText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color={COLORS.text_secondary} />
            <View style={styles.infoContent}>
              <StyledText style={styles.infoLabel}>School</StyledText>
              <StyledText style={styles.infoValue}>
                {metadata.school || 'Not provided'}
              </StyledText>
            </View>
          </View>

          {isFromDatabase && (
            <View style={styles.databaseNotice}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
              <StyledText style={styles.databaseNoticeText}>
                Your name and school information is sourced from our event database and cannot be edited here.
              </StyledText>
            </View>
          )}
        </Card>

        {/* Networking Information */}
        <Card style={[styles.section, isEditing && styles.editableSection]}>
          <View style={styles.sectionHeader}>
            <StyledText type="heading2" style={styles.sectionTitle}>
              Networking Information
            </StyledText>
            {isEditing && (
              <View style={styles.editableIndicator}>
                <Ionicons name="create" size={16} color={COLORS.primary} />
                <StyledText style={styles.editableText}>Editable</StyledText>
              </View>
            )}
          </View>
          
          {isEditing ? (
            <>
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
            </>
          ) : (
            <>
              {linkedin && (
                <View style={styles.infoRow}>
                  <Ionicons name="logo-linkedin" size={20} color={COLORS.text_secondary} />
                  <View style={styles.infoContent}>
                    <StyledText style={styles.infoLabel}>LinkedIn</StyledText>
                    <StyledText style={styles.infoValue}>{linkedin}</StyledText>
                  </View>
                </View>
              )}
              
              {emailOrPhone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color={COLORS.text_secondary} />
                  <View style={styles.infoContent}>
                    <StyledText style={styles.infoLabel}>Contact</StyledText>
                    <StyledText style={styles.infoValue}>{emailOrPhone}</StyledText>
                  </View>
                </View>
              )}
              
              {website && (
                <View style={styles.infoRow}>
                  <Ionicons name="globe-outline" size={20} color={COLORS.text_secondary} />
                  <View style={styles.infoContent}>
                    <StyledText style={styles.infoLabel}>Website</StyledText>
                    <StyledText style={styles.infoValue}>{website}</StyledText>
                  </View>
                </View>
              )}
              
              {!linkedin && !emailOrPhone && !website && (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="add-circle-outline" size={32} color={COLORS.text_secondary} />
                  <StyledText style={styles.emptyState}>
                    No networking information provided.
                  </StyledText>
                  <StyledText style={styles.emptyStateHint}>
                    Tap "Edit Your Profile" above to add your contact details.
                  </StyledText>
                </View>
              )}
            </>
          )}
        </Card>

        {/* Event Preferences */}
        <Card style={[styles.section, isEditing && styles.editableSection]}>
          <View style={styles.sectionHeader}>
            <StyledText type="heading2" style={styles.sectionTitle}>
              Event Networking Preferences
            </StyledText>
            {isEditing && (
              <View style={styles.editableIndicator}>
                <Ionicons name="create" size={16} color={COLORS.primary} />
                <StyledText style={styles.editableText}>Editable</StyledText>
              </View>
            )}
          </View>
          
          {isEditing ? (
            <>
              <StyledText style={styles.subtitle}>
                Select an event for networking opportunities
              </StyledText>
              <View style={styles.eventContainer}>
                {Object.entries(EVENT_NAMES).map(([eventId, eventName]) => (
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
                ))}
              </View>
              <StyledText style={styles.eventHelper}>
                {selectedEvents.length} event selected
              </StyledText>
            </>
          ) : (
            <>
              {eventSelections.length > 0 ? (
                <View style={styles.eventContainer}>
                  {eventSelections.map((eventId: string) => (
                    <View key={eventId} style={styles.selectedEventChip}>
                      <StyledText style={styles.selectedEventText}>
                        {EVENT_NAMES[eventId as keyof typeof EVENT_NAMES] || eventId}
                      </StyledText>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="calendar-outline" size={32} color={COLORS.text_secondary} />
                  <StyledText style={styles.emptyState}>
                    No event preferences selected.
                  </StyledText>
                  <StyledText style={styles.emptyStateHint}>
                    Tap "Edit Your Profile" above to choose your networking interests.
                  </StyledText>
                </View>
              )}
            </>
          )}
        </Card>

        {/* Save/Cancel Buttons - Enhanced */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button
              label={loading ? "Saving..." : "Save Changes"}
              onPress={saveProfile}
              disabled={loading}
              loading={loading}
              style={styles.saveButton}
            />
            <TouchableOpacity onPress={cancelEdit} style={styles.cancelButton}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.text_secondary} />
              <StyledText style={styles.cancelButtonText}>Cancel Changes</StyledText>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign Out Button - Always visible */}
        <View style={styles.signOutContainer}>
          <Button
            label="Sign Out"
            onPress={handleSignOut}
            style={styles.signOutButton}
            textStyle={styles.signOutButtonText}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Enhanced Edit Prompt Styles
  editPromptCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.primary + '08',
    borderColor: COLORS.primary + '30',
    borderWidth: 2,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editPromptButton: {
    padding: SPACING.lg,
  },
  editPromptContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editPromptIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  editPromptTextContainer: {
    flex: 1,
  },
  editPromptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  editPromptSubtitle: {
    fontSize: 14,
    color: COLORS.primary + 'CC',
  },

  // Edit Mode Header Styles
  editModeCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.success + '08',
    borderColor: COLORS.success + '30',
    borderWidth: 1,
    borderRadius: 12,
  },
  editModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  editModeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  editModeTextContainer: {
    flex: 1,
  },
  editModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: 2,
  },
  editModeSubtitle: {
    fontSize: 13,
    color: COLORS.success + 'CC',
  },
  closeEditButton: {
    padding: SPACING.xs,
  },

  // Section Styles
  section: {
    marginBottom: SPACING.lg,
  },
  editableSection: {
    borderColor: COLORS.primary + '20',
    borderWidth: 1,
    backgroundColor: COLORS.primary + '02',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text_primary,
    flex: 1,
  },
  editableIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  editableText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },

  // Enhanced Empty State
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyState: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    fontSize: 16,
    fontWeight: '500',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  emptyStateHint: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Enhanced Button Styles
  buttonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  saveButton: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    backgroundColor: COLORS.background_secondary,
  },
  cancelButtonText: {
    color: COLORS.text_secondary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },

  // Existing styles (keeping all the original ones)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text_secondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text_primary,
    fontWeight: '500',
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    marginBottom: SPACING.md,
  },
  eventContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.md,
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
  },
  eventButtonTextSelected: {
    fontWeight: '700',
  },
  eventCheckIcon: {
    marginLeft: SPACING.sm,
  },
  eventHelper: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.text_secondary,
  },
  selectedEventChip: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    margin: SPACING.xs,
  },
  selectedEventText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  databaseBadge: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  databaseNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  databaseNoticeText: {
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    fontSize: 14,
  },
  signOutContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  signOutButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    textAlign: 'center',
  },
})