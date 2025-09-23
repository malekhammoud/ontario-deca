import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
  RefreshControl,
  Text,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeableScreen } from '@/components/SwipeableScreen';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, FONT_SIZES, SHADOWS, BORDER_RADIUS, LAYOUT } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Professional schedule categories
const SCHEDULE_CATEGORIES = [
  { id: 'all', name: 'All Events', icon: 'calendar', color: COLORS.primary },
  { id: 'business', name: 'Business', icon: 'briefcase', color: COLORS.secondary },
  { id: 'marketing', name: 'Marketing', icon: 'megaphone', color: COLORS.accent },
  { id: 'finance', name: 'Finance', icon: 'card', color: COLORS.info },
  { id: 'hospitality', name: 'Hospitality', icon: 'restaurant', color: COLORS.warning },
];

// Professional schedule data
const SCHEDULE_DATA = [
  {
    title: 'Day 1 - September 23, 2025',
    data: [
      {
        id: '1',
        title: 'Registration & Check-in',
        time: '8:00 AM - 10:00 AM',
        location: 'Main Entrance',
        category: 'all',
        icon: 'clipboard',
        status: 'ongoing',
        description: 'Welcome to DECA Ontario Conference',
      },
      {
        id: '2',
        title: 'Opening Ceremony',
        time: '10:30 AM - 12:00 PM',
        location: 'Grand Ballroom',
        category: 'all',
        icon: 'mic',
        status: 'upcoming',
        description: 'Keynote speakers and conference overview',
      },
      {
        id: '3',
        title: 'Business Management Workshop',
        time: '1:30 PM - 3:00 PM',
        location: 'Conference Room A',
        category: 'business',
        icon: 'briefcase',
        status: 'upcoming',
        description: 'Strategic planning and leadership skills',
      },
      {
        id: '4',
        title: 'Marketing Case Study',
        time: '3:30 PM - 5:00 PM',
        location: 'Conference Room B',
        category: 'marketing',
        icon: 'megaphone',
        status: 'upcoming',
        description: 'Real-world marketing challenges',
      },
    ],
  },
  {
    title: 'Day 2 - September 24, 2025',
    data: [
      {
        id: '5',
        title: 'Finance Competition',
        time: '9:00 AM - 11:00 AM',
        location: 'Main Hall',
        category: 'finance',
        icon: 'card',
        status: 'upcoming',
        description: 'Investment and financial analysis',
      },
      {
        id: '6',
        title: 'Hospitality Service Challenge',
        time: '11:30 AM - 1:00 PM',
        location: 'Practice Restaurant',
        category: 'hospitality',
        icon: 'restaurant',
        status: 'upcoming',
        description: 'Customer service excellence',
      },
      {
        id: '7',
        title: 'Awards Ceremony',
        time: '7:00 PM - 9:00 PM',
        location: 'Grand Ballroom',
        category: 'all',
        icon: 'trophy',
        status: 'upcoming',
        description: 'Celebrating achievements and winners',
      },
    ],
  },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredSchedule = SCHEDULE_DATA.map(section => ({
    ...section,
    data: section.data.filter(item =>
      selectedCategory === 'all' || item.category === selectedCategory
    ),
  })).filter(section => section.data.length > 0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSwipeLeft = () => {
    router.push('/map');
  };

  const handleSwipeRight = () => {
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return COLORS.success;
      case 'completed': return COLORS.text_light;
      default: return COLORS.primary;
    }
  };

  const renderCategoryFilter = () => (
    <Animated.View
      entering={FadeInRight.delay(150).duration(400)}
      style={styles.categoriesContainer}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {SCHEDULE_CATEGORIES.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Animated.View
              key={category.id}
              entering={SlideInLeft.delay(index * 60).duration(300)}
            >
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  isSelected && [styles.selectedCategory, { backgroundColor: category.color }]
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={category.icon as any}
                  size={18}
                  color={isSelected ? COLORS.text_on_primary : COLORS.text_secondary}
                />
                <Text style={[
                  styles.categoryText,
                  { color: isSelected ? COLORS.text_on_primary : COLORS.text_secondary }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );

  const renderSectionHeader = ({ section }: any) => (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={styles.sectionHeader}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </Animated.View>
  );

  const renderEventItem = ({ item, index }: any) => (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400)}
      style={styles.eventWrapper}
    >
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => router.push(`/event-details/${item.id}`)}
        activeOpacity={0.95}
      >
        <View style={styles.eventContent}>
          <View style={styles.eventIconContainer}>
            <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
          </View>

          <View style={styles.eventDetails}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            </View>
            <Text style={styles.eventDescription}>{item.description}</Text>

            <View style={styles.eventMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={COLORS.text_tertiary} />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color={COLORS.text_tertiary} />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            </View>
          </View>

          <View style={styles.eventActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                // Add to favorites logic
              }}
            >
              <Ionicons name="heart-outline" size={18} color={COLORS.text_tertiary} />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text_tertiary} />
          </View>
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
          title="Schedule"
          subtitle="DECA Ontario 2025"
          rightComponent={
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/awards')}
            >
              <Ionicons name="trophy-outline" size={22} color={COLORS.text_on_primary} />
            </TouchableOpacity>
          }
        />

        {renderCategoryFilter()}

        <SectionList
          sections={filteredSchedule}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[styles.listContainer, { paddingBottom: LAYOUT.tab_bar_height + insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickySectionHeadersEnabled={false}
        />
      </View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background_secondary,
  },
  categoriesContainer: {
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.screen_horizontal,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border_light,
    ...SHADOWS.small,
  },
  selectedCategory: {
    borderColor: 'transparent',
    ...SHADOWS.medium,
  },
  categoryText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  listContainer: {
    paddingTop: SPACING.sm,
  },
  sectionHeader: {
    marginHorizontal: SPACING.screen_horizontal,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  eventWrapper: {
    marginHorizontal: SPACING.screen_horizontal,
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
    alignItems: 'flex-start',
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: SPACING.xs,
  },
  eventDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text_secondary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  eventMeta: {
    gap: SPACING.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text_tertiary,
  },
  eventActions: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  favoriteButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
