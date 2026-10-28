import {
  DEFAULT_LENGTH_KEY,
  SESSION_LENGTHS,
  SessionLength,
  SessionLengthKey,
} from '../constants/config';

export interface SessionResult {
  lengthKey: SessionLengthKey;
  /** Minutes credited to the user, always >= 1. */
  minutes: number;
  /** true when the ring burned all the way down, false on an early finish. */
  completed: boolean;
}

export function resolveLength(key: SessionLengthKey): SessionLength {
  const found = SESSION_LENGTHS.find(l => l.key === key);
  return found ?? SESSION_LENGTHS[0];
}

export function defaultLength(): SessionLength {
  return resolveLength(DEFAULT_LENGTH_KEY);
}

/** Elapsed seconds -> credited minutes. An early finish still counts as 1. */
export function minutesFromElapsed(elapsedSec: number): number {
  return Math.max(1, Math.ceil(Math.max(0, elapsedSec) / 60));
}

export function buildResult(
  lengthKey: SessionLengthKey,
  elapsedSec: number,
  completed: boolean,
): SessionResult {
  return {
    lengthKey,
    minutes: minutesFromElapsed(elapsedSec),
    completed,
  };
}
