import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Flame} from 'lucide-react-native';
import {COLORS, RADIUS} from '../constants/theme';
import BentoTile from './BentoTile';

interface StreakTileProps {
  days: number;
  height: number;
}

function StreakTileBase({days, height}: StreakTileProps) {
  if (days <= 0) {
    return null;
  }
  return (
    <BentoTile style={[styles.tile, {height}]}>
      <View style={styles.iconWrap}>
        <Flame size={22} strokeWidth={1.5} color={COLORS.accentDeep} />
      </View>
      <Text style={styles.value}>{days}</Text>
      <Text style={styles.label}>DAY STREAK</Text>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  tile: {alignItems: 'center', justifyContent: 'center'},
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.chip,
    backgroundColor: 'rgba(143,216,199,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: COLORS.textMuted,
  },
});

export const StreakTile = React.memo(StreakTileBase);
export default StreakTile;
