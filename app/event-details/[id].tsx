import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  Share,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Mock event data - in a real app, this would come from an API or database
const EVENT_DATA = {
  '1': {
    id: '1',
    title: 'Registration & Check-in',
    date: 'September 22, 2025',
    time: '8:00 AM - 10:00 AM',
    location: 'Main Entrance',
    locationDetails: 'First floor, near the front doors',
    description: 'Welcome to DECA Provincials! Please arrive during this time to check in, collect your name badge, event materials, and welcome package. All participants must check in during this time slot.',
    category: 'all',
    organizer: 'Event Team',
    notes: 'Please bring your ID and registration confirmation.',
    image: 'https://via.placeholder.com/400x200',
    reminder: true,
    locationMapImageUrl: 'https://via.placeholder.com/400x200',
  },
  '2': {
    id: '2',
    title: 'Opening Ceremony',
    date: 'September 22, 2025',
    time: '10:30 AM - 12:00 PM',
    location: 'Grand Ballroom',
    locationDetails: 'Second floor, east wing',
    description: 'The official opening ceremony for DECA Provincials 2025. Join us for inspiring speeches, recognition of chapters, and an overview of the competition schedule. All participants are required to attend.',
    category: 'all',
    organizer: 'DECA Ontario Board',
    speakers: ['Dr. Jane Smith, DECA Ontario President', 'Michael Johnson, Business Leader', 'Sarah Williams, Past DECA Champion'],
    notes: 'Doors close at 10:25 AM. Please arrive early to find seating.',
    image: 'https://via.placeholder.com/400x200',
    reminder: false,
    locationMapImageUrl: 'https://via.placeholder.com/400x200',
  },
  '6': {
    id: '6',
    title: 'Finance Competition Briefing',
    date: 'September 23, 2025',
    time: '9:00 AM - 10:00 AM',
    location: 'Auditorium',
    locationDetails: 'First floor, west wing',
    description: 'Mandatory briefing for all participants competing in Finance events. This session will cover competition rules, judging criteria, and specific guidelines for finance case studies.',
    category: 'finance',
    organizer: 'Finance Competition Team',
    notes: 'Bring your participant handbook and a notepad.',
    image: 'https://via.placeholder.com/400x200',
    reminder: false,
    materials: ['Finance Competition Guidelines', 'Financial Formulas Reference Sheet'],
    locationMapImageUrl: 'https://via.placeholder.com/400x200',
  },
  '10': {
    id: '10',
    title: 'Marketing Presentations',
    date: 'September 24, 2025',
    time: '9:00 AM - 12:00 PM',
    location: 'Conference Rooms C-F',
    locationDetails: 'Third floor, north wing',
    description: 'Marketing case study presentations. Participants will present their solutions to the judges according to the schedule provided at check-in.',
    category: 'marketing',
    organizer: 'Marketing Competition Team',
    notes: 'Arrive 15 minutes before your scheduled presentation time. Business professional attire required.',
    image: 'https://via.placeholder.com/400x200',
    reminder: true,
    locationMapImageUrl: 'https://via.placeholder.com/400x200',
  },
  '16': {
    id: '16',
    title: 'Awards Ceremony',
    date: 'September 25, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Main Auditorium',
    locationDetails: 'First floor, central building',
    description: 'The culmination of DECA Provincials 2025! Join us as we recognize and celebrate the achievements of all participants and announce the winners in each category.',
    category: 'all',
    organizer: 'DECA Ontario Board',
    notes: 'All participants should attend. Doors open at 3:30 PM.',
    image: 'https://via.placeholder.com/400x200',
    reminder: true,
    locationMapImageUrl: 'https://via.placeholder.com/400x200',
    special: true,
  },
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reminderSet, setReminderSet] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  // Get event data from ID
  const event = EVENT_DATA[id] || null;

  useEffect(() => {
    // Initialize reminder state from event data
    if (event) {
      setReminderSet(event.reminder || false);
    }
  }, [event]);

  if (!event) {
    return (
      <View style={styles.container}>
        <Header title="Event Details" />
        <View style={styles.notFoundContainer}>
          <Ionicons name="calendar-outline" size={60} color={COLORS.text_tertiary} />
          <StyledText type="subheading" style={styles.notFoundText}>
            Event not found
          </StyledText>
          <Button
            label="Go Back"
            variant="primary"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  const handleSetReminder = () => {
    // In a real app, this would schedule a notification
    setReminderSet(!reminderSet);

    Alert.alert(
      !reminderSet ? 'Reminder Set' : 'Reminder Removed',
      !reminderSet
        ? `You will be reminded 30 minutes before ${event.title}`
        : `Reminder for ${event.title} has been removed`,
      [{ text: 'OK' }]
    );
  };

  const handleAddToCalendar = () => {
    // In a real app, this would add the event to the device calendar
    setAddedToCalendar(true);

    Alert.alert(
      'Added to Calendar',
      `${event.title} has been added to your calendar`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event at DECA Provincials!\n\n${event.title}\n${event.date}, ${event.time}\n${event.location}\n\n${event.description}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const handleViewLocation = () => {
    // Navigate to the map view focused on this location
    router.push({
      pathname: '/location-detail',
      params: { title: event.location, details: event.locationDetails }
    });
  };

  const today = new Date();
  const eventDate = new Date(`${event.date} ${event.time.split(' - ')[0]}`);
  const isToday = today.toDateString() === eventDate.toDateString();
  const isPast = today > eventDate;

  return (
    <View style={styles.container}>
      <Header title="Event Details" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {isPast && (
            <View style={styles.pastBadge}>
              <StyledText style={styles.pastText}>PAST EVENT</StyledText>
            </View>
          )}

          {isToday && !isPast && (
            <View style={styles.todayBadge}>
              <StyledText style={styles.todayText}>TODAY</StyledText>
            </View>
          )}

          {event.special && (
            <View style={styles.specialBadge}>
              <Ionicons name="star" size={14} color="#FFFFFF" />
              <StyledText style={styles.specialText}>FEATURED</StyledText>
            </View>
          )}
        </View>

        {/* Event Title and Time */}
        <View style={styles.titleSection}>
          <StyledText type="heading2" style={styles.eventTitle}>
            {event.title}
          </StyledText>

          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <StyledText style={styles.metaText}>{event.date}</StyledText>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <StyledText style={styles.metaText}>{event.time}</StyledText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSetReminder}
          >
            <View style={[styles.actionIcon, reminderSet && styles.activeActionIcon]}>
              <Ionicons
                name={reminderSet ? "notifications" : "notifications-outline"}
                size={22}
                color={reminderSet ? "#FFFFFF" : COLORS.text}
              />
            </View>
            <StyledText
              style={[styles.actionText, reminderSet && styles.activeActionText]}
            >
              {reminderSet ? "Reminder Set" : "Set Reminder"}
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddToCalendar}
            disabled={addedToCalendar}
          >
            <View style={[styles.actionIcon, addedToCalendar && styles.activeActionIcon]}>
              <Ionicons
                name={addedToCalendar ? "calendar" : "calendar-outline"}
                size={22}
                color={addedToCalendar ? "#FFFFFF" : COLORS.text}
              />
            </View>
            <StyledText
              style={[styles.actionText, addedToCalendar && styles.activeActionText]}
            >
              {addedToCalendar ? "Added" : "Add to Calendar"}
            </StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="share-outline" size={22} color={COLORS.text} />
            </View>
            <StyledText style={styles.actionText}>Share</StyledText>
          </TouchableOpacity>
        </View>

        {/* Event Location */}
        <Card style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitle}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <StyledText type="subheading" style={styles.locationName}>
                {event.location}
              </StyledText>
            </View>

            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={handleViewLocation}
            >
              <Ionicons name="map" size={20} color={COLORS.primary} />
              <StyledText style={styles.viewMapText}>View Map</StyledText>
            </TouchableOpacity>
          </View>

          <StyledText style={styles.locationDetails}>
            {event.locationDetails}
          </StyledText>

          {event.locationMapImageUrl && (
            <TouchableOpacity
              style={styles.mapPreviewContainer}
              onPress={handleViewLocation}
            >
              <Image
                source={{ uri: event.locationMapImageUrl }}
                style={styles.mapPreviewImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                <StyledText style={styles.mapOverlayText}>
                  Tap to view full map
                </StyledText>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {/* Event Description */}
        <Card style={styles.sectionCard}>
          <StyledText type="subheading" style={styles.sectionTitle}>
            Description
          </StyledText>
          <StyledText style={styles.descriptionText}>
            {event.description}
          </StyledText>
        </Card>

        {/* Event Details */}
        <Card style={styles.sectionCard}>
          <StyledText type="subheading" style={styles.sectionTitle}>
            Details
          </StyledText>

          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={20} color={COLORS.text_secondary} />
            <StyledText style={styles.detailLabel}>Organizer:</StyledText>
            <StyledText style={styles.detailText}>{event.organizer}</StyledText>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="pricetag-outline" size={20} color={COLORS.text_secondary} />
            <StyledText style={styles.detailLabel}>Category:</StyledText>
            <StyledText style={styles.detailText}>
              {event.category === 'all' ? 'General' : event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </StyledText>
          </View>

          {event.speakers && (
            <View style={styles.speakersSection}>
              <StyledText type="bodyBold" style={styles.speakersTitle}>
                Speakers:
              </StyledText>
              {event.speakers.map((speaker, index) => (
                <View key={index} style={styles.speakerItem}>
                  <Ionicons name="person" size={16} color={COLORS.primary} />
                  <StyledText style={styles.speakerText}>{speaker}</StyledText>
                </View>
              ))}
            </View>
          )}

          {event.materials && (
            <View style={styles.materialsSection}>
              <StyledText type="bodyBold" style={styles.materialsTitle}>
                Materials:
              </StyledText>
              {event.materials.map((material, index) => (
                <View key={index} style={styles.materialItem}>
                  <Ionicons name="document-text" size={16} color={COLORS.primary} />
                  <StyledText style={styles.materialText}>{material}</StyledText>
                </View>
              ))}
            </View>
          )}

          {event.notes && (
            <View style={styles.notesContainer}>
              <StyledText type="bodyBold" style={styles.notesTitle}>
                Important Notes:
              </StyledText>
              <StyledText style={styles.notesText}>{event.notes}</StyledText>
            </View>
          )}
        </Card>

        {/* Related Events - For a real app, this would show related events */}
        <View style={styles.relatedSection}>
          <StyledText type="subheading" style={styles.relatedTitle}>
            Related Events
          </StyledText>
          <StyledText style={styles.relatedDescription}>
            Check out these other events you might be interested in:
          </StyledText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedEventsContainer}
          >
            {Object.values(EVENT_DATA)
              .filter(e => e.id !== event.id && e.category === event.category)
              .slice(0, 3)
              .map(relatedEvent => (
                <TouchableOpacity
                  key={relatedEvent.id}
                  style={styles.relatedEventCard}
                  onPress={() => router.push(`/event-details/${relatedEvent.id}`)}
                >
                  <Image
                    source={{ uri: relatedEvent.image }}
                    style={styles.relatedEventImage}
                    resizeMode="cover"
                  />
                  <View style={styles.relatedEventInfo}>
                    <StyledText type="bodyBold" numberOfLines={1} style={styles.relatedEventTitle}>
                      {relatedEvent.title}
                    </StyledText>
                    <StyledText type="caption" style={styles.relatedEventTime}>
                      {relatedEvent.date}, {relatedEvent.time}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  bannerContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  pastBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.text_tertiary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  todayBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  todayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  titleSection: {
    marginBottom: SPACING.lg,
  },
  eventTitle: {
    marginBottom: SPACING.sm,
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  metaText: {
    marginLeft: 6,
    color: COLORS.text_secondary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.sm,
  },
  activeActionIcon: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.text_secondary,
  },
  activeActionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  locationCard: {
    marginBottom: SPACING.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationName: {
    marginLeft: 8,
  },
  viewMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMapText: {
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  locationDetails: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  mapPreviewContainer: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreviewImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionCard: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    lineHeight: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
  },
  detailText: {
    flex: 1,
  },
  speakersSection: {
    marginTop: SPACING.sm,
  },
  speakersTitle: {
    marginBottom: SPACING.xs,
  },
  speakerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 6,
  },
  speakerText: {
    marginLeft: 8,
  },
  materialsSection: {
    marginTop: SPACING.sm,
  },
  materialsTitle: {
    marginBottom: SPACING.xs,
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 6,
  },
  materialText: {
    marginLeft: 8,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  notesContainer: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.stateActive,
    padding: SPACING.md,
    borderRadius: 8,
  },
  notesTitle: {
    marginBottom: 4,
  },
  notesText: {
    color: COLORS.text_secondary,
  },
  relatedSection: {
    marginBottom: SPACING.lg,
  },
  relatedTitle: {
    marginBottom: SPACING.xs,
  },
  relatedDescription: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  relatedEventsContainer: {
    paddingBottom: SPACING.md,
  },
  relatedEventCard: {
    width: 200,
    marginRight: SPACING.md,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  relatedEventImage: {
    width: '100%',
    height: 100,
  },
  relatedEventInfo: {
    padding: SPACING.sm,
  },
  relatedEventTitle: {
    marginBottom: 4,
  },
  relatedEventTime: {
    color: COLORS.text_secondary,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  notFoundText: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    color: COLORS.text_tertiary,
    textAlign: 'center',
  },
  backButton: {
    minWidth: 120,
  },
});
