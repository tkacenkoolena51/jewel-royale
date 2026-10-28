/**
 * NORDIC_MINIMAL preset with the brief's accents overridden.
 * The `name` field is verbatim NORDIC_MINIMAL — codegen keys off it.
 *
 * NOTE: gradient arrays are deliberately NOT `as const`.
 * `readonly string[]` is rejected by react-native-linear-gradient's prop type.
 */

export const COLORS = {
  bg: '#FFFFFF',
  bgSoft: '#F7F9FB',
  surface: '#F3F5F7',
  surfaceRaised: '#FFFFFF',
  border: '#DCE2EA',
  borderSoft: '#E6EAF0',
  trackFill: '#E4E9F0',
  primary: '#4F7CFF',
  primaryLight: '#6B91FF',
  primaryDim: '#A9BDF5',
  accent: '#8FD8C7',
  accentDeep: '#2F8F78',
  text: '#20252B',
  textSecondary: '#5B6673',
  textMuted: '#97A1AE',
  white: '#FFFFFF',
  // loader only
  inkTop: '#141A22',
  inkMid: '#20252B',
  inkDeep: '#2B3A63',
};

export const GRADIENTS: {[k: string]: string[]} = {
  loaderBg: ['#141A22', '#20252B', '#2B3A63'],
  menuBg: ['#FFFFFF', '#F7F9FB', '#F3F5F7'],
  gameBg: ['#FFFFFF', '#F3F5F7'],
  resultBg: ['#FFFFFF', '#F0F6FF', '#F3F5F7'],
  cta: ['#6B91FF', '#4F7CFF'],
  mintBlue: ['#8FD8C7', '#4F7CFF'],
};

export const RADIUS = {
  chip: 14,
  pill: 16,
  tile: 20,
  card: 22,
  badge: 30,
  round: 999,
};

export const SPACING = {
  screenX: 20,
  gap: 12,
  gapLg: 18,
  bottom: 24,
};

export const SHADOW = {
  card: {
    shadowColor: '#20252B',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 2,
  },
  bar: {
    shadowColor: '#20252B',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  cta: {
    shadowColor: '#4F7CFF',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
  badge: {
    shadowColor: '#4F7CFF',
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
};

export const TYPE = {
  hero: {fontSize: 34, fontWeight: '800' as const, letterSpacing: 4},
  resultTitle: {fontSize: 28, fontWeight: '800' as const, letterSpacing: 1.4},
  clock: {fontSize: 54, fontWeight: '800' as const, letterSpacing: 0},
  title: {fontSize: 24, fontWeight: '700' as const, letterSpacing: 0},
  value: {fontSize: 22, fontWeight: '800' as const, letterSpacing: 0},
  body: {fontSize: 14, fontWeight: '600' as const, letterSpacing: 0},
  caption: {fontSize: 11, fontWeight: '600' as const, letterSpacing: 2.2},
};

/** Status-bar inset budget. The window is translucent, so screens pad for it. */
export const TOP_INSET = 44;

export const theme = {
  name: 'NORDIC_MINIMAL',
  colors: COLORS,
  gradients: GRADIENTS,
  radius: RADIUS,
  spacing: SPACING,
  shadow: SHADOW,
  typography: TYPE,
};

export default theme;
