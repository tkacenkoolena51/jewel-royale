import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {Play, Settings} from 'lucide-react-native';
import GoalTile from '../components/GoalTile';
import HistoryStrip from '../components/HistoryStrip';
import IconChip from '../components/IconChip';
import InfoSheet, {InfoLine} from '../components/InfoSheet';
import LengthChips from '../components/LengthChips';
import PrimaryButton from '../components/PrimaryButton';
import ProgressTile from '../components/ProgressTile';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryPill from '../components/SecondaryPill';
import SettingsSheet from '../components/SettingsSheet';
import StreakTile from '../components/StreakTile';
import {
  HEADER_FADE_MS,
  SessionLengthKey,
  TILE_STAGGER_MS,
  WEEK_DELTA_PCT,
} from '../constants/config';
import {COLORS} from '../constants/theme';
import {Stats} from '../game/store';
import {resolveLength} from '../game/session';
import {minutesLabel} from '../utils/format';

interface MenuScreenProps {
  stats: Stats;
  lengthKey: SessionLengthKey;
  onChangeLength: (key: SessionLengthKey) => void;
  onStart: () => void;
}

const ROW_A_H = 148;
const PROGRESS_H = 136;

type SheetKind = 'none' | 'guide' | 'history';

/**
 * M3 Bento-Hub. Progress, Daily Goal, History and Details from the brief all
 * live here as tiles instead of routes — every extra screen file raises the
 * screenshot gate bar.
 *
 * The CTA is anchored bottom-up on purpose: its centre has to land inside the
 * deterministic tap sweep, so nothing above it may push it out of that band.
 */
export default function MenuScreen({
  stats,
  lengthKey,
  onChangeLength,
  onStart,
}: MenuScreenProps) {
  const [sheet, setSheet] = useState<SheetKind>('none');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const tileA = useRef(new Animated.Value(0)).current;
  const tileB = useRef(new Animated.Value(0)).current;
  const tileC = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    const rise = (v: Animated.Value, delay: number) =>
      Animated.timing(v, {
        toValue: 1,
        delay,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: HEADER_FADE_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      rise(tileA, TILE_STAGGER_MS),
      rise(tileB, TILE_STAGGER_MS * 2),
      rise(tileC, TILE_STAGGER_MS * 3),
      Animated.spring(ctaScale, {
        toValue: 1,
        tension: 48,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, tileA, tileB, tileC, ctaScale]);

  const openGuide = useCallback(() => setSheet('guide'), []);
  const openHistory = useCallback(() => setSheet('history'), []);
  const closeSheet = useCallback(() => setSheet('none'), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const guideLines: InfoLine[] = useMemo(
    () => [
      {key: 'g1', label: 'Pick a length', value: '1 / 5 / 15 MIN'},
      {key: 'g2', label: 'Tap the blue tile', value: 'RING BEGINS'},
      {key: 'g3', label: 'Finish any time', value: 'MINUTES COUNT'},
    ],
    [],
  );

  const historyLines: InfoLine[] = useMemo(
    () =>
      stats.history.map(h => ({
        key: h.id,
        label: `${h.tag} · ${h.time}`,
        value: minutesLabel(h.minutes),
      })),
    [stats.history],
  );

  const activeLength = resolveLength(lengthKey);

  const riseStyle = (v: Animated.Value) => ({
    opacity: v,
    transform: [
      {
        translateY: v.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.root}>
      <Animated.View pointerEvents="box-none" style={{opacity: headerOpacity}}>
        <ScreenHeader
          eyebrow="GOOD FOCUS"
          title="Welcome back"
          align="left"
          rightSlot={
            <IconChip
              onPress={openSettings}
              label="Open settings"
              Icon={Settings}
            />
          }
        />
      </Animated.View>

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.rowA, riseStyle(tileA)]}>
          <View style={styles.goalSlot}>
            <GoalTile
              done={stats.todayMinutes}
              goal={stats.goalMinutes}
              height={ROW_A_H}
            />
          </View>
          <View style={styles.streakSlot}>
            <StreakTile days={stats.streak} height={ROW_A_H} />
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.progressWrap, riseStyle(tileB)]}>
          <ProgressTile
            week={stats.week}
            deltaPct={WEEK_DELTA_PCT}
            height={PROGRESS_H}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.historyWrap, riseStyle(tileC)]}>
          <HistoryStrip items={stats.history} />
        </Animated.View>

        <Text style={styles.hint}>
          {`${activeLength.tag} · ONE TAP BEGINS THE RING`}
        </Text>

        <View style={styles.chipsWrap}>
          <LengthChips value={lengthKey} onChange={onChangeLength} />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.ctaWrap, {transform: [{scale: ctaScale}]}]}>
          <PrimaryButton label="START FOCUS" onPress={onStart} Icon={Play} />
        </Animated.View>

        <View style={styles.pillRow}>
          <View style={styles.pillSlot}>
            <SecondaryPill label="QUICK GUIDE" onPress={openGuide} />
          </View>
          <View style={styles.pillSlot}>
            <SecondaryPill label="HISTORY" onPress={openHistory} />
          </View>
        </View>
      </View>

      <InfoSheet
        visible={sheet === 'guide'}
        title="QUICK GUIDE"
        intro="Three steps, nothing else."
        lines={guideLines}
        onClose={closeSheet}
      />
      <InfoSheet
        visible={sheet === 'history'}
        title="HISTORY"
        intro="Your last sessions today."
        lines={historyLines}
        onClose={closeSheet}
      />
      <SettingsSheet visible={settingsOpen} onClose={closeSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  body: {flex: 1, paddingHorizontal: 20, paddingBottom: 24},
  rowA: {flexDirection: 'row', gap: 12},
  goalSlot: {flex: 1.15},
  streakSlot: {flex: 0.85},
  progressWrap: {marginTop: 12},
  historyWrap: {flex: 1, minHeight: 150, marginTop: 12},
  hint: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 14,
  },
  chipsWrap: {marginTop: 10},
  ctaWrap: {marginTop: 14},
  pillRow: {flexDirection: 'row', gap: 10, marginTop: 18},
  pillSlot: {flex: 1},
});
