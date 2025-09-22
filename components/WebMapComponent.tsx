import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

interface WebMapComponentProps {
  locations: Array<{
    id: string;
    name: string;
    address: string;
    description: string;
    coordinate: { latitude: number; longitude: number };
    icon: string;
  }>;
}

export const WebMapComponent: React.FC<WebMapComponentProps> = ({ locations }) => {
  const insets = useSafeAreaInsets();

  const openInMaps = async (location: any) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.coordinate.latitude},${location.coordinate.longitude}`;

    if (Platform.OS === 'web') {
      // For web, use Linking API which handles window.open safely
      await Linking.openURL(googleMapsUrl);
    } else {
      // For native platforms, use Linking API
      await Linking.openURL(googleMapsUrl);
    }
  };

  const openDirections = async (location: any) => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinate.latitude},${location.coordinate.longitude}`;

    if (Platform.OS === 'web') {
      // For web, use Linking API which handles window.open safely
      await Linking.openURL(directionsUrl);
    } else {
      // For native platforms, use Linking API
      await Linking.openURL(directionsUrl);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + SPACING.xl }
      ]}
    >
      <View style={styles.webMapPlaceholder}>
        <Ionicons name="map" size={80} color={COLORS.primary} />
        <StyledText type="heading3" style={styles.mapTitle}>
          Venue Locations
        </StyledText>
        <StyledText style={styles.mapDescription}>
          Interactive maps are not available in the web version.
          Use the location cards below to get directions.
        </StyledText>
      </View>

      <View style={styles.locationsContainer}>
        <StyledText type="heading3" style={styles.sectionTitle}>
          Event Venues
        </StyledText>

        {locations.map((location) => (
          <Card key={location.id} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconContainer}>
                <Ionicons name={location.icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.locationInfo}>
                <StyledText type="subheading">{location.name}</StyledText>
                <StyledText type="caption" style={styles.locationAddress}>
                  {location.address}
                </StyledText>
              </View>
            </View>

            <StyledText style={styles.locationDescription}>
              {location.description}
            </StyledText>

            <View style={styles.locationActions}>
              <Button
                label="View on Map"
                variant="primary"
                size="small"
                style={styles.actionButton}
                leftIcon={<Ionicons name="map" size={16} color="#FFFFFF" />}
                onPress={() => openInMaps(location)}
              />
              <Button
                label="Get Directions"
                variant="outline"
                size="small"
                style={styles.actionButton}
                leftIcon={<Ionicons name="navigate" size={16} color={COLORS.primary} />}
                onPress={() => openDirections(location)}
              />
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.infoCard}>
        <StyledText type="subheading" style={styles.infoTitle}>
          Venue Information
        </StyledText>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
          <View>
            <StyledText type="bodyBold">Opening Hours</StyledText>
            <StyledText>Daily from 8:00 AM to 9:00 PM</StyledText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
          <View>
            <StyledText type="bodyBold">Food & Dining</StyledText>
            <StyledText>Food court on Level 1, Cafés on all floors</StyledText>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="wifi-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
          <View>
            <StyledText type="bodyBold">Wi-Fi Access</StyledText>
            <StyledText>Network: DECA_Event | Password: Provincial2025</StyledText>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  webMapPlaceholder: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  mapTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  mapDescription: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    lineHeight: 22,
  },
  locationsContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  locationCard: {
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  locationIconContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
    marginRight: SPACING.sm,
  },
  locationInfo: {
    flex: 1,
  },
  locationAddress: {
    color: COLORS.text_secondary,
    marginTop: 2,
  },
  locationDescription: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  locationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  infoCard: {
    ...SHADOWS.sm,
  },
  infoTitle: {
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  infoIcon: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
});
