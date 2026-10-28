import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Check, Clock, Flame, Lightbulb, RotateCcw} from 'lucide-react-native';
import assets from '../assets';
import IconChip from '../components/IconChip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryPill from '../components/SecondaryPill';
import {StatItem, StatRow} from '../components/StatCard';
import {COUNT_UP_MS, GLOW_MS, GOAL_BAR_MS} from '../constants/config';
import {COLORS, GRADIENTS, RADIUS, SHADOW} from '../constants/theme';
import {SessionResult} from '../game/session';
import {Stats} from '../game/store';
import useCountUp from '../hooks/useCountUp';
import {clamp01, goalLabel, minutesLabel} from '../utils/format';

interface GameOverScreenProps {
  result: SessionResult;
  stats: Stats;
  onPlayAgain: () => void;
  onMenu: () => void;
}

/**
 * The result screen. Warmer and bluer than both Menu and Game so all four
 * captured frames stay pHash-distinct.
 */
export default function GameOverScreen({
  result,
  stats,
  onPlayAgain,
  onMenu,
}: GameOverScreenProps) {
  const badgeScale = useRef(new Animated.Value(0.8)).current;
  const glow = useRef(new Animated.Value(0.2)).current;
  const barScale = useRef(new Animated.Value(0)).current;

  const goalRatio = clamp01(
    stats.goalMinutes > 0 ? stats.todayMinutes / stats.goalMinutes : 0,
  );

  const countedMinutes = useCountUp(result.minutes, COUNT_UP_MS);
  const countedSessions = useCountUp(stats.sessionsToday, COUNT_UP_MS);
  const countedStreak = useCountUp(stats.streak, COUNT_UP_MS);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(badgeScale, {
        toValue: 1,
        tension: 46,
        friction: 7,
        useNativeDriver: true,
      }),
      // A single pulse, never Animated.loop: a perpetual animation keeps the
      // window non-idle and uiautomator never returns an accessibility tree.
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 0.45,
          duration: GLOW_MS / 2,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.2,
          duration: GLOW_MS / 2,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(barScale, {
        toValue: goalRatio,
        duration: GOAL_BAR_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [badgeScale, glow, barScale, goalRatio]);

  const statItems: StatItem[] = useMemo(
    () => [
      {
        key: 'minutes',
        Icon: Clock,
        value: minutesLabel(countedMinutes),
        label: 'THIS SESSION',
        valueColor: COLORS.primary,
      },
      {
        key: 'sessions',
        Icon: Check,
        value: `${countedSessions} TODAY`,
        label: 'SESSIONS',
        valueColor: COLORS.accentDeep,
      },
      {
        key: 'streak',
        Icon: Flame,
        value: `${countedStreak} STREAK`,
        label: 'DAYS IN A ROW',
        valueColor: COLORS.text,
      },
    ],
    [countedMinutes, countedSessions, countedStreak],
  );

  const goalText = `${goalLabel(
    stats.todayMinutes,
    stats.goalMinutes,
  )} TOWARD THE DAILY GOAL`;

  return (
    <View style={styles.root}>
      <ScreenHeader
        eyebrow="FOCUS LANTERN"
        title="Session summary"
        align="center"
        leftSlot={
          <IconChip
            onPress={onMenu}
            label="Back to hub"
            image={assets.iconHome}
          />
        }
      />

      <View style={styles.body}>
        <View style={styles.badgeWrap}>
          <Animated.View
            pointerEvents="none"
            style={[styles.glow, {opacity: glow}]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.badgeAnim, {transform: [{scale: badgeScale}]}]}>
            <LinearGradient
              colors={GRADIENTS.mintBlue}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.badge}>
              <Image
                source={assets.logo}
                style={styles.badgeLogo}
                resizeMode="contain"
              />
            </LinearGradient>
          </Animated.View>
        </View>

        <Text style={styles.title}>SESSION COMPLETE</Text>
        <Text style={styles.subtitle}>ONE MORE LANTERN LIT TODAY</Text>

        <View style={styles.card}>
          <Image
            source={assets.sprite4}
            style={styles.cardSpriteA}
            resizeMode="contain"
          />
          <Image
            source={assets.sprite5}
            style={styles.cardSpriteB}
            resizeMode="contain"
          />
          <StatRow items={statItems} />

          <View style={styles.goalTrack}>
            <Animated.View
              pointerEvents="none"
              style={[styles.goalFillWrap, {transform: [{scaleX: barScale}]}]}>
              <LinearGradient
                colors={GRADIENTS.mintBlue}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.goalFill}
              />
            </Animated.View>
          </View>
          <Text style={styles.goalLabel}>{goalText}</Text>
        </View>

        <View style={styles.tipRow}>
          <View style={styles.tipIcon}>
            <Lightbulb size={22} strokeWidth={1.5} color={COLORS.accentDeep} />
          </View>
          <Text style={styles.tipText} numberOfLines={2}>
            SHORT BREAKS KEEP THE STREAK ALIVE
          </Text>
        </View>

        <View style={styles.spacer} />

        <PrimaryButton
          label="START AGAIN"
          onPress={onPlayAgain}
          Icon={RotateCcw}
        />

        <View style={styles.menuWrap}>
          <SecondaryPill label="MENU" onPress={onMenu} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  badgeWrap: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.accent,
  },
  badgeAnim: {width: 104, height: 104},
  badge: {
    width: 104,
    height: 104,
    borderRadius: RADIUS.badge,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.badge,
  },
  badgeLogo: {width: 64, height: 64},
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  // Positive offsets only — a negative one would poke out of the rounded corner.
  cardSpriteA: {
    position: 'absolute',
    width: 52,
    height: 52,
    right: 10,
    top: 10,
    opacity: 0.35,
  },
  cardSpriteB: {
    position: 'absolute',
    width: 46,
    height: 46,
    left: 10,
    bottom: 10,
    opacity: 0.3,
  },
  goalTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.trackFill,
    overflow: 'hidden',
    marginTop: 16,
  },
  goalFillWrap: {width: '100%', height: 6, transformOrigin: 'left'},
  goalFill: {width: '100%', height: 6, borderRadius: 3},
  goalLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  tipRow: {
    width: '100%',
    height: 56,
    marginTop: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(143,216,199,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
  },
  spacer: {flex: 1, minHeight: 16},
  menuWrap: {width: '100%', marginTop: 18},
});
