import React from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface SecondaryPillProps {
  label: string;
  onPress: () => void;
  height?: number;
  style?: StyleProp<ViewStyle>;
  tone?: 'soft' | 'mint';
}

/** Plain-text soft pill. No icon on purpose — a crooked glyph is worse. */
function SecondaryPillBase({
  label,
  onPress,
  height = 48,
  style,
  tone = 'soft',
}: SecondaryPillProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.95);
  const mint = tone === 'mint';
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, {height}, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.pill,
          {height, transform: [{scale}]},
          mint ? styles.pillMint : null,
        ]}>
        <Text
          style={[styles.label, mint ? styles.labelMint : null]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%'},
  pill: {
    width: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillMint: {
    backgroundColor: 'rgba(143,216,199,0.18)',
    borderColor: COLORS.accent,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
  },
  labelMint: {color: COLORS.accentDeep},
});

export const SecondaryPill = React.memo(SecondaryPillBase);
export default SecondaryPill;
