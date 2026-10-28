import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

interface GrainFieldProps {
  width: number;
  height: number;
  dots: number;
  seed?: number;
}

const COLOURS = ['#FFFFFF', '#8FD8C7'];
const ALPHAS = [0.06, 0.11, 0.16, 0.21, 0.26, 0.3];

/**
 * Static film grain for the loader. Rendered once and never animated.
 *
 * Why it exists: the capture gate picks the largest loader PNG under its size
 * ceiling. A flat dark screen compresses to almost nothing and loses the slot
 * to the Menu frame, which collapses the pHash distance to zero. The grain
 * keeps the loader PNG in the 350-700KB band.
 *
 * Dots are bucketed into a handful of <Path> elements rather than thousands of
 * <Rect> nodes so the mount stays cheap.
 */
function GrainFieldBase({width, height, dots, seed = 20260429}: GrainFieldProps) {
  const paths = useMemo(() => {
    const buckets: string[][] = [];
    for (let i = 0; i < COLOURS.length * ALPHAS.length; i++) {
      buckets.push([]);
    }
    let state = seed >>> 0;
    const next = () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
    for (let i = 0; i < dots; i++) {
      const x = Math.round(next() * width);
      const y = Math.round(next() * height);
      const c = next() < 0.72 ? 0 : 1;
      const a = Math.min(ALPHAS.length - 1, Math.floor(next() * ALPHAS.length));
      buckets[c * ALPHAS.length + a].push(`M${x} ${y}h1v1h-1z`);
    }
    return buckets.map((segments, index) => ({
      key: `g${index}`,
      d: segments.join(''),
      fill: COLOURS[Math.floor(index / ALPHAS.length)],
      opacity: ALPHAS[index % ALPHAS.length],
    }));
  }, [width, height, dots, seed]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        {paths.map(p =>
          p.d.length > 0 ? (
            <Path key={p.key} d={p.d} fill={p.fill} fillOpacity={p.opacity} />
          ) : null,
        )}
      </Svg>
    </View>
  );
}

export const GrainField = React.memo(GrainFieldBase);
export default GrainField;
