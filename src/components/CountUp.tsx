import { useEffect, useRef, useState } from "react";

import { useInView } from "@/hooks/use-in-view";

type CountUpProps = {
  value: string;
  className?: string;
  duration?: number;
};

/** Анимирует число от 0 до значения при появлении в зоне видимости. Суффикс («+») сохраняется. */
export function CountUp({ value, className, duration = 1200 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>(0);
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const [display, setDisplay] = useState(match ? "0" : value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView || !match) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(target * eased)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, match, target, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {match ? suffix : ""}
    </span>
  );
}
