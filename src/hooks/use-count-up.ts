import { useEffect, useState } from "react";

export function useCountUp(end: number, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || end <= 0) return;
    setCount(0);
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [end, duration, enabled]);

  return count;
}