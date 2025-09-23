import * as React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { StyledText } from '@/components/ui/StyledText'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Screen } from '@/components/ui/Screen'
import { Card } from '@/components/ui/Card'
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

  // Toggle event selection
  const toggleEvent = (eventId: string) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents([])
    } else {
      setSelectedEvents([eventId])
    }
  }

  // Save profile changes
  const saveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      await user.update({
        unsafeMetadata: {
          ...metadata,
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
    // Reset form to original values
    setFirstName(metadata.firstName || '')
    setLastName(metadata.lastName || '')
    setSchool(metadata.school || '')
    setLinkedin(networking.linkedin || '')
    setEmailOrPhone(networking.emailOrPhone || '')
    setWebsite(networking.website || '')
    setSelectedEvents(eventSelections)
    setIsEditing(false)
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <StyledText type="heading1" style={styles.title}>
            My Profile
          </StyledText>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Ionicons 
              name={isEditing ? "close" : "pencil"} 
              size={20} 
              color={COLORS.primary} 
            />
            <StyledText style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </StyledText>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <Card style={styles.section}>
          <StyledText type="heading2" style={styles.sectionTitle}>
            Personal Information
          </StyledText>
          
          {isEditing ? (
            <>
              <Input
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />}
              />
              <Input
                label="School"
                value={school}
                onChangeText={setSchool}
                placeholder="Enter your school name"
                leftIcon={<Ionicons name="school-outline" size={20} color={COLORS.text_secondary} />}
              />
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />
                <View style={styles.infoContent}>
                  <StyledText style={styles.infoLabel}>Name</StyledText>
                  <StyledText style={styles.infoValue}>
                    {firstName && lastName ? `${firstName} ${lastName}` : 'Not provided'}
                  </StyledText>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={20} color={COLORS.text_secondary} />
                <View style={styles.infoContent}>
                  <StyledText style={styles.infoLabel}>School</StyledText>
                  <StyledText style={styles.infoValue}>
                    {school || 'Not provided'}
                  </StyledText>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Networking Information */}
        <Card style={styles.section}>
          <StyledText type="heading2" style={styles.sectionTitle}>
            Networking Information
          </StyledText>
          
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
                <StyledText style={styles.emptyState}>
                  No networking information provided. Tap edit to add your contact details.
                </StyledText>
              )}
            </>
          )}
        </Card>

        {/* Event Preferences */}
        <Card style={styles.section}>
          <StyledText type="heading2" style={styles.sectionTitle}>
            Event Networking Preferences
          </StyledText>
          
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
                <StyledText style={styles.emptyState}>
                  No event preferences selected. Tap edit to choose your networking interests.
                </StyledText>
              )}
            </>
          )}
        </Card>

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
              <StyledText style={styles.cancelButtonText}>Cancel</StyledText>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '10',
  },
  editButtonText: {
    color: COLORS.primary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text_primary,
    marginBottom: SPACING.md,
  },
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
  emptyState: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    fontStyle: 'italic',
    paddingVertical: SPACING.lg,
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
  buttonContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  saveButton: {
    marginBottom: SPACING.md,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  cancelButtonText: {
    color: COLORS.text_secondary,
    textDecorationLine: 'underline',
  },
})
