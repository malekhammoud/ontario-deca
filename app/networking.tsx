import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, SHADOWS } from '@/constants/colors';

// Import clipboard for all platforms
let Clipboard: any = null;
try {
  Clipboard = require('expo-clipboard');
} catch (error) {
  console.log('Clipboard not available');
}

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.6;

export default function NetworkingScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('myProfile');
  const [profileData, setProfileData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'DECA Member',
    email: user?.emailAddresses[0].emailAddress || '',
    role: 'Attendee',
    organization: 'DECA Ontario',
    interests: ['Business Management', 'Marketing', 'Leadership'],
    socials: {
      linkedin: 'linkedin.com/in/yourusername',
      twitter: 'twitter.com/yourusername',
    }
  });

  // Generate QR code data with just the user's email
  const qrData = profileData.email;

  // Mock connections for demo purposes
  const [connections, setConnections] = useState([
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Student',
      organization: 'Western High School',
      email: 'alex.johnson@example.com',
      connected: '2 hours ago',
      interests: ['Finance', 'Entrepreneurship'],
    },
    {
      id: '2',
      name: 'Taylor Martinez',
      role: 'Chapter Advisor',
      organization: 'Eastview Academy',
      email: 'tmartinez@example.com',
      connected: 'Yesterday',
      interests: ['Marketing', 'Public Speaking'],
    },
    {
      id: '3',
      name: 'Jordan Lee',
      role: 'Student',
      organization: 'Northern Secondary School',
      email: 'jordan.lee@example.com',
      connected: 'Yesterday',
      interests: ['Hospitality', 'Business Management'],
    }
  ]);

  // Handle sharing profile
  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Connect with me at DECA Provincials!\n\nName: ${profileData.name}\nEmail: ${profileData.email}\nOrganization: ${profileData.organization}`,
        title: 'DECA Provincials - Connect with me',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share your profile');
    }
  };

  // Handle scanning QR code
  const handleScanQR = () => {
    // Navigate to the QR code scanner modal
    router.push('/modal');
  };

  // Copy email to clipboard
  const copyEmailToClipboard = async (email: string) => {
    if (Platform.OS === 'web') {
      // Web fallback
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        Alert.alert('Copied', 'Email address copied to clipboard');
      } else {
        Alert.alert('Copy', `Email: ${email}\nPlease copy manually.`);
      }
    } else if (Clipboard) {
      await Clipboard.setStringAsync(email);
      Alert.alert('Copied', 'Email address copied to clipboard');
    }
  };

  // QR code component - displays user's email
  const QRCodeComponent = () => {
    return (
      <QRCode
        value={qrData}
        size={200}
        color="black"
        backgroundColor="#FFFFFF"
        logo="https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/639a07cada7a2d68f4e9ef31_DECA%20Diamond%20Blue.png"
        logoSize={50}
        logoBackgroundColor="transparent"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Networking" />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myProfile' && styles.activeTab]}
          onPress={() => setActiveTab('myProfile')}
        >
          <Ionicons
            name="person"
            size={18}
            color={activeTab === 'myProfile' ? COLORS.primary : COLORS.text_secondary}
          />
          <StyledText
            style={[
              styles.tabText,
              activeTab === 'myProfile' && styles.activeTabText
            ]}
          >
            My Profile
          </StyledText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
          onPress={() => setActiveTab('connections')}
        >
          <Ionicons
            name="people"
            size={18}
            color={activeTab === 'connections' ? COLORS.primary : COLORS.text_secondary}
          />
          <StyledText
            style={[
              styles.tabText,
              activeTab === 'connections' && styles.activeTabText
            ]}
          >
            Connections
          </StyledText>
          <View style={styles.badgeContainer}>
            <StyledText style={styles.badgeText}>{connections.length}</StyledText>
          </View>
        </TouchableOpacity>
      </View>

      {/* My Profile Tab */}
      {activeTab === 'myProfile' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.qrContainer}>
            <Card style={styles.qrCard}>
              <StyledText type="subheading" style={styles.qrTitle}>
                My Networking {Platform.OS === 'web' ? 'Profile' : 'QR Code'}
              </StyledText>
              <StyledText style={styles.qrDescription}>
                {Platform.OS === 'web'
                  ? 'Share your profile with other participants'
                  : 'Let others scan this code to connect with you'
                }
              </StyledText>

              <View style={styles.qrCodeContainer}>
                <QRCodeComponent />
              </View>

              <View style={styles.qrActions}>
                <Button
                  label="Share Profile"
                  variant="primary"
                  leftIcon={<Ionicons name="share-social" size={18} color="#FFFFFF" />}
                  onPress={handleShareProfile}
                  style={styles.qrButton}
                />
                {Platform.OS !== 'web' && (
                  <Button
                    label="Scan QR Code"
                    variant="outline"
                    leftIcon={<Ionicons name="scan" size={18} color={COLORS.primary} />}
                    onPress={handleScanQR}
                    style={styles.qrButton}
                  />
                )}
              </View>
            </Card>
          </View>

          <Card style={styles.profileCard}>
            <StyledText type="subheading" style={styles.profileTitle}>
              Profile Information
            </StyledText>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Name
              </StyledText>
              <StyledText style={styles.fieldValue}>{profileData.name}</StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Email
              </StyledText>
              <View style={styles.emailContainer}>
                <StyledText style={styles.fieldValue}>{profileData.email}</StyledText>
                <TouchableOpacity onPress={() => copyEmailToClipboard(profileData.email)}>
                  <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Role
              </StyledText>
              <StyledText style={styles.fieldValue}>{profileData.role}</StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Organization
              </StyledText>
              <StyledText style={styles.fieldValue}>{profileData.organization}</StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Interests
              </StyledText>
              <View style={styles.interestTags}>
                {profileData.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <StyledText style={styles.interestText}>{interest}</StyledText>
                  </View>
                ))}
              </View>
            </View>

            <Button
              label="Edit Profile"
              variant="outline"
              style={styles.editButton}
              onPress={() => {}}
            />
          </Card>

          <View style={{ height: insets.bottom + SPACING.xl }} />
        </ScrollView>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.connectionsHeader}>
            <StyledText type="subheading">{connections.length} Connections</StyledText>
            {Platform.OS !== 'web' && (
              <Button
                label="Scan QR"
                variant="primary"
                size="small"
                leftIcon={<Ionicons name="scan" size={16} color="#FFFFFF" />}
                onPress={handleScanQR}
              />
            )}
          </View>

          {connections.map((connection) => (
            <Card key={connection.id} style={styles.connectionCard}>
              <View style={styles.connectionHeader}>
                <View style={styles.connectionAvatar}>
                  <StyledText type="heading3" color="#FFFFFF">
                    {connection.name.charAt(0)}
                  </StyledText>
                </View>

                <View style={styles.connectionInfo}>
                  <StyledText type="subheading">{connection.name}</StyledText>
                  <StyledText type="caption">{connection.role} • {connection.organization}</StyledText>
                  <StyledText type="caption" style={styles.connectionTime}>
                    Connected {connection.connected}
                  </StyledText>
                </View>

                <TouchableOpacity
                  style={styles.connectionAction}
                  onPress={() => {}}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text_secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.connectionDetails}>
                <View style={styles.connectionContact}>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => copyEmailToClipboard(connection.email)}
                  >
                    <Ionicons name="mail" size={16} color={COLORS.primary} />
                    <StyledText style={styles.contactText}>{connection.email}</StyledText>
                  </TouchableOpacity>
                </View>

                <View style={styles.connectionInterests}>
                  <StyledText type="caption" style={styles.interestsLabel}>
                    Interests:
                  </StyledText>
                  <View style={styles.interestTags}>
                    {connection.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <StyledText style={styles.interestText}>{interest}</StyledText>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.connectionActions}>
                  <Button
                    label="Message"
                    variant="outline"
                    size="small"
                    style={styles.connectionButton}
                    leftIcon={<Ionicons name="chatbubble" size={16} color={COLORS.primary} />}
                    onPress={() => {}}
                  />
                  <Button
                    label="Schedule Meeting"
                    variant="outline"
                    size="small"
                    style={styles.connectionButton}
                    leftIcon={<Ionicons name="calendar" size={16} color={COLORS.primary} />}
                    onPress={() => {}}
                  />
                </View>
              </View>
            </Card>
          ))}

          <View style={{ height: insets.bottom + SPACING.xl }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    marginLeft: SPACING.xs,
    color: COLORS.text_secondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badgeContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  qrCard: {
    alignItems: 'center',
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  qrTitle: {
    marginBottom: SPACING.xs,
  },
  qrDescription: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    marginBottom: SPACING.lg,
  },
  qrCodeContainer: {
    padding: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...SHADOWS.small,
  },
  qrActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    width: '100%',
    justifyContent: 'space-between',
  },
  qrButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileTitle: {
    marginBottom: SPACING.md,
  },
  profileField: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    color: COLORS.text_secondary,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: COLORS.stateActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    marginTop: SPACING.sm,
  },
  connectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  connectionCard: {
    marginBottom: SPACING.md,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  connectionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionTime: {
    color: COLORS.text_tertiary,
    marginTop: 4,
  },
  connectionAction: {
    padding: SPACING.xs,
  },
  connectionDetails: {
    marginTop: SPACING.md,
  },
  connectionContact: {
    marginBottom: SPACING.md,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    color: COLORS.primary,
  },
  connectionInterests: {
    marginBottom: SPACING.md,
  },
  interestsLabel: {
    color: COLORS.text_secondary,
    marginBottom: 8,
  },
  connectionActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  connectionButton: {
    marginRight: SPACING.md,
  },
  webQRFallback: {
    width: QR_SIZE,
    height: QR_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
  },
  webQRText: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    marginTop: SPACING.md,
    fontSize: 14,
    lineHeight: 20,
  },
});
