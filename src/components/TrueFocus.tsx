import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface TrueFocusWord {
  text: string;
  className?: string;
}

export interface TrueFocusProps {
  sentence?: string;
  words?: (string | TrueFocusWord)[];
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
  breakLines?: boolean;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'ENGINEERING SCALABLE SYSTEMS WITH PURPOSE.',
  words: customWords,
  manualMode = false,
  blurAmount = 4,
  borderColor = '#FF2A85',
  glowColor = 'rgba(255, 42, 133, 0.35)',
  animationDuration = 0.45,
  pauseBetweenAnimations = 1.4,
  className = '',
}) => {
  // Normalize items to array of TrueFocusWord
  const items: TrueFocusWord[] = useMemo(() => {
    if (customWords && customWords.length > 0) {
      return customWords.map((item) =>
        typeof item === 'string' ? { text: item } : item
      );
    }
    return sentence.split(' ').map((text) => ({ text }));
  }, [sentence, customWords]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [focusBox, setFocusBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    active: boolean;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    active: false,
  });

  const containerRef = useRef<HTMLHeadingElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Update focus box dimensions based on active word
  const updateFocusBox = () => {
    const activeEl = wordRefs.current[currentIndex];
    const container = containerRef.current;
    if (!activeEl || !container) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const paddingX = 8;
    const paddingY = 4;

    setFocusBox({
      left: activeRect.left - containerRect.left - paddingX,
      top: activeRect.top - containerRect.top - paddingY,
      width: activeRect.width + paddingX * 2,
      height: activeRect.height + paddingY * 2,
      active: true,
    });
  };

  // Listen to currentIndex change and window resize
  useEffect(() => {
    updateFocusBox();
    const handleResize = () => updateFocusBox();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, items]);

  // Auto cycle timer
  useEffect(() => {
    if (manualMode || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, isHovered, items.length, animationDuration, pauseBetweenAnimations]);

  return (
    <h1
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-baseline gap-x-3 sm:gap-x-4 gap-y-2 select-none ${className}`}
    >
      {/* Gliding CAD Reticle / Focus Frame */}
      {focusBox.active && (
        <div
          className="absolute pointer-events-none rounded-lg border-2 z-20 transition-all ease-out"
          style={{
            left: `${focusBox.left}px`,
            top: `${focusBox.top}px`,
            width: `${focusBox.width}px`,
            height: `${focusBox.height}px`,
            borderColor: borderColor,
            boxShadow: `0 0 16px ${glowColor}, inset 0 0 12px ${glowColor}`,
            transitionDuration: `${animationDuration}s`,
            transitionProperty: 'left, top, width, height',
          }}
        >
          {/* Tech Corner HUD Brackets */}
          <span
            className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 rounded-tl-xs"
            style={{ borderColor }}
          />
          <span
            className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 rounded-tr-xs"
            style={{ borderColor }}
          />
          <span
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 rounded-bl-xs"
            style={{ borderColor }}
          />
          <span
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 rounded-br-xs"
            style={{ borderColor }}
          />

          {/* Micro HUD Center Crosshair Pip */}
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5"
            style={{ backgroundColor: borderColor }}
          />
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5"
            style={{ backgroundColor: borderColor }}
          />
        </div>
      )}

      {/* Words */}
      {items.map((item, idx) => {
        const isFocused = idx === currentIndex;
        return (
          <span
            key={`${item.text}-${idx}`}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            onMouseEnter={() => {
              setIsHovered(true);
              setCurrentIndex(idx);
            }}
            onMouseLeave={() => setIsHovered(false)}
            className={`cursor-pointer transition-all duration-300 inline-block font-display font-black tracking-tight ${
              item.className || 'text-on-surface dark:text-white'
            }`}
            style={{
              filter: isFocused ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isFocused ? 1 : 0.45,
              transform: isFocused ? 'scale(1.02)' : 'scale(1)',
              transitionDuration: `${animationDuration}s`,
            }}
          >
            {item.text}
          </span>
        );
      })}
    </h1>
  );
};

export default TrueFocus;
