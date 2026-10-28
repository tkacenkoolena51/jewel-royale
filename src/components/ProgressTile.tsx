import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GRADIENTS, COLORS} from '../constants/theme';
import {WEEK_LETTERS} from '../constants/config';
import BentoTile from './BentoTile';

interface ProgressTileProps {
  week: number[];
  deltaPct: number;
  height: number;
}

const MIN_BAR = 26;
const MAX_BAR = 60;

/** 7 static bars — heights are laid out, never animated. */
function ProgressTileBase({week, deltaPct, height}: ProgressTileProps) {
  const peak = Math.max(1, ...week);
  const todayIndex = week.length - 1;
  return (
    <BentoTile style={[styles.tile, {height}]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>THIS WEEK</Text>
        {deltaPct > 0 ? (
          <View style={styles.deltaPill}>
            <Text style={styles.deltaText}>{`+${deltaPct}%`}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.bars}>
        {week.map((minutes, i) => {
          const h = MIN_BAR + Math.round((minutes / peak) * (MAX_BAR - MIN_BAR));
          const isToday = i === todayIndex;
          return (
            <View key={WEEK_LETTERS[i] + String(i)} style={styles.barCol}>
              <View style={styles.barSlot}>
                {isToday ? (
                  <LinearGradient
                    colors={GRADIENTS.mintBlue}
                    start={{x: 0, y: 1}}
                    end={{x: 0, y: 0}}
                    style={[styles.bar, {height: h}]}
                  />
                ) : (
                  <View style={[styles.bar, styles.barIdle, {height: h}]} />
                )}
              </View>
              <Text style={styles.day}>{WEEK_LETTERS[i]}</Text>
            </View>
          );
        })}
      </View>
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  tile: {justifyContent: 'space-between'},
  titleRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  title: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: COLORS.textMuted,
  },
  deltaPill: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(143,216,199,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deltaText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: COLORS.accentDeep,
  },
  bars: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'},
  barCol: {alignItems: 'center', width: 30},
  barSlot: {height: MAX_BAR, justifyContent: 'flex-end'},
  bar: {width: 22, borderRadius: 7},
  barIdle: {backgroundColor: COLORS.trackFill},
  day: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 6,
  },
});

export const ProgressTile = React.memo(ProgressTileBase);
export default ProgressTile;
