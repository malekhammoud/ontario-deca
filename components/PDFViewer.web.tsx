import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '@/components/ui/StyledText';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/colors';

interface WebPDFViewerProps {
  resource: {
    title: string;
    url: string;
  };
  onShare: () => void;
  onOpenInBrowser: () => void;
}

export const WebPDFViewer: React.FC<WebPDFViewerProps> = ({
  resource,
  onShare,
  onOpenInBrowser,
}) => {
  return (
    <View style={styles.webFallbackContainer}>
      <Ionicons name="document-text" size={80} color={COLORS.primary} />
      <StyledText type="heading3" style={styles.webFallbackTitle}>
        PDF Viewer
      </StyledText>
      <StyledText style={styles.webFallbackDescription}>
        PDF viewing is not available in the web version. Click the button below to open the document in a new tab.
      </StyledText>

      <Button
        label="Open PDF in Browser"
        variant="primary"
        leftIcon={<Ionicons name="open-outline" size={18} color="#FFFFFF" />}
        onPress={onOpenInBrowser}
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
