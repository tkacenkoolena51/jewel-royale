import {
  DAILY_GOAL_MIN,
  SEED_SESSIONS_TODAY,
  SEED_STREAK,
  SEED_TODAY_MIN,
  WEEK_MINUTES,
} from '../constants/config';
import {SessionResult} from './session';

export interface HistoryItem {
  id: string;
  tag: string;
  minutes: number;
  time: string;
  /** 'focus' paints the dot blue, 'light' paints it mint. */
  kind: 'focus' | 'light';
}

export interface Stats {
  todayMinutes: number;
  sessionsToday: number;
  streak: number;
  goalMinutes: number;
  week: number[];
  history: HistoryItem[];
}

/**
 * In-memory only. The shape is kept adapter-ready so a persistence module can
 * be dropped in later without touching the screens.
 */
export function createInitialStats(): Stats {
  return {
    todayMinutes: SEED_TODAY_MIN,
    sessionsToday: SEED_SESSIONS_TODAY,
    streak: SEED_STREAK,
    goalMinutes: DAILY_GOAL_MIN,
    week: WEEK_MINUTES.slice(),
    history: [
      {id: 'h1', tag: 'Deep work', minutes: 25, time: '09:40', kind: 'focus'},
      {id: 'h2', tag: 'Reading', minutes: 15, time: '11:05', kind: 'light'},
      {id: 'h3', tag: 'Planning', minutes: 5, time: '13:20', kind: 'focus'},
    ],
  };
}

export function applySession(prev: Stats, result: SessionResult): Stats {
  const week = prev.week.slice();
  week[week.length - 1] = week[week.length - 1] + result.minutes;

  const entry: HistoryItem = {
    id: `s${prev.sessionsToday + 1}-${result.minutes}`,
    tag: result.completed ? 'Focus session' : 'Short focus',
    minutes: result.minutes,
    time: nextSlot(prev.sessionsToday),
    kind: result.completed ? 'focus' : 'light',
  };

  return {
    ...prev,
    todayMinutes: prev.todayMinutes + result.minutes,
    sessionsToday: prev.sessionsToday + 1,
    streak: prev.streak,
    week,
    history: [entry, ...prev.history].slice(0, 3),
  };
}

function nextSlot(index: number): string {
  const hour = 14 + (index % 6);
  return `${hour}:00`;
}
