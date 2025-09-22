import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  StatusBar
} from 'react-native';
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

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === COLORS.primary ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor },
          !safeAreaTop && styles.noSafeAreaTop,
          !safeAreaBottom && styles.noSafeAreaBottom
        ]}
      >
        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {wrappedContent}
          </KeyboardAvoidingView>
        ) : (
          wrappedContent
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  noSafeAreaTop: {
    paddingTop: 0,
  },
  noSafeAreaBottom: {
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
