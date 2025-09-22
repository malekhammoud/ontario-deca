import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Share,
  Linking
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Header } from '@/components/ui/Header';
import { PDFViewerComponent } from '@/components/PDFViewerComponent';
import { COLORS } from '@/constants/colors';

// Sample mock data - in a real app, this would come from a database or API
const RESOURCES = {
  '1': {
    title: 'Business Management Case Study',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '2': {
    title: 'Marketing Strategies Guide',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '3': {
    title: 'Finance Competition Rules',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '4': {
    title: 'Hospitality Services Overview',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '5': {
    title: 'Presentation Skills Workshop',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '6': {
    title: 'Networking Tips and Strategies',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  '7': {
    title: 'Event Schedule and Maps',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
};

export default function PDFViewerScreen() {
  const { id } = useLocalSearchParams();
  const [showControls, setShowControls] = useState(true);

  // Get resource info from ID
  const resource = RESOURCES[id] || {
    title: 'Document',
    filePath: '',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this resource from DECA Provincials: ${resource.title}`,
        url: resource.url,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the document');
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <View style={styles.container}>
      <Header
        title={resource.title}
        backgroundColor={COLORS.primary}
        textColor="#FFFFFF"
      />

      <PDFViewerComponent
        resource={resource}
        onShare={handleShare}
        showControls={showControls}
        onToggleControls={toggleControls}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
