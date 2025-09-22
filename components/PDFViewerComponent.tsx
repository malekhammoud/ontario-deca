import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Share,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '@/components/ui/StyledText';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/colors';

interface PDFViewerComponentProps {
  resource: {
    title: string;
    url: string;
  };
  onShare: () => void;
  showControls: boolean;
  onToggleControls: () => void;
}

export const PDFViewerComponent: React.FC<PDFViewerComponentProps> = ({
  resource,
  onShare,
  showControls,
  onToggleControls,
}) => {
  const openInBrowser = () => {
    if (Platform.OS === 'web') {
      window.open(resource.url, '_blank');
    } else {
      Linking.openURL(resource.url);
    }
  };

  // Always show web fallback to avoid any native imports
  return (
    <View style={styles.webFallbackContainer}>
      <Ionicons name="document-text" size={80} color={COLORS.primary} />
      <StyledText type="heading3" style={styles.webFallbackTitle}>
        PDF Viewer
      </StyledText>
      <StyledText style={styles.webFallbackDescription}>
        {Platform.OS === 'web'
          ? 'Click the button below to open the document in a new tab.'
          : 'Click the button below to open the document in your default PDF viewer.'
        }
      </StyledText>

      <Button
        label="Open PDF"
        variant="primary"
        leftIcon={<Ionicons name="open-outline" size={18} color="#FFFFFF" />}
        onPress={openInBrowser}
        style={styles.openButton}
      />

      <Button
        label="Share Document"
        variant="outline"
        leftIcon={<Ionicons name="share-outline" size={18} color={COLORS.primary} />}
        onPress={onShare}
        style={styles.shareButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  webFallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  webFallbackTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  webFallbackDescription: {
    textAlign: 'center',
    color: COLORS.text_secondary,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  openButton: {
    marginBottom: SPACING.md,
    minWidth: 200,
  },
  shareButton: {
    minWidth: 200,
  },
});
