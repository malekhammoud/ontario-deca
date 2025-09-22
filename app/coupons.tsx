import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Sample coupon data
const COUPONS_DATA = [
  {
    id: '1',
    title: '20% Off Business Attire',
    sponsor: 'Brooks Brothers',
    description: 'Get 20% off your purchase of business attire. Perfect for your competition outfit!',
    validUntil: 'September 30, 2025',
    code: 'DECA20',
    logo: 'https://via.placeholder.com/100',
    used: false,
    favorite: false,
  },
  {
    id: '2',
    title: 'Free Coffee Upgrade',
    sponsor: 'Starbucks',
    description: 'Upgrade any coffee to the next size for free.',
    validUntil: 'September 25, 2025',
    code: 'DECACOFFEE',
    logo: 'https://via.placeholder.com/100',
    used: false,
    favorite: true,
  },
  {
    id: '3',
    title: '15% Off School Supplies',
    sponsor: 'Staples',
    description: 'Save on notebooks, pens, and other supplies for your DECA journey.',
    validUntil: 'October 15, 2025',
    code: 'DECASTUDY15',
    logo: 'https://via.placeholder.com/100',
    used: false,
    favorite: false,
  },
  {
    id: '4',
    title: 'Buy One Get One Free',
    sponsor: 'Pizza Pizza',
    description: 'Buy any medium or large pizza and get one free of equal or lesser value.',
    validUntil: 'September 25, 2025',
    code: 'DECAPIZZA',
    logo: 'https://via.placeholder.com/100',
    used: false,
    favorite: false,
  },
  {
    id: '5',
    title: '$5 Off Transportation',
    sponsor: 'Uber',
    description: 'Get $5 off your next ride to or from the venue.',
    validUntil: 'September 25, 2025',
    code: 'DECARIDE5',
    logo: 'https://via.placeholder.com/100',
    used: true,
    favorite: true,
  },
];

// Filter options
const FILTER_OPTIONS = [
  { id: 'all', label: 'All Coupons' },
  { id: 'active', label: 'Active' },
  { id: 'used', label: 'Used' },
  { id: 'favorite', label: 'Favorites' },
];

export default function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const [coupons, setCoupons] = useState(COUPONS_DATA);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter coupons based on selected filter
  const filteredCoupons = coupons.filter(coupon => {
    switch (selectedFilter) {
      case 'active':
        return !coupon.used;
      case 'used':
        return coupon.used;
      case 'favorite':
        return coupon.favorite;
      default:
        return true;
    }
  });

  // Toggle coupon used status
  const toggleUsed = (id) => {
    setCoupons(prevCoupons =>
      prevCoupons.map(coupon =>
        coupon.id === id ? { ...coupon, used: !coupon.used } : coupon
      )
    );
  };

  // Toggle coupon favorite status
  const toggleFavorite = (id) => {
    setCoupons(prevCoupons =>
      prevCoupons.map(coupon =>
        coupon.id === id ? { ...coupon, favorite: !coupon.favorite } : coupon
      )
    );
  };

  // Share coupon
  const shareCoupon = async (coupon) => {
    try {
      await Share.share({
        message: `Check out this coupon from ${coupon.sponsor} at DECA Provincials!\n\n${coupon.title}\n${coupon.description}\n\nUse code: ${coupon.code}\nValid until: ${coupon.validUntil}`,
        title: `DECA Coupon: ${coupon.title}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the coupon');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Coupons & Offers" />

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                selectedFilter === option.id && styles.selectedFilter
              ]}
              onPress={() => setSelectedFilter(option.id)}
            >
              <StyledText
                style={[
                  styles.filterLabel,
                  selectedFilter === option.id && styles.selectedFilterLabel
                ]}
              >
                {option.label}
              </StyledText>
              {option.id === 'favorite' && (
                <View style={styles.filterBadge}>
                  <StyledText style={styles.filterBadgeText}>
                    {coupons.filter(c => c.favorite).length}
                  </StyledText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Coupons list */}
      <FlatList
        data={filteredCoupons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + SPACING.xl }
        ]}
        renderItem={({ item }) => (
          <Card style={[
            styles.couponCard,
            item.used && styles.usedCouponCard
          ]}>
            {item.used && (
              <View style={styles.usedOverlay}>
                <StyledText style={styles.usedText}>USED</StyledText>
              </View>
            )}

            <View style={styles.couponHeader}>
              <View style={styles.couponLogoContainer}>
                <Image
                  source={{ uri: item.logo }}
                  style={styles.couponLogo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.couponTitleContainer}>
                <StyledText type="subheading" style={styles.couponTitle}>
                  {item.title}
                </StyledText>
                <StyledText type="caption" style={styles.couponSponsor}>
                  by {item.sponsor}
                </StyledText>
              </View>

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={item.favorite ? "heart" : "heart-outline"}
                  size={24}
                  color={item.favorite ? COLORS.error : COLORS.text_secondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.couponBody}>
              <StyledText style={styles.couponDescription}>
                {item.description}
              </StyledText>

              <View style={styles.couponCode}>
                <StyledText type="caption" style={styles.codeLabel}>
                  Coupon Code:
                </StyledText>
                <StyledText type="bodyBold" style={styles.code}>
                  {item.code}
                </StyledText>
              </View>

              <View style={styles.couponValidity}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.text_secondary} />
                <StyledText type="caption" style={styles.validityText}>
                  Valid until {item.validUntil}
                </StyledText>
              </View>
            </View>

            <View style={styles.couponActions}>
              <Button
                label={item.used ? "Mark as Unused" : "Mark as Used"}
                variant="outline"
                size="small"
                style={styles.actionButton}
                leftIcon={
                  <Ionicons
                    name={item.used ? "refresh" : "checkmark"}
                    size={16}
                    color={COLORS.primary}
                  />
                }
                onPress={() => toggleUsed(item.id)}
              />

              <Button
                label="Share"
                variant="outline"
                size="small"
                style={styles.actionButton}
                leftIcon={<Ionicons name="share-outline" size={16} color={COLORS.primary} />}
                onPress={() => shareCoupon(item)}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pricetag-outline" size={60} color={COLORS.text_tertiary} />
            <StyledText type="subheading" style={styles.emptyText}>
              No coupons found
            </StyledText>
            <StyledText style={styles.emptyDescription}>
              {selectedFilter === 'favorite'
                ? "You haven't saved any coupons as favorites yet."
                : selectedFilter === 'used'
                ? "You haven't used any coupons yet."
                : "There are no coupons available at the moment."}
            </StyledText>
          </View>
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
  filterContainer: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 50,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: 14,
    color: COLORS.text_secondary,
  },
  selectedFilterLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  filterBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  listContent: {
    padding: SPACING.lg,
  },
  couponCard: {
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
    overflow: 'hidden',
  },
  usedCouponCard: {
    opacity: 0.7,
  },
  usedOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderBottomLeftRadius: 12,
    zIndex: 1,
  },
  usedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  couponLogoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  couponLogo: {
    width: 40,
    height: 40,
  },
  couponTitleContainer: {
    flex: 1,
  },
  couponTitle: {
    marginBottom: 2,
  },
  couponSponsor: {
    color: COLORS.text_secondary,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  couponBody: {
    paddingVertical: SPACING.md,
  },
  couponDescription: {
    marginBottom: SPACING.md,
  },
  couponCode: {
    backgroundColor: COLORS.stateActive,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  codeLabel: {
    color: COLORS.text_secondary,
    marginBottom: 4,
  },
  code: {
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.primary,
  },
  couponValidity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    marginLeft: SPACING.xs,
    color: COLORS.text_secondary,
  },
  couponActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  actionButton: {
    marginRight: SPACING.md,
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
  emptyDescription: {
    color: COLORS.text_tertiary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
