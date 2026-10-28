import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {COLORS} from '../constants/theme';
import {clamp01, goalLabel} from '../utils/format';
import BentoTile from './BentoTile';

interface GoalTileProps {
  done: number;
  goal: number;
  height: number;
}

const SIZE = 76;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/** Mint ring + "x of y min". The brief's Daily Goal screen as one bento tile. */
function GoalTileBase({done, goal, height}: GoalTileProps) {
  const p = clamp01(goal > 0 ? done / goal : 0);
  return (
    <BentoTile style={[styles.tile, {height}]}>
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={COLORS.trackFill}
            strokeWidth={STROKE}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={COLORS.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${C} ${C}`}
            strokeDashoffset={C * (1 - p)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <View style={styles.ringCenter} pointerEvents="none">
          <Text style={styles.ringValue}>{Math.round(done)}</Text>
        </View>
      </View>
      <Text style={styles.caption}>TODAY'S GOAL</Text>
      <Text style={styles.detail}>{goalLabel(done, goal)}</Text>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  tile: {alignItems: 'center', justifyContent: 'center'},
  ringWrap: {width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center'},
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {fontSize: 18, lineHeight: 24, fontWeight: '800', color: COLORS.primary},
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  detail: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export const GoalTile = React.memo(GoalTileBase);
export default GoalTile;
