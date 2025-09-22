import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  useWindowDimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/Card';
import { StyledText } from '@/components/ui/StyledText';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZES, SHADOWS } from '@/constants/colors';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: '1',
      title: 'Opening Ceremony',
      time: 'Today, 9:00 AM',
      location: 'Main Auditorium',
      icon: 'mic'
    },
    {
      id: '2',
      title: 'Case Study Distribution',
      time: 'Today, 11:00 AM',
      location: 'Conference Hall B',
      icon: 'document-text'
    },
    {
      id: '3',
      title: 'Presentation Skills Workshop',
      time: 'Tomorrow, 10:00 AM',
      location: 'Workshop Room 3',
      icon: 'people'
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Welcome to Provincials 2025!',
      date: 'Sep 22, 2025',
      content: 'Welcome to the DECA Ontario Provincials competition! We\'re excited to have you join us for this amazing event.',
      urgent: true
    },
    {
      id: '2',
      title: 'Case Study Updates',
      date: 'Sep 22, 2025',
      content: 'Case studies for all events will be available through the Resources tab. Make sure to download them before your competition time.',
      urgent: false
    }
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Mock refresh - in a real app, this would fetch updated data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Header Section */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <View style={styles.headerContent}>
            <View>
              <StyledText type="heading2" color="#FFFFFF">
                Welcome to
              </StyledText>
              <StyledText type="heading1" color="#FFFFFF">
                DECA Provincials
              </StyledText>
              <StyledText color="#FFFFFF" style={styles.headerDate}>
                September 22-25, 2025
              </StyledText>
            </View>
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push('/profile')}
              >
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <StyledText type="heading2" color="#FFFFFF">
                      {user?.firstName?.charAt(0) || user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                    </StyledText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/schedule')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFC107' }]}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
              </View>
              <StyledText type="bodyBold" style={styles.actionText}>Schedule</StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/map')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="map" size={24} color="#FFFFFF" />
              </View>
              <StyledText type="bodyBold" style={styles.actionText}>Venue Map</StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/awards')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
                <Ionicons name="trophy" size={24} color="#FFFFFF" />
              </View>
              <StyledText type="bodyBold" style={styles.actionText}>Awards</StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/coupons')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F44336' }]}>
                <Ionicons name="pricetag" size={24} color="#FFFFFF" />
              </View>
              <StyledText type="bodyBold" style={styles.actionText}>Coupons</StyledText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StyledText type="heading3">Upcoming Events</StyledText>
            <TouchableOpacity onPress={() => router.push('/(tabs)/schedule')}>
              <StyledText type="link">View All</StyledText>
            </TouchableOpacity>
          </View>

          {upcomingEvents.map(event => (
            <Card key={event.id} style={styles.eventCard}>
              <View style={styles.eventContent}>
                <View style={styles.eventIconContainer}>
                  <Ionicons name={event.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.eventDetails}>
                  <StyledText type="subheading">{event.title}</StyledText>
                  <StyledText type="caption" style={styles.eventTime}>
                    <Ionicons name="time-outline" size={14} /> {event.time}
                  </StyledText>
                  <StyledText type="caption">
                    <Ionicons name="location-outline" size={14} /> {event.location}
                  </StyledText>
                </View>
                <TouchableOpacity style={styles.eventAction}>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.text_secondary} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>

        {/* Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StyledText type="heading3">Announcements</StyledText>
            <TouchableOpacity onPress={() => router.push('/announcements')}>
              <StyledText type="link">View All</StyledText>
            </TouchableOpacity>
          </View>

          {announcements.map(announcement => (
            <Card key={announcement.id} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleContainer}>
                  {announcement.urgent && (
                    <View style={styles.urgentBadge}>
                      <StyledText style={styles.urgentText}>URGENT</StyledText>
                    </View>
                  )}
                  <StyledText type="subheading">{announcement.title}</StyledText>
                </View>
                <StyledText type="caption">{announcement.date}</StyledText>
              </View>
              <StyledText style={styles.announcementContent}>
                {announcement.content}
              </StyledText>
            </Card>
          ))}
        </View>

        {/* Chat with AI Assistant */}
        <Card style={styles.chatCard}>
          <View style={styles.chatContent}>
            <View style={styles.chatTextContainer}>
              <StyledText type="subheading">Need help?</StyledText>
              <StyledText>Chat with our AI assistant for quick answers to your questions.</StyledText>
            </View>
            <Button
              label="Start Chat"
              variant="primary"
              rightIcon={<Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />}
              onPress={() => router.push('/chatbot')}
            />
          </View>
        </Card>

        {/* Bottom Spacing */}
        <View style={{ height: SPACING.xl + insets.bottom }} />
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
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerDate: {
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  profileSection: {
    alignItems: 'flex-end',
  },
  profileButton: {
    marginTop: SPACING.sm,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  quickActions: {
    marginTop: -30,
    paddingHorizontal: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.sm,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventCard: {
    marginBottom: SPACING.md,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.stateActive,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventTime: {
    marginVertical: 2,
  },
  eventAction: {
    padding: SPACING.xs,
  },
  announcementCard: {
    marginBottom: SPACING.md,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  announcementTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  urgentText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  announcementContent: {
    lineHeight: 20,
  },
  chatCard: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.lg,
  },
  chatContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTextContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
});
