import { useEffect, useState } from "react";

export interface CountUpProps {
  end: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, duration = 1200, prefix = "", suffix = "", className = "" }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad formula
      const easedProgress = progress * (2 - progress);
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
