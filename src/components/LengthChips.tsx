import React, {useCallback} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {SESSION_LENGTHS, SessionLengthKey} from '../constants/config';
import {COLORS, RADIUS} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface LengthChipsProps {
  value: SessionLengthKey;
  onChange: (key: SessionLengthKey) => void;
}

interface ChipProps {
  label: string;
  chipKey: SessionLengthKey;
  active: boolean;
  onChange: (key: SessionLengthKey) => void;
}

const HEIGHT = 40;

function Chip({label, chipKey, active, onChange}: ChipProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.95);
  const handlePress = useCallback(() => onChange(chipKey), [onChange, chipKey]);
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityState={{selected: active}}
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chip, active ? styles.chipActive : null, {transform: [{scale}]}]}>
        <Text
          style={[styles.label, active ? styles.labelActive : null]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function LengthChipsBase({value, onChange}: LengthChipsProps) {
  return (
    <View style={styles.row}>
      {SESSION_LENGTHS.map(len => (
        <View key={len.key} style={styles.slot}>
          <Chip
            label={len.label}
            chipKey={len.key}
            active={len.key === value}
            onChange={onChange}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 10},
  slot: {flex: 1},
  press: {width: '100%', height: HEIGHT},
  chip: {
    width: '100%',
    height: HEIGHT,
    borderRadius: RADIUS.chip,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(79,124,255,0.10)',
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.textSecondary,
  },
  labelActive: {color: COLORS.primary, fontWeight: '700'},
});

export const LengthChips = React.memo(LengthChipsBase);
export default LengthChips;
