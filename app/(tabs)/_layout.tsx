import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { AnimatedTabBar } from '@/components/AnimatedTabBar';
import { COLORS } from '@/constants/colors';

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  // If user is not signed in, redirect to auth
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <Tabs
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Venue',
          }}
        />
        <Tabs.Screen
          name="resources"
          options={{
            title: 'Resources',
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
          }}
        />
      </Tabs>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
