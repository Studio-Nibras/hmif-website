import { useEffect, useRef, useState } from "react";

export default function CountUp({ target, suffix = "", duration = 1400 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || target <= 0) {
      const frame = requestAnimationFrame(() => {
        setValue(target);
      });

      return () => cancelAnimationFrame(frame);
    }

    let frame;
    let startTime;

    function animate(timestamp) {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return (
    <span ref={ref} aria-label={`${target}${suffix}`}>
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
