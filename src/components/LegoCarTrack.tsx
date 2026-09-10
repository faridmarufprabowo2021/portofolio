import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const CAR_COLORS = [
  { name: 'Lego Red', hex: '#AF101A', accent: '#FFD700' },
  { name: 'Brick Blue', hex: '#0055A4', accent: '#FFFFFF' },
  { name: 'Brick Yellow', hex: '#FFD700', accent: '#1A1C1C' },
  { name: 'Brick Green', hex: '#00852B', accent: '#FFD700' },
  { name: 'Speed Orange', hex: '#FF6B00', accent: '#FFFFFF' },
  { name: 'Hyper Purple', hex: '#7928CA', accent: '#00DFD8' },
];

const HONK_MESSAGES = [
  'BEEP BEEP! 🚗💨',
  'FARID SPEED! ⚡',
  'LEGO TURBO! 🧱',
  'DRIFT MODE! 🔥',
  'NITRO BOOST! 🚀',
  'VROOOM! 🏁',
];

interface LegoCarTrackProps {
  children: React.ReactNode;
  speed?: number;
}

export const LegoCarTrack: React.FC<LegoCarTrackProps> = ({
  children,
  speed = 14,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carElRef = useRef<HTMLDivElement>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [honkText, setHonkText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const honkTimeoutRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const speedRef = useRef(speed);
  const boostEndTimeRef = useRef<number>(0);

  speedRef.current = speed;

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Continuous loop that never resets position - using zero-render direct DOM transforms
  useEffect(() => {
    let animId: number;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const delta = Math.min(0.08, (timestamp - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = timestamp;

      // Check if turbo boost from click is active
      const isBoosting = timestamp < boostEndTimeRef.current;
      let currentDuration = isHoveredRef.current ? speedRef.current * 0.65 : speedRef.current;
      if (isBoosting) {
        currentDuration *= 0.5; // Double speed during turbo boost!
      }

      // Smooth continuous progress increment
      progressRef.current = (progressRef.current + delta / currentDuration) % 1;
      const progress = progressRef.current;

      const container = containerRef.current;
      const carEl = carElRef.current;
      if (container && carEl) {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        const perimeter = 2 * (w + h);

        const dist = progress * perimeter;

        let x = 0;
        let y = 0;
        let angle = 0;
        const offset = 4;

        if (dist <= w) {
          // Top edge: Left to Right
          x = dist;
          y = -offset;
          angle = 0;
        } else if (dist <= w + h) {
          // Right edge: Top to Bottom
          x = w + offset;
          y = dist - w;
          angle = 90;
        } else if (dist <= 2 * w + h) {
          // Bottom edge: Right to Left
          x = w - (dist - (w + h));
          y = h + offset;
          angle = 180;
        } else {
          // Left edge: Bottom to Top
          x = -offset;
          y = h - (dist - (2 * w + h));
          angle = 270;
        }

        carEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activeColor = CAR_COLORS[colorIndex];

  const handleCarClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger Nitro Boost for 1.2 seconds without resetting progress
    boostEndTimeRef.current = performance.now() + 1200;

    const nextIdx = (colorIndex + 1) % CAR_COLORS.length;
    setColorIndex(nextIdx);

    const msg = HONK_MESSAGES[Math.floor(Math.random() * HONK_MESSAGES.length)];
    setHonkText(msg);

    if (honkTimeoutRef.current) clearTimeout(honkTimeoutRef.current);
    honkTimeoutRef.current = window.setTimeout(() => {
      setHonkText(null);
    }, 1600);

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 24,
      spread: 65,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: [CAR_COLORS[nextIdx].hex, '#FFD700', '#0055A4', '#00DFD8'],
      shapes: ['square'],
      scalar: 0.95,
    });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Target Children (3D ID Card Container) */}
      {children}

      {/* Track Overlay Border Guide with Lego Stud Notches */}
      <div className="absolute -inset-1.5 border-2 border-dashed border-primary/30 dark:border-brick-yellow/40 rounded-2xl pointer-events-none z-20 transition-colors" />

      {/* Interactive Animated Lego Car */}
      <div
        ref={carElRef}
        onClick={handleCarClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="absolute top-0 left-0 z-40 cursor-pointer select-none group will-change-transform"
        style={{
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%) rotate(0deg)',
        }}
        title="Click to paint car & activate Turbo Boost!"
      >
        {/* Floating Speech / Honk Bubble */}
        {honkText && (
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-brick-yellow text-on-surface border-2 border-on-surface rounded-md font-mono text-[10px] font-black uppercase whitespace-nowrap brick-shadow-sm pointer-events-none animate-bounce z-50"
          >
            {honkText}
          </div>
        )}

        {/* The Lego Car Body Vector */}
        <div className="relative w-11 h-6 flex items-center justify-center transition-transform group-hover:scale-125 group-active:scale-95">
          
          {/* Headlights Beam (Front of Car with Dark-Mode Neon Laser Cone) */}
          <div
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-r from-yellow-300/80 via-yellow-200/40 to-transparent pointer-events-none filter drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
            style={{ clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0 65%)' }}
          />

          {/* Rear Taillight Glow in Dark Mode */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-3 bg-red-500/70 rounded-full blur-[2px] pointer-events-none" />

          {/* 4 Rubber Wheels */}
          <div className="absolute -top-1.5 left-1.5 w-3 h-2 bg-[#1A1C1C] rounded-sm border border-black dark:border-slate-700 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white/70" />
          </div>
          <div className="absolute -top-1.5 right-1.5 w-3 h-2 bg-[#1A1C1C] rounded-sm border border-black dark:border-slate-700 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white/70" />
          </div>
          <div className="absolute -bottom-1.5 left-1.5 w-3 h-2 bg-[#1A1C1C] rounded-sm border border-black dark:border-slate-700 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white/70" />
          </div>
          <div className="absolute -bottom-1.5 right-1.5 w-3 h-2 bg-[#1A1C1C] rounded-sm border border-black dark:border-slate-700 shadow-sm flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white/70" />
          </div>

          {/* Main Chassis Box */}
          <div
            className="w-full h-full rounded border-2 border-[#1A1C1C] dark:border-[#2A2F3D] shadow-sm flex items-center justify-between px-1 relative transition-colors duration-300"
            style={{ backgroundColor: activeColor.hex }}
          >
            {/* 2 Top Lego Studs on Hood */}
            <div className="absolute top-0.5 right-2 flex gap-1 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full border border-black/80 bg-white/40" />
            </div>

            {/* Rear Spoiler */}
            <div className="w-1.5 h-4 bg-[#1A1C1C] dark:bg-[#0D0F12] rounded-l -ml-1 border-r border-white/40" />

            {/* Tinted Windshield / Cockpit */}
            <div className="w-3.5 h-3.5 bg-sky-300 dark:bg-sky-400 border border-[#1A1C1C] dark:border-slate-800 rounded-sm flex items-center justify-center shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
            </div>

            {/* Front Bumper & Glowing Headlights */}
            <div className="flex flex-col gap-1 -mr-0.5">
              <span className="w-1 h-1 rounded-full bg-yellow-300 border border-black shadow-[0_0_4px_#FFD700]" />
              <span className="w-1 h-1 rounded-full bg-yellow-300 border border-black shadow-[0_0_4px_#FFD700]" />
            </div>
          </div>

        </div>

        {/* Small Tooltip Tag on Hover */}
        <div
          className="hidden group-hover:block absolute top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-black/80 text-white rounded text-[8px] font-mono whitespace-nowrap pointer-events-none border border-white/20"
        >
          CLICK TO PAINT & BOOST
        </div>
      </div>
    </div>
  );
};
