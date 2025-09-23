import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS, LAYOUT } from '@/constants/colors';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  gradientColors?: string[];
  backgroundColor?: string;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  gradientColors = COLORS.primary_gradient,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();

  const headerContent = (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.md }]}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View 
        entering={FadeInUp.delay(100).duration(400)}
        style={styles.headerContent}
      >
        {/* Left Side - Back Button */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.text_on_primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title and Subtitle */}
        <Animated.View 
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.centerSection}
        >
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </Animated.View>

        {/* Right Side - Custom Component */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(400)}
          style={styles.rightSection}
        >
          {rightComponent}
        </Animated.View>
      </Animated.View>

      {/* Subtle Decorative Elements */}
      <View style={styles.decorativeContainer}>
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
      </View>
    </View>
  );

  if (backgroundColor) {
    return (
      <View style={[styles.wrapper, { backgroundColor }]}>
        {headerContent}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.wrapper}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {headerContent}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...SHADOWS.small,
  },
  container: {
    paddingHorizontal: SPACING.screen_horizontal,
    paddingBottom: SPACING.lg,
    minHeight: LAYOUT.header_height,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    zIndex: 2,
  },
  leftSection: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  rightSection: {
    width: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text_on_primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 2,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  circle1: {
    width: 100,
    height: 100,
    top: -50,
    right: -30,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 20,
    left: -20,
  },
});
