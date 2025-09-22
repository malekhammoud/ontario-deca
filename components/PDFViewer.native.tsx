import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Ionicons } from '@expo/vector-icons';
import { StyledText } from '@/components/ui/StyledText';
import { COLORS, SPACING } from '@/constants/colors';

interface NativePDFViewerProps {
  resource: {
    title: string;
    url: string;
  };
  onShare: () => void;
  showControls: boolean;
  onToggleControls: () => void;
}

export const NativePDFViewer: React.FC<NativePDFViewerProps> = ({
  resource,
  onShare,
  showControls,
  onToggleControls,
}) => {
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const source = { uri: resource.url, cache: true };

  const handlePageChanged = (page: number, numberOfPages: number) => {
    setPageNumber(page);
    setTotalPages(numberOfPages);
  };

  const openInBrowser = () => {
    Linking.openURL(resource.url);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.documentContainer}
        activeOpacity={1}
        onPress={onToggleControls}
      >
        <Pdf
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {
            setLoading(false);
            setTotalPages(numberOfPages);
          }}
          onPageChanged={handlePageChanged}
          onError={(error) => {
            console.log(error);
            setLoading(false);
          }}
          onPressLink={(uri) => {
            Linking.openURL(uri);
          }}
          style={styles.pdf}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <StyledText style={styles.loadingText}>Loading document...</StyledText>
          </View>
        )}
      </TouchableOpacity>

      {showControls && (
        <View style={styles.controls}>
          <View style={styles.pageIndicator}>
            <StyledText style={styles.pageText}>
              Page {pageNumber} of {totalPages}
            </StyledText>
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton} onPress={onShare}>
              <Ionicons name="share-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={() => {}}>
              <Ionicons name="bookmark-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={openInBrowser}>
              <Ionicons name="open-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  documentContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text_secondary,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  pageIndicator: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  pageText: {
    fontSize: 14,
    color: COLORS.text_secondary,
  },
  controlButtons: {
    flexDirection: 'row',
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
});
