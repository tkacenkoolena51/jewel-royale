import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';
import {SPRING_CTA} from '../constants/config';

/**
 * Press feedback pair for the Pressable-outside / Animated.View-inside pattern.
 * Only `transform` is animated, so useNativeDriver stays true.
 */
export function usePressScale(pressedScale: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: SPRING_CTA.tension,
      friction: SPRING_CTA.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, pressedScale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: SPRING_CTA.tension,
      friction: SPRING_CTA.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
