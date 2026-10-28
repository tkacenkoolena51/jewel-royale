/**
 * Numeric contract for Focus Lantern.
 * Every value here is load-bearing for the capture pipeline — read the comments
 * before changing one.
 */

/** Loader lifetime. EXACTLY 8000 — shorter races the screenshot capture window. */
export const LOADER_DURATION_MS = 8000;

/** Loader progress-bar animation ONLY. Never reuse LOADER_DURATION_MS here. */
export const LOADER_BAR_ANIM_MS = 1200;

/** Static grain dots on the loader. Target loader PNG 350-700KB, ceiling 1.1MB. */
export const LOADER_GRAIN_DOTS = 2600;

export type SessionLengthKey = 'quick' | 'focus' | 'deep';

export interface SessionLength {
  key: SessionLengthKey;
  label: string;
  tag: string;
  seconds: number;
}

export const SESSION_LENGTHS: SessionLength[] = [
  {key: 'quick', label: 'QUICK 1 MIN', tag: 'QUICK FOCUS', seconds: 60},
  {key: 'focus', label: 'FOCUS 5 MIN', tag: 'DEEP WORK', seconds: 300},
  {key: 'deep', label: 'DEEP 15 MIN', tag: 'DEEP WORK', seconds: 900},
];

/** 60s default keeps the result frame reachable inside the capture window. */
export const DEFAULT_LENGTH_KEY: SessionLengthKey = 'quick';

/** Discrete 1s tick — a continuous tween keeps the window non-idle. */
export const TICK_MS = 1000;

export const DAILY_GOAL_MIN = 90;
export const SEED_TODAY_MIN = 45;
export const SEED_SESSIONS_TODAY = 3;
export const SEED_STREAK = 6;

/** Monday..Sunday, index 6 is today. */
export const WEEK_MINUTES: number[] = [40, 65, 25, 80, 55, 30, 45];
export const WEEK_LETTERS: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const WEEK_DELTA_PCT = 18;

export const SPRING = {tension: 46, friction: 7, useNativeDriver: true};
export const SPRING_CTA = {tension: 48, friction: 8, useNativeDriver: true};

export const FADE_IN_MS = 260;
export const HEADER_FADE_MS = 220;
export const TILE_STAGGER_MS = 60;
export const COUNT_UP_MS = 500;
export const GOAL_BAR_MS = 420;
export const GLOW_MS = 600;
