import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, DESIGN_SYSTEM, SPACING } from '@/constants/colors';

type CardVariant = 'default' | 'elevated' | 'flat';

interface CardProps extends ViewProps {
  variant?: CardVariant;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padded = true,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles[variant],
        !padded && styles.noPadding,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    ...DESIGN_SYSTEM.card.default,
  },
  elevated: {
    ...DESIGN_SYSTEM.card.elevated,
  },
  flat: {
    ...DESIGN_SYSTEM.card.flat,
  },
  noPadding: {
    padding: 0,
  },
});
