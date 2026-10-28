import React, {useCallback, useState} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import assets from '../assets';
import {COLORS} from '../constants/theme';
import {HistoryItem} from '../game/store';
import {minutesLabel} from '../utils/format';
import {usePressScale} from '../hooks/usePressScale';
import BentoTile from './BentoTile';

interface HistoryStripProps {
  items: HistoryItem[];
  style?: StyleProp<ViewStyle>;
}

interface RowProps {
  item: HistoryItem;
  expanded: boolean;
  onPress: (id: string) => void;
}

function HistoryRow({item, expanded, onPress}: RowProps) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.98);
  const handlePress = useCallback(() => onPress(item.id), [onPress, item.id]);
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityLabel={`${item.tag}, ${item.minutes} minutes`}
      style={[styles.rowPress, expanded ? styles.rowPressTall : null]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.row, {transform: [{scale}]}]}>
        <View style={styles.rowTop}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  item.kind === 'focus' ? COLORS.primary : COLORS.accent,
              },
            ]}
          />
          <Text style={styles.tag} numberOfLines={1}>
            {item.tag}
          </Text>
          <Text style={styles.minutes}>{minutesLabel(item.minutes)}</Text>
        </View>
        {expanded ? (
          <Text style={styles.detail}>
            {`${item.time} · ${item.kind === 'focus' ? 'FOCUS' : 'LIGHT'}`}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

/** Tap a row to grow it into the brief's Details view. Plain state swap. */
function HistoryStripBase({items, style}: HistoryStripProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const handlePress = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <BentoTile style={[styles.tile, style]}>
      <Image
        source={assets.sprite3}
        style={styles.ornament}
        resizeMode="contain"
      />
      <Text style={styles.label}>RECENT</Text>
      {items.map(item => (
        <HistoryRow
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          onPress={handlePress}
        />
      ))}
    </BentoTile>
  );
}

const styles = StyleSheet.create({
  tile: {paddingTop: 12, paddingBottom: 6},
  ornament: {
    position: 'absolute',
    width: 54,
    height: 54,
    right: 10,
    bottom: 10,
    opacity: 0.5,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  rowPress: {width: '100%', height: 46},
  rowPressTall: {height: 70},
  row: {width: '100%', flex: 1, justifyContent: 'center'},
  rowTop: {flexDirection: 'row', alignItems: 'center'},
  dot: {width: 8, height: 8, borderRadius: 4, marginRight: 10},
  tag: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  minutes: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  detail: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 18,
  },
});

export const HistoryStrip = React.memo(HistoryStripBase);
export default HistoryStrip;
