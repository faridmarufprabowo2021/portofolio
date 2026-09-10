import React, { useRef, useEffect, useState, useCallback } from 'react';

interface ParticleTextProps {
  text?: string;
  colors?: string[];
  particleSize?: number;
  particleGap?: number;
  mouseRadius?: number;
  repulsionPower?: number;
  returnSpeed?: number;
  className?: string;
  subText?: string;
}

interface Particle {
  x: number;
  y: number;
  origX: number;
  origY: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
}

export const ParticleText: React.FC<ParticleTextProps> = ({
  text = 'FARID.DEV',
  colors,
  particleSize = 2.4,
  particleGap = 4.5,
  mouseRadius = 95,
  repulsionPower = 7,
  returnSpeed = 0.085,
  className = '',
  subText = 'INTERACTIVE LEGO PARTICLE ENGINE // TOUCH OR HOVER',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isHovered: boolean }>({
    x: -1000,
    y: -1000,
    isHovered: false,
  });
  const animFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const [hintVisible, setHintVisible] = useState(true);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Track theme changes dynamically
  useEffect(() => {
    const handleThemeChange = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    window.addEventListener('themechange', handleThemeChange);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // Compute active palette based on light/dark mode
  const activePalette = React.useMemo(() => {
    if (colors && colors.length > 0) return colors;
    if (isDark) {
      // Vibrant glowing neon studs on dark canvas
      return ['#FFD700', '#FFFFFF', '#38BDF8', '#FF4D4D', '#00DFD8', '#4ADE80'];
    }
    // High-contrast punchy Lego primary & dark charcoal studs on light canvas
    return ['#1A1C1C', '#AF101A', '#0055A4', '#00852B', '#D97706', '#E11D48', '#2563EB', '#1A1C1C'];
  }, [colors, isDark]);

  // Initialize and compute particle coordinates from offscreen canvas
  const initParticles = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = (canvas.width = rect.width);
    const height = (canvas.height = rect.height);

    if (width === 0 || height === 0) return;

    // Create offscreen canvas for crisp text sampling
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    // Compute responsive font size based on text length & container
    const isMobile = width < 640;
    const dynamicFontSize = Math.min(
      Math.floor((width * (isMobile ? 0.92 : 0.88)) / (text.length * 0.62)),
      Math.floor(height * 0.72)
    );

    offCtx.fillStyle = '#000000';
    offCtx.font = `900 ${dynamicFontSize}px "Plus Jakarta Sans", "Space Mono", monospace`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const gap = isMobile ? Math.max(3.8, particleGap - 0.5) : particleGap;
    const newParticles: Particle[] = [];

    for (let y = 0; y < height; y += gap) {
      for (let x = 0; x < width; x += gap) {
        const index = (Math.floor(y) * width + Math.floor(x)) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          const color = activePalette[Math.floor(Math.random() * activePalette.length)];
          // Spawn initially scattered slightly for a satisfying assembly effect
          const scatterAngle = Math.random() * Math.PI * 2;
          const scatterDist = Math.random() * 80 + 20;

          newParticles.push({
            x: x + Math.cos(scatterAngle) * scatterDist,
            y: y + Math.sin(scatterAngle) * scatterDist,
            origX: x,
            origY: y,
            vx: 0,
            vy: 0,
            color,
            radius: Math.random() * 0.6 + particleSize,
          });
        }
      }
    }

    particlesRef.current = newParticles;
  }, [text, particleSize, particleGap, activePalette]);

  useEffect(() => {
    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse repulsion physics
        if (mouse.isHovered) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 0) {
            const force = ((mouseRadius - dist) / mouseRadius) * repulsionPower;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 1.5;
            p.vy += Math.sin(angle) * force * 1.5;
          }
        }

        // 2. Spring force back to home position
        const homeDx = p.origX - p.x;
        const homeDy = p.origY - p.y;
        p.vx += homeDx * returnSpeed;
        p.vy += homeDy * returnSpeed;

        // 3. Friction / Damping
        p.vx *= 0.86;
        p.vy *= 0.86;

        // 4. Update position
        p.x += p.vx;
        p.y += p.vy;

        // 5. Draw particle (Lego Stud Style)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle specular highlight for 3D depth
        if (p.radius > 2.2) {
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.75)';
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouseRadius, repulsionPower, returnSpeed, isDark]);

  // Viewport Observer to pause calculations when out of view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mouse & Touch interaction handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    };
    if (hintVisible) setHintVisible(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovered = false;
  };

  // Click shockwave explosion
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    particlesRef.current.forEach((p) => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      const dist = Math.hypot(dx, dy) || 1;
      const burstRadius = 240;

      if (dist < burstRadius) {
        const force = ((burstRadius - dist) / burstRadius) * 22;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force + (Math.random() - 0.5) * 6;
        p.vy += Math.sin(angle) * force + (Math.random() - 0.5) * 6;
      }
    });
  };

  // Touch Support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        isHovered: true,
      };
      if (hintVisible) setHintVisible(false);
    }
  };

  const handleTouchEnd = () => {
    mouseRef.current.isHovered = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-[180px] sm:h-[230px] md:h-[270px] overflow-hidden flex flex-col items-center justify-center cursor-crosshair select-none ${className}`}
      title="Click or move cursor over the text to scatter Lego particles"
    >
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />

      {/* Main Physics Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block absolute inset-0 z-10"
      />

      {/* Interactive Micro Hint Badge */}
      {subText && (
        <div className="absolute bottom-2 z-20 pointer-events-none transition-opacity duration-500">
          <span className="px-3 py-1 bg-white/90 dark:bg-black/60 text-on-surface dark:text-white backdrop-blur-sm border-2 border-on-surface/30 dark:border-white/20 rounded-full font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary dark:bg-brick-yellow animate-ping" />
            <span>{subText}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ParticleText;
