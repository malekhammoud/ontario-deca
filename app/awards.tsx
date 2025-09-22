import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Sample awards data by category
const AWARDS_DATA = [
  {
    title: 'Business Management Events',
    data: [
      {
        id: '1',
        title: 'Principles of Business Management',
        time: '4:00 PM - 4:15 PM',
        location: 'Main Auditorium',
        participants: 32,
      },
      {
        id: '2',
        title: 'Business Administration Core',
        time: '4:15 PM - 4:30 PM',
        location: 'Main Auditorium',
        participants: 28,
      },
      {
        id: '3',
        title: 'Entrepreneurship',
        time: '4:30 PM - 4:45 PM',
        location: 'Main Auditorium',
        participants: 40,
      },
    ],
  },
  {
    title: 'Marketing Events',
    data: [
      {
        id: '4',
        title: 'Marketing Communications',
        time: '4:45 PM - 5:00 PM',
        location: 'Main Auditorium',
        participants: 35,
      },
      {
        id: '5',
        title: 'Professional Selling',
        time: '5:00 PM - 5:15 PM',
        location: 'Main Auditorium',
        participants: 30,
      },
      {
        id: '6',
        title: 'Retail Merchandising',
        time: '5:15 PM - 5:30 PM',
        location: 'Main Auditorium',
        participants: 25,
      },
    ],
  },
  {
    title: 'Finance Events',
    data: [
      {
        id: '7',
        title: 'Accounting Applications',
        time: '5:30 PM - 5:45 PM',
        location: 'Main Auditorium',
        participants: 38,
      },
      {
        id: '8',
        title: 'Financial Services',
        time: '5:45 PM - 6:00 PM',
        location: 'Main Auditorium',
        participants: 42,
      },
    ],
  },
  {
    title: 'Hospitality & Tourism Events',
    data: [
      {
        id: '9',
        title: 'Hotel & Lodging Management',
        time: '6:00 PM - 6:15 PM',
        location: 'Main Auditorium',
        participants: 30,
      },
      {
        id: '10',
        title: 'Restaurant & Food Service Management',
        time: '6:15 PM - 6:30 PM',
        location: 'Main Auditorium',
        participants: 32,
      },
      {
        id: '11',
        title: 'Travel & Tourism Management',
        time: '6:30 PM - 6:45 PM',
        location: 'Main Auditorium',
        participants: 36,
      },
    ],
  },
  {
    title: 'Special Awards',
    data: [
      {
        id: '12',
        title: 'Chapter of the Year',
        time: '6:45 PM - 7:00 PM',
        location: 'Main Auditorium',
        participants: 20,
        special: true,
      },
      {
        id: '13',
        title: 'Advisor of the Year',
        time: '7:00 PM - 7:15 PM',
        location: 'Main Auditorium',
        participants: 15,
        special: true,
      },
      {
        id: '14',
        title: 'Provincials Overall Champions',
        time: '7:15 PM - 7:30 PM',
        location: 'Main Auditorium',
        participants: 10,
        special: true,
      },
    ],
  },
];

export default function AwardsScreen() {
  const insets = useSafeAreaInsets();
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle the expanded state of an item
  const toggleExpanded = (id) => {
    setExpandedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="Awards Ceremony" />

      <SectionList
        sections={AWARDS_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + SPACING.xl }
        ]}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <StyledText type="subheading" style={styles.sectionTitle}>
              {title}
            </StyledText>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Card style={styles.infoCard}>
              <View style={styles.infoCardContent}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="trophy" size={30} color="#FFFFFF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <StyledText type="subheading">Awards Ceremony</StyledText>
                  <StyledText>September 25, 2025</StyledText>
                  <StyledText>4:00 PM - 7:30 PM</StyledText>
                  <StyledText>Main Auditorium</StyledText>
                </View>
              </View>
              <View style={styles.infoNote}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <StyledText style={styles.noteText}>
                  Please arrive 15 minutes before your category is scheduled to be on standby.
                </StyledText>
              </View>
            </Card>

            <StyledText type="heading3" style={styles.scheduleTitle}>
              Awards Schedule
            </StyledText>

            <StyledText style={styles.scheduleDescription}>
              The awards will be presented in the order shown below. Tap on an award to see more details.
            </StyledText>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={[
            styles.awardCard,
            expandedItems[item.id] && styles.expandedCard,
            item.special && styles.specialAwardCard
          ]}>
            <TouchableOpacity
              style={styles.awardHeader}
              onPress={() => toggleExpanded(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.awardTitleContainer}>
                <View style={[
                  styles.awardColorIndicator,
                  item.special && styles.specialIndicator
                ]} />
                <View>
                  <StyledText type="bodyBold" style={styles.awardTitle}>
                    {item.title}
                  </StyledText>
                  <StyledText type="caption" style={styles.awardTime}>
                    {item.time}
                  </StyledText>
                </View>
              </View>

              <Ionicons
                name={expandedItems[item.id] ? "chevron-up" : "chevron-down"}
                size={20}
                color={COLORS.text_secondary}
              />
            </TouchableOpacity>

            {expandedItems[item.id] && (
              <View style={styles.awardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color={COLORS.text_secondary} />
                  <StyledText style={styles.detailText}>
                    {item.location}
                  </StyledText>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color={COLORS.text_secondary} />
                  <StyledText style={styles.detailText}>
                    {item.participants} Participants
                  </StyledText>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="medal-outline" size={16} color={COLORS.text_secondary} />
                  <StyledText style={styles.detailText}>
                    Recognizing top 3 finalists
                  </StyledText>
                </View>

                {item.special && (
                  <View style={styles.specialNote}>
                    <Ionicons name="star" size={16} color={COLORS.primary} />
                    <StyledText style={styles.specialNoteText}>
                      Special recognition award
                    </StyledText>
                  </View>
                )}
              </View>
            )}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  infoCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    ...SHADOWS.md,
  },
  infoCardContent: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  infoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: COLORS.stateActive,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  noteText: {
    marginLeft: SPACING.sm,
    flex: 1,
    color: COLORS.primary,
  },
  scheduleTitle: {
    marginBottom: SPACING.sm,
  },
  scheduleDescription: {
    color: COLORS.text_secondary,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.primary,
  },
  awardCard: {
    marginBottom: SPACING.md,
  },
  expandedCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  specialAwardCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#FFC107',
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  awardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  awardColorIndicator: {
    width: 4,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  specialIndicator: {
    backgroundColor: '#FFC107',
  },
  awardTitle: {
    marginBottom: 2,
  },
  awardTime: {
    color: COLORS.text_secondary,
  },
  awardDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailText: {
    marginLeft: SPACING.sm,
    color: COLORS.text_secondary,
  },
  specialNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.stateActive,
    padding: SPACING.sm,
    borderRadius: 4,
    marginTop: SPACING.xs,
  },
  specialNoteText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
