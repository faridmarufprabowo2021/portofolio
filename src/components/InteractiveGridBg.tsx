import React, { useRef, useEffect } from 'react';

export const InteractiveGridBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 24;
    const lightColors = ['#AF101A', '#0055A4', '#FFD700', '#00852B'];
    const darkColors = ['#FF3B30', '#3A86FF', '#FFD700', '#00E676', '#00DFD8'];

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains('dark');
      const activeColors = isDark ? darkColors : lightColors;

      const mouse = mouseRef.current;
      const radius = 140; // Interaction radius around cursor

      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;

          let dotRadius = isDark ? 1.4 : 1.6;
          let color = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(26, 28, 28, 0.12)';

          if (mouse.active) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              const factor = 1 - dist / radius; // 1 at center, 0 at edge
              dotRadius = (isDark ? 1.4 : 1.6) + factor * 3.8;

              // Pick deterministic color based on grid position
              const colorIdx = (c + r) % activeColors.length;
              const chosenColor = activeColors[colorIdx];
              color = chosenColor;

              // Draw neon glow halo in dark mode
              if (isDark && factor > 0.25) {
                ctx.beginPath();
                ctx.arc(x, y, dotRadius + 4, 0, Math.PI * 2);
                ctx.strokeStyle = chosenColor;
                ctx.globalAlpha = factor * 0.45;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.globalAlpha = 1;
              } else if (!isDark && factor > 0.4) {
                ctx.beginPath();
                ctx.arc(x, y, dotRadius + 3, 0, Math.PI * 2);
                ctx.strokeStyle = chosenColor;
                ctx.globalAlpha = factor * 0.35;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
              }
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          draw();
          animFrameRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      draw();
    };

    const handleThemeChange = () => {
      draw();
    };

    const observer = new MutationObserver(() => {
      draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('themechange', handleThemeChange);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  );
};
