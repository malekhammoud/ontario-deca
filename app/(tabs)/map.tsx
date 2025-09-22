import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/Header';
import { WebMapComponent } from '@/components/WebMapComponent';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Conditionally import MapView only for native platforms
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    const mapModule = require('react-native-maps');
    MapView = mapModule.default;
    Marker = mapModule.Marker;
    PROVIDER_GOOGLE = mapModule.PROVIDER_GOOGLE;
  } catch (error) {
    console.log('Maps module not available');
  }
}

const { width } = Dimensions.get('window');

// Example venue locations
const VENUE_LOCATIONS = [
  {
    id: '1',
    name: 'Main Convention Center',
    address: '123 Convention Way, Toronto, ON',
    description: 'Primary venue for competitions and ceremonies',
    coordinate: { latitude: 43.6532, longitude: -79.3832 },
    icon: 'business',
  },
  {
    id: '2',
    name: 'Workshop Building',
    address: '456 Event Street, Toronto, ON',
    description: 'Location for all workshops and training sessions',
    coordinate: { latitude: 43.6555, longitude: -79.3850 },
    icon: 'school',
  },
  {
    id: '3',
    name: 'Exhibition Hall',
    address: '789 Expo Avenue, Toronto, ON',
    description: 'Networking events and exhibitor booths',
    coordinate: { latitude: 43.6510, longitude: -79.3800 },
    icon: 'people',
  },
  {
    id: '4',
    name: 'Hotel Partner',
    address: '321 Hospitality Road, Toronto, ON',
    description: 'Official accommodation partner with special rates',
    coordinate: { latitude: 43.6480, longitude: -79.3810 },
    icon: 'bed',
  },
];

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(VENUE_LOCATIONS[0]);

  // Animation value for bottom sheet
  const bottomSheetHeight = useRef(new Animated.Value(200)).current;
  const [isExpanded, setIsExpanded] = useState(false);

  // If web platform, use web component
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Header title="Venue Map" showBackButton={false} />
        <WebMapComponent locations={VENUE_LOCATIONS} />
      </View>
    );
  }

  // If MapView is not available, show fallback
  if (!MapView) {
    return (
      <View style={styles.container}>
        <Header title="Venue Map" showBackButton={false} />
        <WebMapComponent locations={VENUE_LOCATIONS} />
      </View>
    );
  }

  // Toggle bottom sheet expansion
  const toggleBottomSheet = () => {
    const toValue = isExpanded ? 200 : 400;

    Animated.spring(bottomSheetHeight, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();

    setIsExpanded(!isExpanded);
  };

  // Handle marker press - center the map and scroll to the location card
  const handleMarkerPress = (location, index) => {
    setSelectedLocation(location);

    // Animate to the selected location
    mapRef.current?.animateToRegion({
      latitude: location.coordinate.latitude,
      longitude: location.coordinate.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);

    // Scroll to the selected card
    scrollViewRef.current?.scrollTo({
      x: index * (width - 80),
      animated: true,
    });
  };

  // Open in Maps app
  const openInMaps = (location) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${location.coordinate.latitude},${location.coordinate.longitude}`;
    const label = location.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Header title="Venue Map" showBackButton={false} />

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 43.6532,
            longitude: -79.3832,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          {VENUE_LOCATIONS.map((location) => (
            <Marker
              key={location.id}
              coordinate={location.coordinate}
              title={location.name}
              description={location.address}
              onPress={() => handleMarkerPress(location, VENUE_LOCATIONS.findIndex(l => l.id === location.id))}
            >
              <View style={[
                styles.markerContainer,
                selectedLocation.id === location.id && styles.selectedMarker
              ]}>
                <Ionicons
                  name={location.icon}
                  size={selectedLocation.id === location.id ? 24 : 20}
                  color={selectedLocation.id === location.id ? COLORS.primary : '#FFFFFF'}
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Location Cards Scroll */}
        <View style={styles.cardsContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 80}
            decelerationRate="fast"
            contentContainerStyle={styles.cardsContent}
            onMomentumScrollEnd={(event) => {
              const selectedIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 80));
              setSelectedLocation(VENUE_LOCATIONS[selectedIndex]);

              // Center the map on the selected location
              mapRef.current?.animateToRegion({
                latitude: VENUE_LOCATIONS[selectedIndex].coordinate.latitude,
                longitude: VENUE_LOCATIONS[selectedIndex].coordinate.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }, 500);
            }}
          >
            {VENUE_LOCATIONS.map((location) => (
              <Card key={location.id} style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <View style={styles.locationIconContainer}>
                    <Ionicons name={location.icon} size={24} color="#FFFFFF" />
                  </View>
                  <StyledText type="subheading" style={styles.locationName}>
                    {location.name}
                  </StyledText>
                </View>
                <StyledText type="caption" style={styles.locationAddress}>
                  {location.address}
                </StyledText>
                <StyledText style={styles.locationDescription}>
                  {location.description}
                </StyledText>
                <Button
                  label="Directions"
                  variant="primary"
                  size="small"
                  style={styles.directionsButton}
                  leftIcon={<Ionicons name="navigate" size={16} color="#FFFFFF" />}
                  onPress={() => openInMaps(location)}
                />
              </Card>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Bottom sheet for floor plans and additional info */}
      <Animated.View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
        <View style={styles.bottomSheetHandle}>
          <TouchableOpacity style={styles.handleButton} onPress={toggleBottomSheet}>
            <View style={styles.handle} />
            <StyledText type="bodyBold" style={styles.handleText}>
              {isExpanded ? 'Hide Floor Plans' : 'View Floor Plans'}
            </StyledText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.bottomSheetContent}>
          <View style={styles.floorPlanSection}>
            <StyledText type="subheading" style={styles.sectionTitle}>
              Floor Plans
            </StyledText>

            {[1, 2, 3].map((floor) => (
              <TouchableOpacity
                key={floor}
                style={styles.floorPlanItem}
                onPress={() => router.push(`/floor-plan/${floor}`)}
              >
                <View style={styles.floorPlanIcon}>
                  <Ionicons name="map-outline" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.floorPlanInfo}>
                  <StyledText type="bodyBold">{`Floor ${floor}`}</StyledText>
                  <StyledText type="caption">
                    {floor === 1 ? 'Main Hall, Registration' :
                     floor === 2 ? 'Conference Rooms A-F' : 'Workshop Areas'}
                  </StyledText>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.text_secondary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.floorPlanSection}>
            <StyledText type="subheading" style={styles.sectionTitle}>
              Venue Information
            </StyledText>

            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Opening Hours</StyledText>
                <StyledText>
                  Daily from 8:00 AM to 9:00 PM
                </StyledText>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Food & Dining</StyledText>
                <StyledText>
                  Food court on Level 1, Cafés on all floors
                </StyledText>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="wifi-outline" size={20} color={COLORS.primary} style={styles.infoIcon} />
              <View>
                <StyledText type="bodyBold">Wi-Fi Access</StyledText>
                <StyledText>
                  Network: DECA_Event | Password: Provincial2025
                </StyledText>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: COLORS.text_secondary,
    borderRadius: 50,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...SHADOWS.md,
  },
  selectedMarker: {
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 220,
    left: 0,
    right: 0,
    paddingVertical: SPACING.md,
  },
  cardsContent: {
    paddingHorizontal: SPACING.lg,
  },
  locationCard: {
    width: width - 80,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.lg,
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
  locationName: {
    flex: 1,
  },
  locationAddress: {
    marginBottom: SPACING.sm,
  },
  locationDescription: {
    marginBottom: SPACING.md,
  },
  directionsButton: {
    alignSelf: 'flex-start',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.lg,
    zIndex: 10,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  handleButton: {
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  handleText: {
    color: COLORS.primary,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  floorPlanSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
  },
  floorPlanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  floorPlanIcon: {
    backgroundColor: COLORS.stateActive,
    padding: SPACING.sm,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  floorPlanInfo: {
    flex: 1,
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
