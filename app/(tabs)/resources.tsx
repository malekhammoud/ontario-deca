import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  Linking,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '@/components/ui/Header';
import { StyledText } from '@/components/ui/StyledText';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING } from '@/constants/colors';

// Conditionally import native modules
let FileSystem = null;
let NetInfo = null;
if (Platform.OS !== 'web') {
  try {
    // Use the legacy filesystem API to avoid deprecation warnings
    FileSystem = require('expo-file-system/legacy');
    NetInfo = require('@react-native-community/netinfo');
  } catch (error) {
    console.log('Native modules not available');
  }
}

// Sample resources data - in a real app, this would come from an API
const RESOURCE_DATA = [
  {
    id: '1',
    title: 'Business Management Case Study',
    category: 'Case Study',
    type: 'PDF',
    size: '2.4 MB',
    lastUpdated: 'Sep 22, 2025',
    url: 'https://example.com/business-case.pdf',
    icon: 'briefcase',
    color: '#4CAF50',
  },
  {
    id: '2',
    title: 'Marketing Strategies Guide',
    category: 'Guide',
    type: 'PDF',
    size: '1.8 MB',
    lastUpdated: 'Sep 21, 2025',
    url: 'https://example.com/marketing-guide.pdf',
    icon: 'megaphone',
    color: '#FFC107',
  },
  {
    id: '3',
    title: 'Finance Competition Rules',
    category: 'Rules',
    type: 'PDF',
    size: '1.2 MB',
    lastUpdated: 'Sep 20, 2025',
    url: 'https://example.com/finance-rules.pdf',
    icon: 'calculator',
    color: '#2196F3',
  },
  {
    id: '4',
    title: 'Hospitality Services Overview',
    category: 'Case Study',
    type: 'PDF',
    size: '3.1 MB',
    lastUpdated: 'Sep 22, 2025',
    url: 'https://example.com/hospitality-overview.pdf',
    icon: 'restaurant',
    color: '#9C27B0',
  },
  {
    id: '5',
    title: 'Presentation Skills Workshop',
    category: 'Workshop',
    type: 'PDF',
    size: '4.5 MB',
    lastUpdated: 'Sep 19, 2025',
    url: 'https://example.com/presentation-skills.pdf',
    icon: 'easel',
    color: '#FF5722',
  },
  {
    id: '6',
    title: 'Networking Tips and Strategies',
    category: 'Guide',
    type: 'PDF',
    size: '1.5 MB',
    lastUpdated: 'Sep 18, 2025',
    url: 'https://example.com/networking-tips.pdf',
    icon: 'people',
    color: '#03A9F4',
  },
  {
    id: '7',
    title: 'Event Schedule and Maps',
    category: 'Information',
    type: 'PDF',
    size: '5.2 MB',
    lastUpdated: 'Sep 22, 2025',
    url: 'https://example.com/schedule-maps.pdf',
    icon: 'calendar',
    color: '#E91E63',
  },
];

// Resource categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All Resources' },
  { id: 'Case Study', name: 'Case Studies' },
  { id: 'Guide', name: 'Guides' },
  { id: 'Rules', name: 'Rules' },
  { id: 'Workshop', name: 'Workshops' },
  { id: 'Information', name: 'Information' },
];

export default function ResourcesScreen() {
  const router = useRouter();
  const [resources, setResources] = useState(RESOURCE_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [isOnline, setIsOnline] = useState(true);

  // Filter resources based on selected category
  const filteredResources = selectedCategory === 'all'
    ? resources
    : resources.filter(item => item.category === selectedCategory);

  // Check network connectivity and downloaded files on mount
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web fallback - assume online
      setIsOnline(navigator.onLine);

      // Listen for online/offline events
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } else if (NetInfo) {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected);
      });

      // Check for already downloaded files on native platforms
      const checkDownloadedFiles = async () => {
        if (!FileSystem) return;

        try {
          const downloads = {};
          for (const resource of resources) {
            const filePath = `${FileSystem.documentDirectory}resources/${resource.id}.pdf`;
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
              downloads[resource.id] = true;
            }
          }
          setDownloadedFiles(downloads);
        } catch (error) {
          console.error('Error checking downloaded files:', error);
        }
      };

      // Create resources directory if it doesn't exist
      const ensureDirectoryExists = async () => {
        if (!FileSystem) return;

        const dirPath = `${FileSystem.documentDirectory}resources/`;
        const dirInfo = await FileSystem.getInfoAsync(dirPath);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
        }
      };

      ensureDirectoryExists().then(checkDownloadedFiles);

      return () => {
        unsubscribe();
      };
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch new resources from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleDownload = async (resource) => {
    if (Platform.OS === 'web') {
      // Web fallback - open in new tab
      window.open(resource.url, '_blank');
      return;
    }

    if (!isOnline && !downloadedFiles[resource.id]) {
      Alert.alert(
        'Offline Mode',
        'You are currently offline. Please connect to the internet to download this resource.',
        [{ text: 'OK' }]
      );
      return;
    }

    // If already downloaded, open the file
    if (downloadedFiles[resource.id]) {
      openResource(resource);
      return;
    }

    // Start download (native platforms only)
    if (!FileSystem) {
      // Fallback for when FileSystem is not available
      Linking.openURL(resource.url);
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}resources/${resource.id}.pdf`;

    try {
      // Show progress
      setDownloadProgress(prev => ({
        ...prev,
        [resource.id]: 0
      }));

      // In a real app, this would be the actual URL
      // For this mock, we'll simulate a download
      setTimeout(() => {
        setDownloadProgress(prev => ({
          ...prev,
          [resource.id]: 100
        }));

        setDownloadedFiles(prev => ({
          ...prev,
          [resource.id]: true
        }));

        // Simulate that the file is now available
        openResource(resource);
      }, 2000);

      // In a real implementation, you would use FileSystem.downloadAsync:
      /*
      const downloadResumable = FileSystem.createDownloadResumable(
        resource.url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite * 100;
          setDownloadProgress(prev => ({
            ...prev,
            [resource.id]: progress
          }));
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (uri) {
        setDownloadedFiles(prev => ({
          ...prev,
          [resource.id]: true
        }));
        openResource(resource);
      }
      */
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Failed', 'There was an error downloading this resource. Please try again.');
      setDownloadProgress(prev => ({
        ...prev,
        [resource.id]: 0
      }));
    }
  };

  const openResource = (resource) => {
    if (Platform.OS === 'web') {
      // Open in new tab for web
      window.open(resource.url, '_blank');
    } else {
      // Navigate to PDF viewer for native
      router.push(`/pdf-viewer/${resource.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Resources" showBackButton={false} />

      {/* Categories filter */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <StyledText
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </StyledText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resources list */}
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.resourceCard}>
            <TouchableOpacity
              style={styles.resourceContent}
              onPress={() => handleDownload(item)}
            >
              <View style={[styles.resourceIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={24} color="#FFFFFF" />
              </View>

              <View style={styles.resourceInfo}>
                <StyledText type="subheading">{item.title}</StyledText>

                <View style={styles.resourceMeta}>
                  <View style={styles.resourceBadge}>
                    <StyledText style={styles.badgeText}>{item.category}</StyledText>
                  </View>
                  <StyledText type="caption" style={styles.resourceType}>
                    {item.type} • {item.size}
                  </StyledText>
                </View>

                <StyledText type="caption" style={styles.lastUpdated}>
                  Last updated: {item.lastUpdated}
                </StyledText>
              </View>

              <View style={styles.downloadButton}>
                {downloadProgress[item.id] > 0 && downloadProgress[item.id] < 100 ? (
                  <View style={styles.progressContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${downloadProgress[item.id]}%` }
                      ]}
                    />
                  </View>
                ) : (
                  <Ionicons
                    name={
                      Platform.OS === 'web'
                        ? "open-outline"
                        : downloadedFiles[item.id]
                          ? "open-outline"
                          : "download-outline"
                    }
                    size={24}
                    color={COLORS.primary}
                  />
                )}
              </View>
            </TouchableOpacity>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.text_tertiary} />
            <StyledText type="subheading" style={styles.emptyText}>
              No resources found
            </StyledText>
          </View>
        }
      />

      {!isOnline && Platform.OS !== 'web' && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={20} color="#FFFFFF" />
          <StyledText color="#FFFFFF" style={styles.offlineText}>
            You are offline. Only downloaded resources are available.
          </StyledText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 50,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.text_secondary,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.lg,
  },
  resourceCard: {
    marginBottom: SPACING.md,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resourceBadge: {
    backgroundColor: COLORS.stateActive,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resourceType: {
    color: COLORS.text_secondary,
  },
  lastUpdated: {
    marginTop: 4,
    color: COLORS.text_tertiary,
  },
  downloadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    color: COLORS.text_tertiary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  offlineBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  offlineText: {
    marginLeft: SPACING.sm,
  },
});
