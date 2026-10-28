import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GRADIENTS, RADIUS, SHADOW} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

import type {IconCmp} from './icon';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  Icon?: IconCmp;
  height?: number;
}

/**
 * Pressable OUTSIDE, Animated.View INSIDE (box-none so the press still lands).
 * Icon box is a fixed 24x24 and the label lineHeight matches it exactly.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  height = 72,
}: PrimaryButtonProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 20, bottom: 20, left: 12, right: 12}}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, {height}]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, {height, transform: [{scale}]}]}>
        <LinearGradient
          colors={GRADIENTS.cta}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.grad, {height}]}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={24} strokeWidth={2} color="#FFFFFF" />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%', borderRadius: RADIUS.card, ...SHADOW.cta},
  wrap: {width: '100%', borderRadius: RADIUS.card},
  grad: {
    width: '100%',
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: '#FFFFFF',
  },
});

export const PrimaryButton = React.memo(PrimaryButtonBase);
export default PrimaryButton;
