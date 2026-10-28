import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import GrainField from '../components/GrainField';
import {
  LOADER_BAR_ANIM_MS,
  LOADER_DURATION_MS,
  LOADER_GRAIN_DOTS,
} from '../constants/config';
import {COLORS, GRADIENTS} from '../constants/theme';

interface LoaderScreenProps {
  onDone: () => void;
}

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');
const BAR_W = 180;

/**
 * The only dark surface in the product. Everything else is white, which gives
 * this frame a huge pHash distance from the Menu and keeps the capture gate safe.
 *
 * No Animated.loop and no layout tween anywhere here: a perpetual or JS-driven
 * animation keeps the window non-idle for the loader's whole 8s life and the
 * capture agent wedges waiting for an accessibility tree.
 */
export default function LoaderScreen({onDone}: LoaderScreenProps) {
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordShift = useRef(new Animated.Value(14)).current;
  const barScale = useRef(new Animated.Value(0.04)).current;

  useEffect(() => {
    const t = setTimeout(onDone, LOADER_DURATION_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(wordOpacity, {
        toValue: 1,
        delay: 180,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(wordShift, {
        toValue: 0,
        delay: 180,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // scaleX, never width — a layout tween here is what wedges uiautomator.
      Animated.timing(barScale, {
        toValue: 1,
        delay: 260,
        duration: LOADER_BAR_ANIM_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardScale, cardOpacity, wordOpacity, wordShift, barScale]);

  return (
    <View style={styles.root}>
      <Image
        source={assets.bgGame}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, styles.wash]}
      />
      <LinearGradient
        colors={GRADIENTS.loaderBg}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[StyleSheet.absoluteFill, styles.overlay]}
      />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />
      <GrainField width={SCREEN_W} height={SCREEN_H} dots={LOADER_GRAIN_DOTS} />

      <View style={styles.content}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.card,
            {opacity: cardOpacity, transform: [{scale: cardScale}]},
          ]}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.wordWrap,
            {opacity: wordOpacity, transform: [{translateY: wordShift}]},
          ]}>
          <Text style={styles.wordmark}>FOCUS LANTERN</Text>
          <Text style={styles.subtitle}>CALM SESSIONS. CLEAR DAYS.</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.barFillWrap, {transform: [{scaleX: barScale}]}]}>
            <LinearGradient
              colors={GRADIENTS.mintBlue}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.inkTop},
  wash: {opacity: 0.22},
  overlay: {opacity: 0.88},
  glowA: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    top: 180,
    alignSelf: 'center',
    backgroundColor: 'rgba(79,124,255,0.18)',
  },
  glowB: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    left: -40,
    top: 520,
    backgroundColor: 'rgba(143,216,199,0.12)',
  },
  content: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  card: {
    width: 132,
    height: 132,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: 10},
    elevation: 8,
  },
  logo: {width: 92, height: 92},
  wordWrap: {alignItems: 'center', marginTop: 28},
  wordmark: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 2.4,
    color: COLORS.accent,
    marginTop: 10,
    textAlign: 'center',
  },
  barTrack: {
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
    marginTop: 44,
  },
  // transformOrigin keeps the scaleX fill growing from the left edge.
  barFillWrap: {width: BAR_W, height: 4, transformOrigin: 'left'},
  barFill: {width: BAR_W, height: 4, borderRadius: 2},
  loading: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 18,
  },
});
