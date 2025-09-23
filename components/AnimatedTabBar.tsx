import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '@/constants/colors';

const { width } = Dimensions.get('window');

interface TabIconProps {
  name: string;
  focused: boolean;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, size }) => (
  <Ionicons 
    name={name as any} 
    size={size} 
    color={focused ? COLORS.primary : COLORS.text_tertiary}
  />
);

export const AnimatedTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  const insets = useSafeAreaInsets();
  const animatedValue = useSharedValue(0);
  const tabWidth = width / state.routes.length;

  useEffect(() => {
    animatedValue.value = withSpring(state.index, {
      damping: 25,
      stiffness: 200,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      [0, state.routes.length - 1],
      [16, width - tabWidth - 16],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const getTabIcon = (routeName: string): string => {
    const iconMap: { [key: string]: string } = {
      index: 'home',
      schedule: 'calendar',
      map: 'map',
      resources: 'document-text',
      explore: 'compass',
      more: 'ellipsis-horizontal',
    };
    return iconMap[routeName] || 'circle';
  };

  const handleTabPress = (index: number, route: any) => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.tabBar}>
        {/* Professional Background */}
        <View style={styles.background} />

        {/* Animated Indicator - More Professional */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View style={styles.indicatorBackground} />
        </Animated.View>

        {/* Tab Items */}
        <View style={styles.tabContainer}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => handleTabPress(index, route)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabContent, isFocused && styles.focusedTab]}>
                  <View style={styles.iconContainer}>
                    <TabIcon
                      name={getTabIcon(route.name)}
                      focused={isFocused}
                      size={22}
                    />
                  </View>
                  <Text style={[
                    styles.label,
                    { color: isFocused ? COLORS.primary : COLORS.text_tertiary }
                  ]}>
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Professional Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('profile')}
          activeOpacity={0.8}
        >
          <View style={styles.profileButtonBackground}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.card,
    borderRadius: 24,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    height: 52,
    width: (width / 5) - 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  indicatorBackground: {
    flex: 1,
    backgroundColor: COLORS.stateActive,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
  },
  focusedTab: {
    // Additional styling for focused tab if needed
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  profileButton: {
    position: 'absolute',
    top: -8,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    ...SHADOWS.medium,
  },
  profileButtonBackground: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border_light,
  },
});
