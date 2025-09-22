import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = true,
  keyboardAvoiding = false,
  style,
  backgroundColor = COLORS.background,
  safeAreaTop = true,
  safeAreaBottom = true
}) => {
  const content = (
    <View style={[styles.container, { backgroundColor }, style]}>
      {children}
    </View>
  );

  const wrappedContent = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const keyboardAvoidingContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {wrappedContent}
    </KeyboardAvoidingView>
  ) : (
    wrappedContent
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={[
        ...(safeAreaTop ? ['top'] : []),
        ...(safeAreaBottom ? ['bottom'] : [])
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {keyboardAvoidingContent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
