import {useCallback, useEffect, useRef, useState} from 'react';
import {TICK_MS} from '../constants/config';

export interface SessionTimer {
  remainingSec: number;
  elapsedSec: number;
  progress: number;
  paused: boolean;
  togglePause: () => void;
}

/**
 * Discrete 1s countdown.
 *
 * Deliberately a state tick and NOT a continuous tween: a multi-minute
 * JS-driven animation keeps the window non-idle and uiautomator never returns
 * an accessibility tree. The deadline lives in a ref so the interval callback
 * never reads stale state.
 */
export function useSessionTimer(
  totalSec: number,
  onComplete: () => void,
): SessionTimer {
  const [remainingSec, setRemainingSec] = useState(totalSec);
  const [paused, setPaused] = useState(false);

  const remainingRef = useRef(totalSec);
  const deadlineRef = useRef(Date.now() + totalSec * 1000);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Restart cleanly whenever the chosen length changes.
  useEffect(() => {
    remainingRef.current = totalSec;
    deadlineRef.current = Date.now() + totalSec * 1000;
    doneRef.current = false;
    setRemainingSec(totalSec);
    setPaused(false);
  }, [totalSec]);

  useEffect(() => {
    if (paused || doneRef.current) {
      return undefined;
    }
    const id = setInterval(() => {
      const left = Math.max(
        0,
        Math.round((deadlineRef.current - Date.now()) / 1000),
      );
      remainingRef.current = left;
      setRemainingSec(left);
      if (left <= 0 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(id);
        onCompleteRef.current();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, totalSec]);

  const togglePause = useCallback(() => {
    setPaused(prev => {
      const next = !prev;
      if (!next) {
        // Resuming: re-derive the deadline from what is actually left.
        deadlineRef.current = Date.now() + remainingRef.current * 1000;
      }
      return next;
    });
  }, []);

  const elapsedSec = Math.max(0, totalSec - remainingSec);
  const progress = totalSec > 0 ? elapsedSec / totalSec : 0;

  return {remainingSec, elapsedSec, progress, paused, togglePause};
}

export default useSessionTimer;
