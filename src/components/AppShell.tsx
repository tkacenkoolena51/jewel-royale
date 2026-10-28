import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import {COLORS, GRADIENTS} from '../constants/theme';

export type ShellVariant = 'menu' | 'game' | 'result';

interface AppShellProps {
  variant: ShellVariant;
  children: React.ReactNode;
}

const WASH: {[k in ShellVariant]: number} = {
  menu: 0.06,
  game: 0.05,
  result: 0.06,
};

const GRADIENT: {[k in ShellVariant]: string[]} = {
  menu: GRADIENTS.menuBg,
  game: GRADIENTS.gameBg,
  result: GRADIENTS.resultBg,
};

/**
 * Three depth layers on every light screen: gradient -> bg_game wash -> blobs.
 * Each variant gets its own blob placement so the four captured frames stay
 * pHash-distinct.
 */
function AppShellBase({variant, children}: AppShellProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={GRADIENT[variant]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={assets.bgGame}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, {opacity: WASH[variant]}]}
      />
      {variant === 'menu' ? (
        <View pointerEvents="none" style={styles.menuBlobA} />
      ) : null}
      {variant === 'menu' ? (
        <View pointerEvents="none" style={styles.menuBlobB} />
      ) : null}
      {variant === 'game' ? (
        <View pointerEvents="none" style={styles.gameBlob} />
      ) : null}
      {variant === 'game' ? (
        <View pointerEvents="none" style={styles.gameBlobB} />
      ) : null}
      {variant === 'result' ? (
        <View pointerEvents="none" style={styles.resultBlob} />
      ) : null}
      {variant === 'result' ? (
        <View pointerEvents="none" style={styles.resultBlobB} />
      ) : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.bg},
  content: {flex: 1},
  menuBlobA: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    top: -60,
    right: -80,
    backgroundColor: 'rgba(79,124,255,0.07)',
  },
  menuBlobB: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 999,
    bottom: 220,
    left: -70,
    backgroundColor: 'rgba(143,216,199,0.10)',
  },
  gameBlob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    top: 210,
    alignSelf: 'center',
    backgroundColor: 'rgba(143,216,199,0.12)',
  },
  gameBlobB: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 999,
    bottom: -60,
    right: -70,
    backgroundColor: 'rgba(79,124,255,0.06)',
  },
  resultBlob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 999,
    top: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(143,216,199,0.20)',
  },
  resultBlobB: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 999,
    bottom: 120,
    left: -100,
    backgroundColor: 'rgba(79,124,255,0.08)',
  },
});

export const AppShell = React.memo(AppShellBase);
export default AppShell;
