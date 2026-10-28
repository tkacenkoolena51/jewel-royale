import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';

import type {IconCmp} from './icon';

export interface StatItem {
  key: string;
  Icon: IconCmp;
  value: string;
  label: string;
  valueColor: string;
}

/**
 * The one and only stat pill — identical geometry on Game and GameOver.
 * Pills differ by colour and copy, never by icon size or card shape:
 * cover the icons with a finger and every pill still looks the same.
 *
 * `width: '100%'` (not flex:1) because the parent slot is already flex:1 —
 * flex inside flex collapses the card to a sliver and eats the text.
 */
function StatCardBase({Icon, value, label, valueColor}: Omit<StatItem, 'key'>) {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, {backgroundColor: valueColor + '1A'}]}>
        <Icon size={22} strokeWidth={1.5} color={valueColor} />
      </View>
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Never renders a row with fewer than two filled pills. */
function StatRowBase({items}: {items: StatItem[]}) {
  const visible = items.filter(i => !!i.value);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            Icon={item.Icon}
            value={item.value}
            label={item.label}
            valueColor={item.valueColor}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 12},
  slot: {flex: 1},
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.tile,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export const StatCard = React.memo(StatCardBase);
export const StatRow = React.memo(StatRowBase);
export default StatCard;
