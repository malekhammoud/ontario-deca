import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { COLORS, SPACING } from '@/constants/colors';

const { width } = Dimensions.get('window');

// Sample floor plan data
const FLOOR_PLANS = {
  '1': {
    id: '1',
    title: 'First Floor',
    description: 'Main Hall, Registration, Food Court, Auditorium',
    image: 'https://via.placeholder.com/1000x800',
    points: [
      {
        id: '1',
        x: 0.2,
        y: 0.3,
        label: 'Registration',
        description: 'Check-in and information desk',
        icon: 'information-circle'
      },
      {
        id: '2',
        x: 0.6,
        y: 0.4,
        label: 'Main Auditorium',
        description: 'Opening and closing ceremonies, awards',
        icon: 'people'
      },
      {
        id: '3',
        x: 0.8,
        y: 0.7,
        label: 'Food Court',
        description: 'Dining area with multiple food options',
        icon: 'restaurant'
      },
      {
        id: '4',
        x: 0.3,
        y: 0.6,
        label: 'Restrooms',
        description: 'Men\'s and women\'s facilities',
        icon: 'water'
      },
      {
        id: '5',
        x: 0.5,
        y: 0.8,
        label: 'Elevators',
        description: 'Access to upper floors',
        icon: 'arrow-up'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Second Floor',
    description: 'Conference Rooms A-F, Breakout Areas, Study Spaces',
    image: 'https://via.placeholder.com/1000x800',
    points: [
      {
        id: '1',
        x: 0.3,
        y: 0.2,
        label: 'Conference Room A',
        description: 'Business Management presentations',
        icon: 'business'
      },
      {
        id: '2',
        x: 0.5,
        y: 0.2,
        label: 'Conference Room B',
        description: 'Marketing presentations',
        icon: 'megaphone'
      },
      {
        id: '3',
        x: 0.7,
        y: 0.2,
        label: 'Conference Room C',
        description: 'Finance presentations',
        icon: 'cash'
      },
      {
        id: '4',
        x: 0.3,
        y: 0.5,
        label: 'Study Area',
        description: 'Quiet space for preparation',
        icon: 'book'
      },
      {
        id: '5',
        x: 0.7,
        y: 0.5,
        label: 'Networking Zone',
        description: 'Meet with other participants',
        icon: 'people'
      },
      {
        id: '6',
        x: 0.5,
        y: 0.8,
        label: 'Restrooms',
        description: 'Men\'s and women\'s facilities',
        icon: 'water'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'Third Floor',
    description: 'Workshop Areas, Judge Rooms, Admin Offices',
    image: 'https://via.placeholder.com/1000x800',
    points: [
      {
        id: '1',
        x: 0.2,
        y: 0.3,
        label: 'Workshop Room 1',
        description: 'Presentation skills workshop',
        icon: 'easel'
      },
      {
        id: '2',
        x: 0.5,
        y: 0.3,
        label: 'Workshop Room 2',
        description: 'Leadership development',
        icon: 'people'
      },
      {
        id: '3',
        x: 0.8,
        y: 0.3,
        label: 'Workshop Room 3',
        description: 'Financial literacy',
        icon: 'calculator'
      },
      {
        id: '4',
        x: 0.3,
        y: 0.6,
        label: 'Judges Area',
        description: 'Private area for judges',
        icon: 'ribbon'
      },
      {
        id: '5',
        x: 0.7,
        y: 0.6,
        label: 'Admin Offices',
        description: 'Event staff and organization',
        icon: 'briefcase'
      },
      {
        id: '6',
        x: 0.5,
        y: 0.8,
        label: 'Restrooms',
        description: 'Men\'s and women\'s facilities',
        icon: 'water'
      }
    ]
  }
};

export default function FloorPlanScreen() {
  const { floor = '1' } = useLocalSearchParams();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [scale, setScale] = useState(1);
  const floorPlan = FLOOR_PLANS[floor] || FLOOR_PLANS['1'];
  
  // Set up pan and zoom functionality
  const pan = useRef(new Animated.ValueXY()).current;
  const lastScale = useRef(1);
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const combinedScale = Animated.multiply(baseScale, pinchScale);
  
  combinedScale.addListener(({ value }) => {
    setScale(value);
  });
  
  // Pan responder for dragging and zooming
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [
        null,
        { dx: pan.x, dy: pan.y }
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      pan.flattenOffset();
    }
  });
  
  // Helper function to handle point selection
  const handlePointPress = (point) => {
    setSelectedPoint(point);
  };
  
  // Helper function to reset zoom and position
  const resetZoomAndPosition = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }),
      Animated.spring(baseScale, {
        toValue: 1,
        useNativeDriver: false
      })
    ]).start();
    
    pinchScale.setValue(1);
    lastScale.current = 1;
  };
  
  // Handle floor change
  const changeFloor = (newFloor) => {
    // In a real app, this would navigate to the new floor
    // For this demo, we'll reset the selection
    setSelectedPoint(null);
  };
  
  return (
    <View style={styles.container}>
      <Header title={`Floor Plan - ${floorPlan.title}`} />
      
      <View style={styles.floorSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.floorSelectorContent}
        >
          {Object.values(FLOOR_PLANS).map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.floorButton,
                plan.id === floor && styles.activeFloorButton
              ]}
              onPress={() => changeFloor(plan.id)}
            >
              <StyledText
                style={[
                  styles.floorButtonText,
                  plan.id === floor && styles.activeFloorButtonText
                ]}
              >
                Floor {plan.id}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <StyledText style={styles.floorDescription}>
        {floorPlan.description}
      </StyledText>
      
      {/* Floor Plan View */}
      <View style={styles.mapContainer}>
        <Animated.View
          style={[
            styles.mapWrapper,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: combinedScale }
              ]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: floorPlan.image }}
            style={styles.mapImage}
            resizeMode="contain"
          />
          
          {/* Points of Interest */}
          {floorPlan.points.map((point) => (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.pointMarker,
                {
                  left: `${point.x * 100}%`,
                  top: `${point.y * 100}%`,
                },
                selectedPoint?.id === point.id && styles.selectedPointMarker
              ]}
              onPress={() => handlePointPress(point)}
            >
              <Ionicons
                name={point.icon}
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ))}
        </Animated.View>
        
        {/* Zoom Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => {
              const newScale = Math.min(lastScale.current + 0.25, 3);
              baseScale.setValue(newScale);
              lastScale.current = newScale;
            }}
          >
            <Ionicons name="add" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => {
              const newScale = Math.max(lastScale.current - 0.25, 0.5);
              baseScale.setValue(newScale);
              lastScale.current = newScale;
            }}
          >
            <Ionicons name="remove" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={resetZoomAndPosition}
          >
            <Ionicons name="refresh" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Point Details */}
      {selectedPoint && (
        <View style={styles.pointDetailsContainer}>
          <View style={styles.pointDetails}>
            <View style={styles.pointHeader}>
              <View style={styles.pointHeaderContent}>
                <View style={styles.pointIconContainer}>
                  <Ionicons name={selectedPoint.icon} size={20} color="#FFFFFF" />
                </View>
                <StyledText type="subheading" style={styles.pointTitle}>
                  {selectedPoint.label}
                </StyledText>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedPoint(null)}
              >
                <Ionicons name="close" size={20} color={COLORS.text_secondary} />
              </TouchableOpacity>
            </View>
            <StyledText style={styles.pointDescription}>
              {selectedPoint.description}
            </StyledText>
          </View>
        </View>
      )}
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        <TouchableOpacity
          style={styles.legendButton}
          onPress={() => {
            // Toggle legend visibility in a real app
          }}
        >
          <Ionicons name="list" size={20} color={COLORS.text} />
          <StyledText style={styles.legendButtonText}>Legend</StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  floorSelectorContainer: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  floorSelectorContent: {
    paddingHorizontal: SPACING.md,
  },
  floorButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  activeFloorButton: {
    backgroundColor: COLORS.primary,
  },
  floorButtonText: {
    fontSize: 14,
    color: COLORS.text_secondary,
  },
  activeFloorButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  floorDescription: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    color: COLORS.text_secondary,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: width,
    height: width * 0.8,
  },
  pointMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -16,
    marginTop: -16,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedPointMarker: {
    backgroundColor: COLORS.primary_dark,
    transform: [{ scale: 1.2 }],
  },
  mapControls: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointDetailsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.md,
    backgroundColor: 'transparent',
  },
  pointDetails: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pointHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pointIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  pointTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  pointDescription: {
    color: COLORS.text_secondary,
  },
  legendContainer: {
    position: 'absolute',
    left: SPACING.md,
    bottom: SPACING.lg,
  },
  legendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendButtonText: {
    marginLeft: 4,
  },
});
