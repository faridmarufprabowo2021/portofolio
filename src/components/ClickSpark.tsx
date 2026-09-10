import React, { useRef, useEffect } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}

interface ClickSparkProps {
  colors?: string[];
  sparkCount?: number;
  sparkSize?: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  colors = ['#AF101A', '#0055A4', '#FFD700', '#00852B', '#FF3B30', '#00DFD8'],
  sparkCount = 10,
  sparkSize = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');

      if (sparksRef.current.length > 0) {
        for (let i = sparksRef.current.length - 1; i >= 0; i--) {
          const s = sparksRef.current[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.12; // Gentle gravity
          s.vx *= 0.96;
          s.vy *= 0.96;
          s.alpha -= s.decay;
          s.rotation += s.vRot;

          if (s.alpha <= 0) {
            sparksRef.current.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rotation);
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fillStyle = s.color;
          ctx.strokeStyle = isDark ? '#2A2F3D' : '#1A1C1C';
          ctx.lineWidth = 1;

          // Draw square Lego-brick spark particle
          const half = s.size / 2;
          ctx.fillRect(-half, -half, s.size, s.size);
          ctx.strokeRect(-half, -half, s.size, s.size);

          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(updateAndDraw);
      } else {
        animationFrameRef.current = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const speed = 2.5 + Math.random() * 4.5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: sparkSize + Math.random() * 4,
          color,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.3,
        });
      }

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateAndDraw);
      }
    };

    window.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [colors, sparkCount, sparkSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
};
