import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const triggerHaptic = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Animated.View style={animatedStyle}>
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 300,
          });
          opacity.value = withTiming(0.8, { duration: 100 });

          runOnJS(triggerHaptic)();
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          scale.value = withSpring(1, {
            damping: 15,
            stiffness: 300,
          });
          opacity.value = withTiming(1, { duration: 100 });

          props.onPressOut?.(ev);
        }}
      />
    </Animated.View>
  );
}
