import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// Connection type definition
interface Connection {
  id: string;
  firstName: string;
  lastName: string;
  school: string;
  email: string;
  phoneNumber?: string;
  linkedin?: string;
  website?: string;
  eventPreferences?: string[];
  connected: string;
}
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

// Event names mapping
const EVENT_NAMES = {
  event1: 'Case Study Competition',
  event2: 'Business Plan Presentation', 
  event3: 'Marketing Competition',
  event4: 'Finance Competition',
  event5: 'Entrepreneurship'
};

// Helper function to get event name from ID
const getEventName = (eventId: string): string => {
  return EVENT_NAMES[eventId as keyof typeof EVENT_NAMES] || eventId;
};

export default function NetworkingScreen() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('myProfile');
  // Generate QR code data in JSON format with all user info
  const metadata = user?.unsafeMetadata as any || {};
  const networking = metadata.networking || {};
  const qrData = JSON.stringify({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    school: metadata.school || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
    phoneNumber: user?.phoneNumbers[0]?.phoneNumber || networking.emailOrPhone || '',
    linkedin: networking.linkedin || '',
    website: networking.website || '',
    eventPreferences: metadata.eventSelections || []
  });

  // Load connections from localStorage
  const [connections, setConnections] = useState<Connection[]>([]);

  // Load connections on component mount and when screen comes into focus
  useEffect(() => {
    console.log('useEffect: Loading connections from storage');
    loadConnectionsFromStorage();
  }, []);

  // Reload connections when screen comes into focus (after QR scanning)
  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect: Loading connections from storage');
      loadConnectionsFromStorage();
    }, [])
  );

  // Function to load connections from localStorage
  const loadConnectionsFromStorage = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web platform - use localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedConnections = localStorage.getItem('decanetworking_connections');
          console.log('Loading from localStorage:', storedConnections);
          if (storedConnections) {
            const parsedConnections = JSON.parse(storedConnections);
            console.log('Parsed connections:', parsedConnections);
            setConnections(parsedConnections);
          }
        }
      } else {
        // Mobile platform - use AsyncStorage
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          const storedConnections = await AsyncStorage.getItem('decanetworking_connections');
          console.log('Loading from AsyncStorage:', storedConnections);
          if (storedConnections) {
            const parsedConnections = JSON.parse(storedConnections);
            console.log('Parsed connections:', parsedConnections);
            setConnections(parsedConnections);
          }
        } catch (asyncError) {
          console.log('AsyncStorage not available, falling back to localStorage');
          if (typeof window !== 'undefined' && window.localStorage) {
            const storedConnections = localStorage.getItem('decanetworking_connections');
            if (storedConnections) {
              const parsedConnections = JSON.parse(storedConnections);
              setConnections(parsedConnections);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  // Function to remove a connection
  const removeConnection = (connectionId: string) => {
    try {
      console.log('Removing connection with ID:', connectionId);
      console.log('Current connections:', connections);
      console.log('Connection IDs:', connections.map(c => c.id));
      
      // Find the connection to be removed
      const connectionToRemove = connections.find(conn => conn.id === connectionId);
      if (!connectionToRemove) {
        console.error('Connection not found with ID:', connectionId);
        Alert.alert('Error', 'Connection not found. Please try again.');
        return;
      }
      
      const updatedConnections = connections.filter((conn: any) => conn.id !== connectionId);
      console.log('Updated connections after filter:', updatedConnections);
      console.log('Removed connection count:', connections.length - updatedConnections.length);
      
      // Update state immediately
      setConnections(updatedConnections);
      
      // Update storage
      if (Platform.OS === 'web') {
        // Web platform - use localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('decanetworking_connections', JSON.stringify(updatedConnections));
          console.log('Saved to localStorage');
          
          // Verify localStorage was updated
          const storedData = localStorage.getItem('decanetworking_connections');
          console.log('Verified localStorage data:', storedData);
        }
      } else {
        // Mobile platform - use AsyncStorage
        try {
          const AsyncStorage = require('@react-native-async-storage/async-storage').default;
          AsyncStorage.setItem('decanetworking_connections', JSON.stringify(updatedConnections));
          console.log('Saved to AsyncStorage');
        } catch (asyncError) {
          console.log('AsyncStorage not available, falling back to localStorage');
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('decanetworking_connections', JSON.stringify(updatedConnections));
            console.log('Saved to localStorage fallback');
          }
        }
      }
      
      // Show success message
      Alert.alert(
        'Connection Removed',
        `${connectionToRemove.firstName} ${connectionToRemove.lastName} has been removed from your connections.`
      );
      
    } catch (error) {
      console.error('Error removing connection:', error);
      Alert.alert('Error', 'Failed to remove connection. Please try again.');
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
                  ? 'Your networking profile for connecting with other participants'
                  : 'Let others scan this code to instantly connect with you'
                }
              </StyledText>

              <View style={styles.qrCodeContainer}>
                <QRCodeComponent />
              </View>

              <View style={styles.scanButtonContainer}>
                {Platform.OS !== 'web' && (
                  <Button
                    label="Scan QR Code"
                    variant="primary"
                    leftIcon={<Ionicons name="scan" size={18} color="#FFFFFF" />}
                    onPress={handleScanQR}
                    style={styles.scanButton}
                  />
                )}
              </View>
            </Card>
          </View>

          <Card style={styles.profileCard}>
            <StyledText type="subheading" style={styles.profileTitle}>
              QR Code Information
            </StyledText>
            <StyledText type="caption" style={styles.qrInfoSubtitle}>
              This is the information others will see when they scan your QR code
            </StyledText>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                First Name
              </StyledText>
              <StyledText style={styles.fieldValue}>
                {user?.firstName || 'Not provided'}
              </StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Last Name
              </StyledText>
              <StyledText style={styles.fieldValue}>
                {user?.lastName || 'Not provided'}
              </StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                School
              </StyledText>
              <StyledText style={styles.fieldValue}>
                {metadata.school || 'Not provided'}
              </StyledText>
            </View>

            <View style={styles.profileField}>
              <StyledText type="caption" style={styles.fieldLabel}>
                Email
              </StyledText>
              <View style={styles.emailContainer}>
                <StyledText style={styles.fieldValue}>
                  {user?.emailAddresses[0]?.emailAddress || 'Not provided'}
                </StyledText>
                <TouchableOpacity onPress={() => copyEmailToClipboard(user?.emailAddresses[0]?.emailAddress || '')}>
                  <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {(user?.phoneNumbers[0]?.phoneNumber || networking.emailOrPhone) && (
              <View style={styles.profileField}>
                <StyledText type="caption" style={styles.fieldLabel}>
                  Phone Number
                </StyledText>
                <View style={styles.emailContainer}>
                  <StyledText style={styles.fieldValue}>
                    {user?.phoneNumbers[0]?.phoneNumber || networking.emailOrPhone}
                  </StyledText>
                  <TouchableOpacity onPress={() => copyEmailToClipboard(user?.phoneNumbers[0]?.phoneNumber || networking.emailOrPhone || '')}>
                    <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {networking.linkedin && (
              <View style={styles.profileField}>
                <StyledText type="caption" style={styles.fieldLabel}>
                  LinkedIn
                </StyledText>
                <View style={styles.emailContainer}>
                  <StyledText style={styles.fieldValue}>
                    {networking.linkedin}
                  </StyledText>
                  <TouchableOpacity onPress={() => copyEmailToClipboard(networking.linkedin)}>
                    <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {networking.website && (
              <View style={styles.profileField}>
                <StyledText type="caption" style={styles.fieldLabel}>
                  Website
                </StyledText>
                <View style={styles.emailContainer}>
                  <StyledText style={styles.fieldValue}>
                    {networking.website}
                  </StyledText>
                  <TouchableOpacity onPress={() => copyEmailToClipboard(networking.website)}>
                    <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {metadata.eventSelections && metadata.eventSelections.length > 0 && (
              <View style={styles.profileField}>
                <StyledText type="caption" style={styles.fieldLabel}>
                  Event Preferences
                </StyledText>
                <View style={styles.interestTags}>
                  {metadata.eventSelections.map((eventId: string, index: number) => (
                    <View key={index} style={styles.interestTag}>
                      <StyledText style={styles.interestText}>
                        {getEventName(eventId)}
                      </StyledText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.editProfileNotice}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
              <StyledText style={styles.editProfileNoticeText}>
                Missing information? Edit your profile to add more details to your QR code.
              </StyledText>
            </View>

            <Button
              label="Edit Profile"
              variant="outline"
              style={styles.editButton}
              leftIcon={<Ionicons name="person-outline" size={16} color={COLORS.primary} />}
              onPress={() => router.push('/profile')}
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
            <Button
              label="Scan QR"
              variant="primary"
              size="small"
              leftIcon={<Ionicons name="scan" size={16} color="#FFFFFF" />}
              onPress={handleScanQR}
            />
          </View>

          {connections.length === 0 ? (
            <Card style={styles.emptyConnectionsCard}>
              <View style={styles.emptyConnectionsContainer}>
                <Ionicons name="people-outline" size={64} color={COLORS.text_secondary} />
                <StyledText type="heading2" style={styles.emptyConnectionsTitle}>
                  No Connections Yet
                </StyledText>
                <StyledText style={styles.emptyConnectionsText}>
                  Scan QR codes from other attendees to build your network
                </StyledText>
                <Button
                  label="Scan Your First QR Code"
                  style={styles.emptyConnectionsButton}
                  leftIcon={<Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />}
                  onPress={handleScanQR}
                />
              </View>
            </Card>
          ) : (
            connections.map((connection) => (
            <Card key={connection.id} style={styles.connectionCard}>
              <View style={styles.connectionHeader}>
                <View style={styles.connectionAvatar}>
                  <StyledText type="heading3" color="#FFFFFF">
                    {(connection.firstName?.charAt(0) || '') + (connection.lastName?.charAt(0) || '')}
                  </StyledText>
                </View>

                <View style={styles.connectionInfo}>
                  <StyledText type="subheading">
                    {connection.firstName} {connection.lastName}
                  </StyledText>
                  <StyledText type="caption">Student • {connection.school}</StyledText>
                  <StyledText type="caption" style={styles.connectionTime}>
                    Connected {connection.connected}
                  </StyledText>
                </View>

                {/* <TouchableOpacity
                  style={styles.connectionAction}
                  onPress={() => {
                    console.log('Delete button pressed for connection:', connection.id);
                    Alert.alert(
                      'Remove Connection',
                      `Are you sure you want to remove ${connection.firstName} ${connection.lastName} from your connections? This action cannot be undone.`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Remove', 
                          style: 'destructive',
                          onPress: () => {
                            console.log('Remove confirmed for connection:', connection.id);
                            removeConnection(connection.id);
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text_secondary} />
                </TouchableOpacity> */}
              </View>

              <View style={styles.connectionDetails}>
                {/* Email Contact */}
                <View style={styles.connectionContact}>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => copyEmailToClipboard(connection.email)}
                  >
                    <Ionicons name="mail" size={16} color={COLORS.primary} />
                    <StyledText style={styles.contactText}>{connection.email}</StyledText>
                  </TouchableOpacity>
                </View>

                {/* Phone Number */}
                {connection.phoneNumber && (
                  <View style={styles.connectionContact}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => copyEmailToClipboard(connection.phoneNumber!)}
                    >
                      <Ionicons name="call" size={16} color={COLORS.primary} />
                      <StyledText style={styles.contactText}>{connection.phoneNumber}</StyledText>
                    </TouchableOpacity>
                  </View>
                )}

                {/* LinkedIn */}
                {connection.linkedin && (
                  <View style={styles.connectionContact}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => copyEmailToClipboard(connection.linkedin!)}
                    >
                      <Ionicons name="logo-linkedin" size={16} color={COLORS.primary} />
                      <StyledText style={styles.contactText}>{connection.linkedin}</StyledText>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Website */}
                {connection.website && (
                  <View style={styles.connectionContact}>
                    <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() => copyEmailToClipboard(connection.website!)}
                    >
                      <Ionicons name="globe" size={16} color={COLORS.primary} />
                      <StyledText style={styles.contactText}>{connection.website}</StyledText>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Event Preferences */}
                {connection.eventPreferences && connection.eventPreferences.length > 0 && (
                  <View style={styles.connectionInterests}>
                    <StyledText type="caption" style={styles.interestsLabel}>
                      Event Preferences:
                    </StyledText>
                    <View style={styles.interestTags}>
                      {connection.eventPreferences.map((eventId, index) => (
                        <View key={index} style={styles.interestTag}>
                          <StyledText style={styles.interestText}>
                            {getEventName(eventId)}
                          </StyledText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </Card>
          )))}

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
  scanButtonContainer: {
    marginTop: SPACING.lg,
    width: '100%',
    alignItems: 'center',
  },
  scanButton: {
    minWidth: 200,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileTitle: {
    marginBottom: SPACING.md,
  },
  qrInfoSubtitle: {
    color: COLORS.text_secondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontStyle: 'italic',
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
  editProfileNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '08',
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  editProfileNoticeText: {
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    fontSize: 14,
    flex: 1,
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
  emptyConnectionsCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
  emptyConnectionsContainer: {
    alignItems: 'center',
  },
  emptyConnectionsTitle: {
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyConnectionsText: {
    color: COLORS.text_secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  emptyConnectionsButton: {
    marginTop: SPACING.md,
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
