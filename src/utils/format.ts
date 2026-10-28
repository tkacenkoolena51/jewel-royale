/** Display helpers. Clock is MM:SS, minutes read as "45 MIN". */

export function mmss(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function minutesLabel(minutes: number): string {
  return `${Math.max(0, Math.round(minutes))} MIN`;
}

export function goalLabel(done: number, goal: number): string {
  return `${Math.round(done)} / ${Math.round(goal)} MIN`;
}

export function pct(part: number, whole: number): number {
  if (whole <= 0) {
    return 0;
  }
  return clamp01(part / whole);
}

export function clamp01(v: number): number {
  if (v < 0) {
    return 0;
  }
  if (v > 1) {
    return 1;
  }
  return v;
}

export function pctLabel(part: number, whole: number): string {
  return `${Math.round(pct(part, whole) * 100)}%`;
}
