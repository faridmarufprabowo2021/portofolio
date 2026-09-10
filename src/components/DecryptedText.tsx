import React, { useState, useEffect, useRef, useMemo } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover' | 'both';
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 38,
  maxIterations = 8,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?',
  className = '',
  encryptedClassName = 'text-primary dark:text-brick-yellow font-mono opacity-80',
  parentClassName = '',
  animateOn = 'both',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimatedInView, setHasAnimatedInView] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Available character set for scrambling
  const availableChars = useMemo(() => {
    if (useOriginalCharsOnly) {
      return Array.from(new Set(text.split('').filter((c) => c !== ' '))).join('');
    }
    return characters;
  }, [text, useOriginalCharsOnly, characters]);

  const getNextIndex = (revealedSet: Set<number>): number => {
    const textLength = text.length;
    switch (revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;
        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  };

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsScrambling(true);

    let currentIteration = 0;
    const currentRevealed = new Set<number>();
    setRevealedIndices(new Set());

    intervalRef.current = window.setInterval(() => {
      if (sequential) {
        if (currentRevealed.size < text.length) {
          const nextIdx = getNextIndex(currentRevealed);
          currentRevealed.add(nextIdx);
          setRevealedIndices(new Set(currentRevealed));
        } else {
          clearInterval(intervalRef.current!);
          setIsScrambling(false);
          setDisplayText(text);
          return;
        }
      } else {
        currentIteration++;
        if (currentIteration >= maxIterations) {
          clearInterval(intervalRef.current!);
          setIsScrambling(false);
          setDisplayText(text);
          setRevealedIndices(new Set(text.split('').map((_, i) => i)));
          return;
        }
      }

      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (currentRevealed.has(i)) return text[i];
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            return availableChars[randomIndex];
          })
          .join('')
      );
    }, speed);
  };

  // IntersectionObserver for 'view' animation trigger
  useEffect(() => {
    if (animateOn === 'hover') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedInView) {
          setHasAnimatedInView(true);
          startAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animateOn, hasAnimatedInView]);

  const handleMouseEnter = () => {
    if ((animateOn === 'hover' || animateOn === 'both') && !isScrambling) {
      startAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      className={`inline-block cursor-default select-none ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
    >
      {displayText.split('').map((char, index) => {
        const isRevealed = revealedIndices.has(index) || !isScrambling;
        return (
          <span
            key={index}
            className={isRevealed ? className : encryptedClassName}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default DecryptedText;
