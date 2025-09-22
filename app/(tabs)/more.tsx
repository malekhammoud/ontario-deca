import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledText } from '@/components/ui/StyledText';
import { Header } from '@/components/ui/Header';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

const MORE_OPTIONS = [
  {
    id: 'profile',
    title: 'My Profile',
    icon: 'person',
    color: '#4CAF50',
    route: '/profile',
  },
  {
    id: 'awards',
    title: 'Awards Schedule',
    icon: 'trophy',
    color: '#FFC107',
    route: '/awards',
  },
  {
    id: 'coupons',
    title: 'Coupons & Offers',
    icon: 'pricetag',
    color: '#F44336',
    route: '/coupons',
  },
  {
    id: 'network',
    title: 'Networking',
    icon: 'people',
    color: '#2196F3',
    route: '/networking',
  },
  {
    id: 'chatbot',
    title: 'Ask AI Assistant',
    icon: 'chatbubble-ellipses',
    color: '#9C27B0',
    route: '/chatbot',
  },
  {
    id: 'contact',
    title: 'Contact Organizers',
    icon: 'call',
    color: '#FF9800',
    route: '/contact',
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'help-circle',
    color: '#607D8B',
    route: '/faq',
  },
];

const SETTINGS_OPTIONS = [
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications',
    color: '#00BCD4',
    route: '/settings/notifications',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'color-palette',
    color: '#3F51B5',
    route: '/settings/appearance',
  },
  {
    id: 'language',
    title: 'Language',
    icon: 'language',
    color: '#009688',
    route: '/settings/language',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: 'shield-checkmark',
    color: '#795548',
    route: '/settings/privacy',
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleNavigation = (route) => {
    router.push(route);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out the DECA Ontario Provincials app! Download it now to access event schedules, resources, and more.',
        title: 'DECA Ontario Provincials App',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the app');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@decaontario.ca?subject=App Support Request');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="More" showBackButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Summary */}
        <TouchableOpacity
          style={styles.profileSummary}
          onPress={() => handleNavigation('/profile')}
        >
          <View style={styles.profileIconContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileIcon}>
                <Ionicons name="person" size={24} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <StyledText type="subheading">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.emailAddresses[0].emailAddress}
            </StyledText>
            <StyledText type="caption">
              {user?.firstName && user?.lastName
                ? user?.emailAddresses[0].emailAddress
                : 'DECA Member'}
            </StyledText>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.text_secondary} />
        </TouchableOpacity>

        {/* More Options */}
        <View style={styles.section}>
          <StyledText type="subheading" style={styles.sectionTitle}>
            Features
          </StyledText>

          <View style={styles.optionsGrid}>
            {MORE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleNavigation(option.route)}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <StyledText style={styles.optionTitle}>{option.title}</StyledText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <StyledText type="subheading" style={styles.sectionTitle}>
            Settings
          </StyledText>

          {SETTINGS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.settingItem}
              onPress={() => handleNavigation(option.route)}
            >
              <View style={[styles.settingIcon, { backgroundColor: option.color }]}>
                <Ionicons name={option.icon} size={20} color="#FFFFFF" />
              </View>
              <StyledText style={styles.settingTitle}>{option.title}</StyledText>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text_secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={20} color={COLORS.primary} />
            <StyledText style={styles.actionText}>Share This App</StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <StyledText style={styles.actionText}>Contact Support</StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out" size={20} color={COLORS.error} />
            <StyledText style={[styles.actionText, { color: COLORS.error }]}>Sign Out</StyledText>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <StyledText type="caption" style={styles.appVersion}>
            DECA Ontario Provincials App v1.0.0
          </StyledText>
          <StyledText type="caption" style={styles.copyright}>
            © 2025 DECA Ontario. All Rights Reserved.
          </StyledText>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: insets.bottom + SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  profileIconContainer: {
    marginRight: SPACING.md,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.md,
    color: COLORS.text_secondary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  optionTitle: {
    textAlign: 'center',
    fontSize: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingTitle: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  actionText: {
    marginLeft: SPACING.md,
    color: COLORS.primary,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  appVersion: {
    color: COLORS.text_tertiary,
  },
  copyright: {
    color: COLORS.text_tertiary,
    marginTop: SPACING.xs,
  },
});
