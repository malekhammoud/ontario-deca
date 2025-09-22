import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '@/constants/colors';

type TextType = 'heading1' | 'heading2' | 'heading3' | 'subheading' | 'body' | 'bodyBold' | 'caption' | 'button' | 'link';

interface StyledTextProps extends TextProps {
  type?: TextType;
  color?: string;
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  type = 'body',
  color,
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[type],
        color ? { color } : {},
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    ...FONTS.body,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  heading1: {
    ...FONTS.heading,
    fontSize: FONT_SIZES['3xl'],
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  heading2: {
    ...FONTS.heading,
    fontSize: FONT_SIZES['2xl'],
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  heading3: {
    ...FONTS.heading,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  subheading: {
    ...FONTS.subheading,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  body: {
    ...FONTS.body,
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * 1.5,
    color: COLORS.text,
  },
  bodyBold: {
    ...FONTS.body,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
    lineHeight: FONT_SIZES.md * 1.5,
    color: COLORS.text,
  },
  caption: {
    ...FONTS.caption,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text_secondary,
  },
  button: {
    ...FONTS.button,
    fontSize: FONT_SIZES.md,
    letterSpacing: 0.5,
    color: COLORS.primary,
  },
  link: {
    ...FONTS.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
