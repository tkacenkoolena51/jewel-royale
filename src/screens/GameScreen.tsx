import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft, Clock, Flame, Target} from 'lucide-react-native';
import assets from '../assets';
import FloatingControlBar from '../components/FloatingControlBar';
import IconChip from '../components/IconChip';
import ScreenHeader from '../components/ScreenHeader';
import {StatItem, StatRow} from '../components/StatCard';
import TimerRing from '../components/TimerRing';
import {SessionLengthKey} from '../constants/config';
import {COLORS} from '../constants/theme';
import {resolveLength} from '../game/session';
import {Stats} from '../game/store';
import useSessionTimer from '../hooks/useSessionTimer';
import {pctLabel} from '../utils/format';

interface GameScreenProps {
  lengthKey: SessionLengthKey;
  stats: Stats;
  onExit: () => void;
  onFinish: (elapsedSec: number, completed: boolean) => void;
}

const {width: SCREEN_W} = Dimensions.get('window');
const RING = Math.min(SCREEN_W - 96, 300);

/**
 * G2 Floating Controls. The session is the whole canvas; the controls hover
 * over it. Visibly emptier than the Menu so the two captured frames never tie.
 */
export default function GameScreen({
  lengthKey,
  stats,
  onExit,
  onFinish,
}: GameScreenProps) {
  const length = resolveLength(lengthKey);
  const totalSec = length.seconds;

  const ringScale = useRef(new Animated.Value(0.9)).current;
  const finishedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onFinish(totalSec, true);
  }, [onFinish, totalSec]);

  const timer = useSessionTimer(totalSec, handleComplete);

  useEffect(() => {
    Animated.spring(ringScale, {
      toValue: 1,
      tension: 46,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [ringScale]);

  const handleFinishEarly = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    onFinish(timer.elapsedSec, false);
  }, [onFinish, timer.elapsedSec]);

  const statItems: StatItem[] = useMemo(
    () => [
      {
        key: 'done',
        Icon: Target,
        value: pctLabel(timer.elapsedSec, totalSec),
        label: 'DONE',
        valueColor: COLORS.primary,
      },
      {
        key: 'length',
        Icon: Clock,
        value: length.label.replace(/^[A-Z]+\s/, ''),
        label: 'LENGTH',
        valueColor: COLORS.accentDeep,
      },
      {
        key: 'streak',
        Icon: Flame,
        value: String(stats.streak),
        label: 'STREAK',
        valueColor: COLORS.text,
      },
    ],
    [timer.elapsedSec, totalSec, length.label, stats.streak],
  );

  return (
    <View style={styles.root}>
      <ScreenHeader
        eyebrow="FOCUS SESSION"
        title={length.tag}
        align="center"
        divider
        leftSlot={
          <IconChip onPress={onExit} label="Back to hub" Icon={ChevronLeft} />
        }
        rightSlot={
          <IconChip
            onPress={timer.togglePause}
            label={timer.paused ? 'Resume session' : 'Pause session'}
            image={assets.iconPause}
          />
        }
      />

      <Image source={assets.sprite1} style={styles.spriteA} resizeMode="contain" />
      <Image source={assets.sprite2} style={styles.spriteB} resizeMode="contain" />

      <View style={styles.stage}>
        {timer.paused ? (
          <View style={styles.pausedChip}>
            <Text style={styles.pausedText}>SESSION PAUSED</Text>
          </View>
        ) : null}

        <Animated.View
          pointerEvents="none"
          style={{transform: [{scale: ringScale}]}}>
          <TimerRing
            size={RING}
            progress={timer.progress}
            remainingSec={timer.remainingSec}
            paused={timer.paused}
          />
        </Animated.View>

        <View style={styles.statsWrap}>
          <StatRow items={statItems} />
        </View>
      </View>

      <FloatingControlBar
        paused={timer.paused}
        onTogglePause={timer.togglePause}
        onFinish={handleFinishEarly}
      />
      <Text style={styles.caption}>ONE TAP ENDS THE SESSION EARLY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 190,
  },
  statsWrap: {width: '100%', marginTop: 24},
  pausedChip: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(143,216,199,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pausedText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: COLORS.accentDeep,
  },
  spriteA: {
    position: 'absolute',
    width: 84,
    height: 84,
    top: 118,
    right: 22,
    opacity: 0.9,
  },
  spriteB: {
    position: 'absolute',
    width: 64,
    height: 64,
    bottom: 180,
    left: 20,
    opacity: 0.85,
  },
  caption: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 36,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: COLORS.textMuted,
  },
});
