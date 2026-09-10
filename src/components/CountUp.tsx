import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 1.8,
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = to;
          const totalFrames = Math.round(duration * 60);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.round(start + (end - start) * easeProgress);

            setCount(currentVal);

            if (frame >= totalFrames) {
              clearInterval(counter);
              setCount(end);
            }
          }, 1000 / 60);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={elementRef} className={className}>
      {count}
      {suffix}
    </span>
  );
};
