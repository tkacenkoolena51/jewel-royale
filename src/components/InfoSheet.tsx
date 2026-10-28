import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';
import SecondaryPill from './SecondaryPill';

export interface InfoLine {
  key: string;
  label: string;
  value: string;
}

interface InfoSheetProps {
  visible: boolean;
  title: string;
  intro: string;
  lines: InfoLine[];
  onClose: () => void;
}

/** Inline info modal used by the QUICK GUIDE and HISTORY pills. */
function InfoSheetBase({visible, title, intro, lines, onClose}: InfoSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.intro}>{intro}</Text>
          {lines.map(line => (
            <View key={line.key} style={styles.row}>
              <Text style={styles.rowLabel} numberOfLines={1}>
                {line.label}
              </Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {line.value}
              </Text>
            </View>
          ))}
          <View style={styles.closeWrap}>
            <SecondaryPill label="CLOSE" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(32,37,43,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    ...SHADOW.bar,
  },
  title: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: COLORS.textMuted,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  rowValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closeWrap: {marginTop: 16},
});

export const InfoSheet = React.memo(InfoSheetBase);
export default InfoSheet;
