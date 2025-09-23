import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeableScreen } from '@/components/SwipeableScreen';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { Card } from '@/components/ui/Card';
import { StyledText } from '@/components/ui/StyledText';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZES, SHADOWS, BORDER_RADIUS, GRADIENTS, LAYOUT } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Professional pulse animation
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: '1',
      title: 'Opening Ceremony',
      time: 'Today, 9:00 AM',
      location: 'Main Auditorium',
      icon: 'mic',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Case Study Distribution',
      time: 'Today, 11:00 AM',
      location: 'Conference Hall B',
      icon: 'document-text',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Presentation Skills Workshop',
      time: 'Tomorrow, 10:00 AM',
      location: 'Workshop Room 3',
      icon: 'people',
      priority: 'low',
    }
  ]);

  const quickActions = [
    {
      id: '1',
      title: 'QR Scanner',
      icon: 'qr-code-outline',
      route: 'modal',
      color: COLORS.primary,
    },
    {
      id: '2',
      title: 'Schedule',
      icon: 'calendar-outline',
      route: 'schedule',
      color: COLORS.secondary,
    },
    {
      id: '3',
      title: 'Networking',
      icon: 'people-outline',
      route: 'networking',
      color: COLORS.accent,
    },
    {
      id: '4',
      title: 'Resources',
      icon: 'document-outline',
      route: 'resources',
      color: COLORS.info,
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSwipeLeft = () => {
    router.push('/schedule');
  };

  const handleSwipeRight = () => {
    router.push('/more');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      default: return COLORS.accent;
    }
  };

  const renderQuickAction = (action: any, index: number) => (
    <Animated.View
      key={action.id}
      entering={SlideInRight.delay(index * 80).duration(400)}
      style={styles.quickActionWrapper}
    >
      <TouchableOpacity
        style={styles.quickActionItem}
        onPress={() => router.push(action.route)}
        activeOpacity={0.8}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
          <Ionicons name={action.icon as any} size={24} color={COLORS.text_on_primary} />
        </View>
        <Text style={styles.quickActionText}>{action.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEventCard = (event: any, index: number) => (
    <Animated.View
      key={event.id}
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.eventCardWrapper}
    >
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => router.push(`/event-details/${event.id}`)}
        activeOpacity={0.95}
      >
        <View style={styles.eventContent}>
          <View style={styles.eventIconContainer}>
            <Ionicons name={event.icon as any} size={20} color={COLORS.primary} />
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(event.priority) }]} />
            </View>
            <Text style={styles.eventTime}>{event.time}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={COLORS.text_tertiary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SwipeableScreen
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      backgroundColor={COLORS.background_secondary}
    >
      <View style={styles.container}>
        <AnimatedHeader
          title="Welcome Back"
          subtitle={user?.firstName ? `Hi ${user.firstName}` : 'DECA Ontario'}
          rightComponent={
            <Animated.View style={animatedPulseStyle}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => router.push('/networking')}
              >
                <Ionicons name="notifications-outline" size={22} color={COLORS.text_on_primary} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: LAYOUT.tab_bar_height + insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Quick Actions */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => renderQuickAction(action, index))}
            </View>
          </Animated.View>

          {/* Upcoming Events */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => router.push('/schedule')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.eventsContainer}>
              {upcomingEvents.map((event, index) => renderEventCard(event, index))}
            </View>
          </Animated.View>

          {/* Professional Stats Section */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500)}
            style={styles.section}
          >
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Conference Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>250+</Text>
                  <Text style={styles.statLabel}>Participants</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>15</Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Workshops</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.section_gap,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.screen_horizontal,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.screen_horizontal,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.screen_horizontal,
    gap: SPACING.md,
  },
  quickActionWrapper: {
    width: (width - (SPACING.screen_horizontal * 2) - SPACING.md) / 2,
  },
  quickActionItem: {
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text_secondary,
    textAlign: 'center',
  },
  eventsContainer: {
    paddingHorizontal: SPACING.screen_horizontal,
  },
  eventCardWrapper: {
    marginBottom: SPACING.md,
  },
  eventCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border_light,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.stateActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.xs,
  },
  eventTime: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text_tertiary,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.screen_horizontal,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border_light,
  },
  statsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  statNumber: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text_secondary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text_on_primary,
  },
});
