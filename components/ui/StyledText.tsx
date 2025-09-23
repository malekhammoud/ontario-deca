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
    fontFamily: 'System',
    fontWeight: '400',
    color: COLORS?.text || '#0F172A',
    fontSize: FONT_SIZES?.md || 16,
  },
  heading1: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: FONT_SIZES?.xxxl || 28,
    letterSpacing: -0.5,
    color: COLORS?.text || '#0F172A',
  },
  heading2: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: FONT_SIZES?.xxl || 24,
    letterSpacing: -0.5,
    color: COLORS?.text || '#0F172A',
  },
  heading3: {
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: FONT_SIZES?.xl || 20,
    color: COLORS?.text || '#0F172A',
  },
  subheading: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: FONT_SIZES?.lg || 18,
    color: COLORS?.text || '#0F172A',
  },
  body: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: FONT_SIZES?.md || 16,
    lineHeight: (FONT_SIZES?.md || 16) * 1.5,
    color: COLORS?.text || '#0F172A',
  },
  bodyBold: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: FONT_SIZES?.md || 16,
    lineHeight: (FONT_SIZES?.md || 16) * 1.5,
    color: COLORS?.text || '#0F172A',
  },
  caption: {
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: FONT_SIZES?.sm || 14,
    color: COLORS?.text_secondary || '#475569',
  },
  button: {
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: FONT_SIZES?.md || 16,
    letterSpacing: 0.5,
    color: COLORS?.primary || '#00539E',
  },
  link: {
    fontFamily: 'System',
    fontWeight: '400',
    fontSize: FONT_SIZES?.md || 16,
    color: COLORS?.primary || '#00539E',
    textDecorationLine: 'underline',
  },
});
