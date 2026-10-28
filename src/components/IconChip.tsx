import React from 'react';
import {Animated, Image, ImageSourcePropType, Pressable, StyleSheet} from 'react-native';
import {COLORS, RADIUS} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

import type {IconCmp} from './icon';

interface IconChipProps {
  onPress: () => void;
  label: string;
  Icon?: IconCmp;
  image?: ImageSourcePropType;
  tint?: string;
}

const SIZE = 44;

/** 44x44 square header control. Explicit width AND height, plus hitSlop. */
function IconChipBase({onPress, label, Icon, image, tint}: IconChipProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.92);
  const color = tint ?? COLORS.textSecondary;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chip, {transform: [{scale}]}]}>
        {Icon ? <Icon size={22} strokeWidth={1.5} color={color} /> : null}
        {!Icon && image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: SIZE, height: SIZE},
  chip: {
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS.chip,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {width: 22, height: 22},
});

export const IconChip = React.memo(IconChipBase);
export default IconChip;
