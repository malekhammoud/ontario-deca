import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, ANIMATION } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface SwipeableScreenProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  backgroundColor?: string;
  gradientColors?: string[];
}

export const SwipeableScreen: React.FC<SwipeableScreenProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  backgroundColor = COLORS.background,
  gradientColors,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerHaptic = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(triggerHaptic)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      
      // Add slight opacity change for feedback
      const progress = Math.abs(event.translationX) / width;
      opacity.value = interpolate(
        progress,
        [0, 0.3],
        [1, 0.95],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      const shouldSwipe = Math.abs(event.translationX) > width * 0.25 ||
                         Math.abs(event.velocityX) > 1000;

      if (shouldSwipe) {
        if (event.translationX > 0 && onSwipeRight) {
          translateX.value = withSpring(width, {
            damping: 20,
            stiffness: 100,
          });
          runOnJS(onSwipeRight)();
        } else if (event.translationX < 0 && onSwipeLeft) {
          translateX.value = withSpring(-width, {
            damping: 20,
            stiffness: 100,
          });
          runOnJS(onSwipeLeft)();
        } else {
          translateX.value = withSpring(0);
          opacity.value = withSpring(1);
        }
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const content = (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.wrapper}>
        {gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {content}
          </LinearGradient>
        ) : (
          <View style={[styles.solidBackground, { backgroundColor }]}>
            {content}
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  solidBackground: {
    flex: 1,
  },
});
