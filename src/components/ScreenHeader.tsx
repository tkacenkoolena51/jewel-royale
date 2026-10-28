import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, TOP_INSET} from '../constants/theme';

interface ScreenHeaderProps {
  /** Small uppercase caption above the title. */
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  divider?: boolean;
}

const CHIP = 44;

/**
 * The one header used by Menu, Game and GameOver. Keeping a single component
 * is what stops the three screens drifting apart in padding and badge style.
 */
function ScreenHeaderBase({
  eyebrow,
  title,
  align = 'left',
  leftSlot,
  rightSlot,
  divider = false,
}: ScreenHeaderProps) {
  const centered = align === 'center';
  return (
    <View style={[styles.root, divider ? styles.divider : null]}>
      <View style={styles.slot}>{leftSlot ?? null}</View>
      <View style={[styles.textWrap, centered ? styles.textCenter : null]}>
        <Text
          style={[styles.eyebrow, centered ? styles.alignCenter : null]}
          numberOfLines={1}>
          {eyebrow}
        </Text>
        <Text
          style={[
            styles.title,
            centered ? styles.alignCenter : null,
            centered ? styles.titleCentered : null,
          ]}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.slot}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: TOP_INSET,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },
  slot: {width: CHIP, height: CHIP, alignItems: 'center', justifyContent: 'center'},
  textWrap: {flex: 1, paddingHorizontal: 10, justifyContent: 'center'},
  textCenter: {alignItems: 'center'},
  alignCenter: {textAlign: 'center'},
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 30,
    marginTop: 2,
  },
  titleCentered: {fontSize: 15, fontWeight: '700', letterSpacing: 0.6, lineHeight: 20},
});

export const ScreenHeader = React.memo(ScreenHeaderBase);
export default ScreenHeader;
