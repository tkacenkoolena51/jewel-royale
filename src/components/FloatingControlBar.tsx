import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, GRADIENTS, RADIUS, SHADOW} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface FloatingControlBarProps {
  paused: boolean;
  onTogglePause: () => void;
  onFinish: () => void;
}

const BAR_H = 64;
const BTN_H = 48;

/**
 * G2 floating controls. `bottom: 96` is deliberate — it parks FINISH SESSION
 * inside the deterministic sweep band so the result frame is always reachable.
 * Both buttons are plain text: no icon means no icon to misalign.
 */
function FloatingControlBarBase({
  paused,
  onTogglePause,
  onFinish,
}: FloatingControlBarProps) {
  const pauseScale = usePressScale(0.95);
  const finishScale = usePressScale(0.96);

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onTogglePause}
        onPressIn={pauseScale.onPressIn}
        onPressOut={pauseScale.onPressOut}
        hitSlop={{top: 12, bottom: 12, left: 8, right: 8}}
        accessibilityRole="button"
        accessibilityLabel={paused ? 'Resume' : 'Pause'}
        style={styles.pausePress}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.pauseBtn, {transform: [{scale: pauseScale.scale}]}]}>
          <Text style={styles.pauseLabel} numberOfLines={1}>
            {paused ? 'RESUME' : 'PAUSE'}
          </Text>
        </Animated.View>
      </Pressable>

      <Pressable
        onPress={onFinish}
        onPressIn={finishScale.onPressIn}
        onPressOut={finishScale.onPressOut}
        hitSlop={{top: 12, bottom: 12, left: 8, right: 8}}
        accessibilityRole="button"
        accessibilityLabel="Finish session"
        style={styles.finishPress}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.finishWrap, {transform: [{scale: finishScale.scale}]}]}>
          <LinearGradient
            colors={GRADIENTS.cta}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.finishGrad}>
            <Text style={styles.finishLabel} numberOfLines={1}>
              FINISH SESSION
            </Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    height: BAR_H,
    borderRadius: RADIUS.card,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 12,
    ...SHADOW.bar,
  },
  pausePress: {flex: 0.8, height: BTN_H},
  pauseBtn: {
    width: '100%',
    height: BTN_H,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textSecondary,
  },
  finishPress: {flex: 1.2, height: BTN_H},
  finishWrap: {width: '100%', height: BTN_H, borderRadius: RADIUS.pill},
  finishGrad: {
    width: '100%',
    height: BTN_H,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
  },
});

export const FloatingControlBar = React.memo(FloatingControlBarBase);
export default FloatingControlBar;
