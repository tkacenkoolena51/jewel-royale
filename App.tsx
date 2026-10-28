import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, BackHandler, Easing, StatusBar, StyleSheet, View} from 'react-native';
import AppShell from './src/components/AppShell';
import {DEFAULT_LENGTH_KEY, FADE_IN_MS, SessionLengthKey} from './src/constants/config';
import {COLORS} from './src/constants/theme';
import {buildResult, SessionResult} from './src/game/session';
import {applySession, createInitialStats, Stats} from './src/game/store';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

/**
 * State machine only — conditional render, no navigation library.
 * Every screen gets its callbacks as props.
 */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [lengthKey, setLengthKey] = useState<SessionLengthKey>(DEFAULT_LENGTH_KEY);
  const [stats, setStats] = useState<Stats>(createInitialStats);
  const [result, setResult] = useState<SessionResult | null>(null);
  /** Bumped on every entry into 'game' so the timer remounts cleanly. */
  const [runId, setRunId] = useState(0);

  const handleLoaderDone = useCallback(() => setScreen('menu'), []);

  const handleStart = useCallback(() => {
    setRunId(id => id + 1);
    setScreen('game');
  }, []);

  const handleExitSession = useCallback(() => setScreen('menu'), []);

  const handleFinish = useCallback(
    (elapsedSec: number, completed: boolean) => {
      const next = buildResult(lengthKey, elapsedSec, completed);
      setResult(next);
      setStats(prev => applySession(prev, next));
      setScreen('gameover');
    },
    [lengthKey],
  );

  const handlePlayAgain = useCallback(() => {
    setRunId(id => id + 1);
    setScreen('game');
  }, []);

  const handleMenu = useCallback(() => setScreen('menu'), []);

  // A stray back-press on the hub must not finish the Activity.
  useEffect(() => {
    const onBack = () => {
      if (screen === 'game' || screen === 'gameover') {
        setScreen('menu');
        return true;
      }
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [screen]);

  const content = useMemo(() => {
    if (screen === 'loader') {
      return <LoaderScreen onDone={handleLoaderDone} />;
    }
    if (screen === 'menu') {
      return (
        <AppShell variant="menu">
          <MenuScreen
            stats={stats}
            lengthKey={lengthKey}
            onChangeLength={setLengthKey}
            onStart={handleStart}
          />
        </AppShell>
      );
    }
    if (screen === 'game') {
      return (
        <AppShell variant="game">
          <GameScreen
            key={`run-${runId}`}
            lengthKey={lengthKey}
            stats={stats}
            onExit={handleExitSession}
            onFinish={handleFinish}
          />
        </AppShell>
      );
    }
    return (
      <AppShell variant="result">
        <GameOverScreen
          result={result ?? buildResult(lengthKey, 60, true)}
          stats={stats}
          onPlayAgain={handlePlayAgain}
          onMenu={handleMenu}
        />
      </AppShell>
    );
  }, [
    screen,
    stats,
    lengthKey,
    runId,
    result,
    handleLoaderDone,
    handleStart,
    handleExitSession,
    handleFinish,
    handlePlayAgain,
    handleMenu,
  ]);

  const dark = screen === 'loader';

  return (
    <View style={[styles.root, dark ? styles.rootDark : null]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <ScreenFade screenKey={screen}>{content}</ScreenFade>
    </View>
  );
}

/**
 * Cross-screen fade. `pointerEvents="box-none"` is mandatory: an Animated
 * wrapper without it swallows every press from the screen inside it.
 */
function ScreenFade({
  screenKey,
  children,
}: {
  screenKey: string;
  children: React.ReactNode;
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_IN_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [screenKey, opacity]);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.fade, {opacity}]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.bg},
  rootDark: {backgroundColor: COLORS.inkTop},
  fade: {flex: 1},
});
