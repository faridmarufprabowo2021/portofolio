import React, { useRef, useEffect, useState } from 'react';

interface ScrollVelocityProps {
  texts: string[];
  velocity?: number; // Base speed (e.g. 0.8 is calm & comfortable to read)
  className?: string;
  parallaxClassName?: string;
  numCopies?: number;
  reverse?: boolean[];
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts,
  velocity = 0.75,
  className = '',
  parallaxClassName = '',
  numCopies = 3,
  reverse = [false, true],
}) => {
  const [scrollBoost, setScrollBoost] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const xOffsets = useRef<number[]>(texts.map(() => 0));
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const now = Date.now();
          const currentScrollY = window.scrollY;
          const dt = Math.max(1, now - lastTime.current);
          const dy = Math.abs(currentScrollY - lastScrollY.current);

          // Gentle, capped boost during scroll
          const rawBoost = (dy / dt) * 0.8;
          const cappedBoost = Math.min(rawBoost, 2.5);
          setScrollBoost(cappedBoost);

          lastScrollY.current = currentScrollY;
          lastTime.current = now;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous animation loop
  useEffect(() => {
    let animId: number;
    let currentBoost = 0;

    const animate = () => {
      // Smooth decay of scroll boost towards 0
      currentBoost += (scrollBoost - currentBoost) * 0.05;

      texts.forEach((_, idx) => {
        const isReversed = reverse[idx % reverse.length];
        const dir = isReversed ? 1 : -1;
        const currentSpeed = (velocity + currentBoost) * dir;

        const rowEl = rowRefs.current[idx];
        if (rowEl) {
          const contentWidth = rowEl.scrollWidth / 2;
          xOffsets.current[idx] += currentSpeed;

          // Seamless modulo wrap
          if (contentWidth > 0) {
            if (xOffsets.current[idx] <= -contentWidth) {
              xOffsets.current[idx] += contentWidth;
            } else if (xOffsets.current[idx] >= 0) {
              xOffsets.current[idx] -= contentWidth;
            }
          }

          rowEl.style.transform = `translate3d(${xOffsets.current[idx]}px, 0, 0)`;
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [texts, velocity, scrollBoost, reverse]);

  return (
    <div className={`overflow-hidden select-none w-full py-2.5 ${className}`}>
      {texts.map((text, idx) => (
        <div
          key={idx}
          className={`flex whitespace-nowrap will-change-transform ${parallaxClassName}`}
        >
          <div
            ref={(el) => {
              rowRefs.current[idx] = el;
            }}
            className="flex shrink-0 items-center gap-8"
            style={{
              transform: `translate3d(0, 0, 0)`,
            }}
          >
            {/* Render 2 sets of duplicated items for seamless wrap */}
            {Array.from({ length: numCopies * 2 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-4 text-xs sm:text-sm md:text-base font-mono font-black uppercase tracking-wider"
              >
                <span>{text}</span>
                <span className="w-2 h-2 rounded-full bg-on-surface dark:bg-brick-yellow inline-block shrink-0" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScrollVelocity;
