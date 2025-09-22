import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyledText } from './StyledText';
import { COLORS, SPACING } from '@/constants/colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = true,
  rightComponent,
  backgroundColor = COLORS.primary,
  textColor = '#FFFFFF',
  onBackPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor },
      { paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0 }
    ]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={handleBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={28} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <StyledText 
            type="subheading" 
            color={textColor} 
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </StyledText>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftContainer: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
  },
  backButton: {
    padding: 4,
  },
});
