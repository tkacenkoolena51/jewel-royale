import {useEffect, useRef, useState} from 'react';

/**
 * Counts a number up in a fixed number of discrete steps.
 *
 * Deliberately step-based rather than a per-frame Animated listener: ten
 * renders over half a second let the window settle, where a 60fps JS tween
 * would keep it busy while the capture agent waits for an idle frame.
 */
export function useCountUp(target: number, durationMs: number, steps = 10) {
  const [value, setValue] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return undefined;
    }
    let i = 0;
    setValue(0);
    const id = setInterval(() => {
      i += 1;
      if (i >= steps) {
        clearInterval(id);
        setValue(targetRef.current);
        return;
      }
      setValue(Math.round((targetRef.current * i) / steps));
    }, Math.max(16, Math.round(durationMs / steps)));
    return () => clearInterval(id);
  }, [target, durationMs, steps]);

  return value;
}

export default useCountUp;
