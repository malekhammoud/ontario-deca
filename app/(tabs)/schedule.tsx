import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/colors';

// Schedule categories
const SCHEDULE_CATEGORIES = [
  { id: 'all', name: 'All Events' },
  { id: 'business', name: 'Business Management' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'finance', name: 'Finance' },
  { id: 'hospitality', name: 'Hospitality' },
];

// Sample schedule data structured for SectionList
const SCHEDULE_DATA = [
  {
    title: 'Day 1 - September 22, 2025',
    data: [
      {
        id: '1',
        title: 'Registration & Check-in',
        time: '8:00 AM - 10:00 AM',
        location: 'Main Entrance',
        category: 'all',
      },
      {
        id: '2',
        title: 'Opening Ceremony',
        time: '10:30 AM - 12:00 PM',
        location: 'Grand Ballroom',
        category: 'all',
      },
      {
        id: '3',
        title: 'Lunch Break',
        time: '12:00 PM - 1:30 PM',
        location: 'Food Court',
        category: 'all',
      },
      {
        id: '4',
        title: 'Business Management Workshop',
        time: '2:00 PM - 3:30 PM',
        location: 'Conference Room A',
        category: 'business',
      },
      {
        id: '5',
        title: 'Marketing Case Studies Distribution',
        time: '3:45 PM - 4:30 PM',
        location: 'Conference Room B',
        category: 'marketing',
      },
    ],
  },
  {
    title: 'Day 2 - September 23, 2025',
    data: [
      {
        id: '6',
        title: 'Finance Competition Briefing',
        time: '9:00 AM - 10:00 AM',
        location: 'Auditorium',
        category: 'finance',
      },
      {
        id: '7',
        title: 'Hospitality Case Presentations',
        time: '10:30 AM - 12:30 PM',
        location: 'Meeting Rooms 1-5',
        category: 'hospitality',
      },
      {
        id: '8',
        title: 'Lunch Break',
        time: '12:30 PM - 2:00 PM',
        location: 'Food Court',
        category: 'all',
      },
      {
        id: '9',
        title: 'Networking Session',
        time: '2:30 PM - 4:00 PM',
        location: 'Exhibition Hall',
        category: 'all',
      },
    ],
  },
  {
    title: 'Day 3 - September 24, 2025',
    data: [
      {
        id: '10',
        title: 'Marketing Presentations',
        time: '9:00 AM - 12:00 PM',
        location: 'Conference Rooms C-F',
        category: 'marketing',
      },
      {
        id: '11',
        title: 'Lunch Break',
        time: '12:00 PM - 1:30 PM',
        location: 'Food Court',
        category: 'all',
      },
      {
        id: '12',
        title: 'Business Management Finals',
        time: '2:00 PM - 4:00 PM',
        location: 'Main Auditorium',
        category: 'business',
      },
    ],
  },
  {
    title: 'Day 4 - September 25, 2025',
    data: [
      {
        id: '13',
        title: 'Finance Finals',
        time: '9:00 AM - 11:00 AM',
        location: 'Grand Ballroom',
        category: 'finance',
      },
      {
        id: '14',
        title: 'Hospitality Finals',
        time: '11:30 AM - 1:30 PM',
        location: 'Grand Ballroom',
        category: 'hospitality',
      },
      {
        id: '15',
        title: 'Lunch Break',
        time: '1:30 PM - 3:00 PM',
        location: 'Food Court',
        category: 'all',
      },
      {
        id: '16',
        title: 'Awards Ceremony',
        time: '4:00 PM - 6:00 PM',
        location: 'Main Auditorium',
        category: 'all',
      },
      {
        id: '17',
        title: 'Closing Reception',
        time: '6:30 PM - 8:30 PM',
        location: 'Exhibition Hall',
        category: 'all',
      },
    ],
  },
];

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredData = SCHEDULE_DATA.map(section => ({
    title: section.title,
    data: section.data.filter(
      item => selectedCategory === 'all' || item.category === selectedCategory || item.category === 'all'
    ),
  })).filter(section => section.data.length > 0);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate an API call that would update the schedule data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header title="Schedule" showBackButton={false} />

      {/* Categories filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {SCHEDULE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <StyledText
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </StyledText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Schedule list */}
      <SectionList
        sections={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <StyledText type="subheading" style={styles.sectionHeaderText}>
              {title}
            </StyledText>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => router.push(`/event-details/${item.id}`)}
          >
            <View style={styles.timeContainer}>
              <StyledText type="bodyBold" style={styles.timeText}>
                {item.time.split(' - ')[0]}
              </StyledText>
              <View style={styles.timeLine} />
            </View>

            <Card style={styles.eventCard}>
              <View style={styles.eventContent}>
                <View>
                  <StyledText type="subheading" style={styles.eventTitle}>
                    {item.title}
                  </StyledText>
                  <View style={styles.eventDetail}>
                    <Ionicons name="time-outline" size={16} color={COLORS.text_secondary} />
                    <StyledText type="caption" style={styles.eventDetailText}>
                      {item.time}
                    </StyledText>
                  </View>
                  <View style={styles.eventDetail}>
                    <Ionicons name="location-outline" size={16} color={COLORS.text_secondary} />
                    <StyledText type="caption" style={styles.eventDetailText}>
                      {item.location}
                    </StyledText>
                  </View>
                </View>
                <View style={styles.eventAction}>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.text_secondary} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={COLORS.text_tertiary} />
            <StyledText type="subheading" style={styles.emptyText}>
              No events found for this category
            </StyledText>
          </View>
        }
        ListFooterComponent={
          <View style={{ height: insets.bottom + SPACING.xl }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 50,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text_secondary,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: SPACING.md,
  },
  sectionHeaderText: {
    color: COLORS.primary,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timeContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  timeText: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  timeLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
  },
  eventCard: {
    flex: 1,
  },
  eventContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTitle: {
    marginBottom: SPACING.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventDetailText: {
    marginLeft: 6,
  },
  eventAction: {
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    color: COLORS.text_tertiary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});
