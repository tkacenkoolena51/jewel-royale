import React, {useCallback, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Bell, Clock, User} from 'lucide-react-native';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';
import SecondaryPill from './SecondaryPill';

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * The brief's Profile / Notifications / Settings screens, collapsed into one
 * modal. Closed by default and never opened automatically.
 */
function SettingsSheetBase({visible, onClose}: SettingsSheetProps) {
  const [notifications, setNotifications] = useState(true);
  const toggle = useCallback(() => setNotifications(v => !v), []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Alex Nordin</Text>
              <Text style={styles.profileMeta}>FOCUS LANTERN MEMBER</Text>
            </View>
          </View>

          <Pressable
            onPress={toggle}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            accessibilityRole="switch"
            accessibilityState={{checked: notifications}}
            accessibilityLabel="Session reminders"
            style={styles.rowPress}>
            <View style={styles.rowIcon}>
              <Bell size={22} strokeWidth={1.5} color={COLORS.primary} />
            </View>
            <Text style={styles.rowLabel}>Session reminders</Text>
            <View
              style={[styles.toggle, notifications ? styles.toggleOn : null]}>
              <View
                style={[styles.knob, notifications ? styles.knobOn : null]}
              />
            </View>
          </Pressable>

          <View style={styles.rowStatic}>
            <View style={styles.rowIcon}>
              <Clock size={22} strokeWidth={1.5} color={COLORS.accentDeep} />
            </View>
            <Text style={styles.rowLabel}>Daily nudge</Text>
            <Text style={styles.rowValue}>09:30</Text>
          </View>

          <View style={styles.rowStatic}>
            <View style={styles.rowIcon}>
              <User size={22} strokeWidth={1.5} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.rowLabel}>Daily goal</Text>
            <Text style={styles.rowValue}>90 MIN</Text>
          </View>

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
  profile: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.chip,
    backgroundColor: 'rgba(79,124,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: COLORS.primary,
  },
  profileText: {flex: 1, marginLeft: 12},
  profileName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  profileMeta: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: COLORS.textMuted,
  },
  rowPress: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
  },
  rowStatic: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
  },
  rowIcon: {width: 32, alignItems: 'flex-start', justifyContent: 'center'},
  rowLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  toggle: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.trackFill,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {backgroundColor: 'rgba(79,124,255,0.22)'},
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.textMuted,
  },
  knobOn: {backgroundColor: COLORS.primary, alignSelf: 'flex-end'},
  closeWrap: {marginTop: 16},
});

export const SettingsSheet = React.memo(SettingsSheetBase);
export default SettingsSheet;
