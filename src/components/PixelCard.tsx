import React, { useRef, useEffect } from 'react';

interface PixelCardProps {
  children?: React.ReactNode;
  variant?: 'yellow' | 'blue' | 'red' | 'emerald' | 'default';
  pixelSize?: number;
  gap?: number;
  speed?: number;
  className?: string;
  colors?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  variant = 'yellow',
  pixelSize = 16,
  gap = 3,
  speed = 18,
  className = '',
  colors,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<
    Map<string, { x: number; y: number; alpha: number; maxAlpha: number; color: string }>
  >(new Map());
  const mouseRef = useRef<{ x: number; y: number; isHovered: boolean }>({
    x: -1000,
    y: -1000,
    isHovered: false,
  });
  const animFrameRef = useRef<number | null>(null);

  // Determine color palette based on variant
  const palette = React.useMemo(() => {
    if (colors) return colors.split(',');
    switch (variant) {
      case 'yellow':
        return ['#FFD700', '#F59E0B', '#FBBF24', '#D97706'];
      case 'blue':
        return ['#0055A4', '#0284C7', '#38BDF8', '#0369A1'];
      case 'red':
        return ['#AF101A', '#DC2626', '#EF4444', '#B91C1C'];
      case 'emerald':
        return ['#00852B', '#059669', '#10B981', '#047857'];
      case 'default':
      default:
        return ['#FFD700', '#0055A4', '#AF101A', '#00852B'];
    }
  }, [variant, colors]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const step = pixelSize + gap;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Add new pixels if mouse is hovered
      if (mouseRef.current.isHovered) {
        const radius = 64;
        const startX = Math.max(0, Math.floor((mouseRef.current.x - radius) / step) * step);
        const endX = Math.min(width, Math.ceil((mouseRef.current.x + radius) / step) * step);
        const startY = Math.max(0, Math.floor((mouseRef.current.y - radius) / step) * step);
        const endY = Math.min(height, Math.ceil((mouseRef.current.y + radius) / step) * step);

        for (let x = startX; x <= endX; x += step) {
          for (let y = startY; y <= endY; y += step) {
            const dist = Math.hypot(x + pixelSize / 2 - mouseRef.current.x, y + pixelSize / 2 - mouseRef.current.y);
            if (dist <= radius) {
              const key = `${x},${y}`;
              const current = pixelsRef.current.get(key);
              const intensity = (1 - dist / radius);
              const targetAlpha = Math.min(0.85, intensity * 0.95);

              if (!current || current.alpha < targetAlpha) {
                const randomColor = palette[Math.floor(Math.random() * palette.length)];
                pixelsRef.current.set(key, {
                  x,
                  y,
                  alpha: targetAlpha,
                  maxAlpha: targetAlpha,
                  color: randomColor,
                });
              }
            }
          }
        }
      }

      // Draw and decay active pixels
      const fadeRate = 0.035 * (speed / 20);
      pixelsRef.current.forEach((pixel, key) => {
        ctx.fillStyle = pixel.color;
        ctx.globalAlpha = pixel.alpha;
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);

        pixel.alpha -= fadeRate;
        if (pixel.alpha <= 0) {
          pixelsRef.current.delete(key);
        }
      });

      ctx.globalAlpha = 1.0;

      // Keep animation running if hovered or active pixels remain
      if (mouseRef.current.isHovered || pixelsRef.current.size > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovered: true,
      };

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovered: true,
      };
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pixelSize, gap, speed, palette]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80 dark:opacity-90"
      />
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
};

export default PixelCard;
