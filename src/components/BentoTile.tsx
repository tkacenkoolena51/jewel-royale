import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';

interface BentoTileProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'raised' | 'soft';
}

/** Plain surface tile — radius 20, 1px hairline, barely-there shadow. */
function BentoTileBase({children, style, tone = 'raised'}: BentoTileProps) {
  return (
    <View style={[styles.tile, tone === 'soft' ? styles.soft : null, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.tile,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  soft: {backgroundColor: COLORS.surface},
});

export const BentoTile = React.memo(BentoTileBase);
export default BentoTile;
