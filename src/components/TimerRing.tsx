import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {COLORS} from '../constants/theme';
import {clamp01, mmss} from '../utils/format';

interface TimerRingProps {
  size: number;
  progress: number;
  remainingSec: number;
  paused: boolean;
}

const STROKE = 14;

/**
 * Dual SVG ring. The progress arc is recomputed from the 1s state tick —
 * there is no continuous tween driving it.
 */
function TimerRingBase({size, progress, remainingSec, paused}: TimerRingProps) {
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const p = clamp01(progress);
  const innerR = Math.max(10, r - 16);
  const half = size / 2;

  return (
    <View style={[styles.wrap, {width: size, height: size}]}>
      <Svg width={size} height={size}>
        <Circle
          cx={half}
          cy={half}
          r={r}
          stroke={COLORS.trackFill}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={half}
          cy={half}
          r={innerR}
          stroke={COLORS.accent}
          strokeWidth={3}
          strokeOpacity={0.45}
          fill="none"
        />
        <Circle
          cx={half}
          cy={half}
          r={r}
          stroke={paused ? COLORS.primaryDim : COLORS.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${half} ${half})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.clock, paused ? styles.clockPaused : null]}>
          {mmss(remainingSec)}
        </Text>
        <Text style={styles.caption}>REMAINING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    fontSize: 54,
    lineHeight: 62,
    fontWeight: '800',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  clockPaused: {color: COLORS.textSecondary},
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 2.6,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export const TimerRing = React.memo(TimerRingBase);
export default TimerRing;
