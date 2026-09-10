import React, { useRef, useEffect } from 'react';

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
  amplitude: number;
}

interface CursorWaveProps {
  gridSpacing?: number;
  shapeType?: 'stud' | 'circle' | 'square' | 'cross';
  waveRadius?: number;
}

export const CursorWave: React.FC<CursorWaveProps> = ({
  gridSpacing = 28,
  shapeType = 'stud',
  waveRadius = 190,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    active: boolean;
    lastActiveTime: number;
  }>({
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    active: false,
    lastActiveTime: 0,
  });

  const ripplesRef = useRef<Ripple[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const lightColors = ['#AF101A', '#0055A4', '#FFD700', '#00852B'];
    const darkColors = ['#FF3B30', '#00DFD8', '#FFD700', '#00E676', '#3A86FF'];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      draw();
    };

    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      if (!mouseRef.current.active) {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
      mouseRef.current.active = true;
      mouseRef.current.lastActiveTime = performance.now();

      startAnimationLoop();
    };

    const handlePointerDown = (e: PointerEvent) => {
      const now = performance.now();
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
      mouseRef.current.lastActiveTime = now;

      // Add shockwave ripple on click
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: now,
        duration: 1300, // ms
        maxRadius: Math.max(width, height) * 0.9,
        amplitude: 32,
      });

      startAnimationLoop();
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    let isRunning = false;

    function startAnimationLoop() {
      if (!isRunning) {
        isRunning = true;
        animFrameRef.current = requestAnimationFrame(loop);
      }
    }

    function loop() {
      const now = performance.now();
      const mouse = mouseRef.current;

      // Smooth mouse lerp
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.x += dx * 0.22;
      mouse.y += dy * 0.22;

      // Clean up finished ripples
      ripplesRef.current = ripplesRef.current.filter(
        (r) => now - r.startTime < r.duration
      );

      draw();

      const isMouseRecentlyActive = mouse.active || now - mouse.lastActiveTime < 1800;
      const hasRipples = ripplesRef.current.length > 0;

      if (isMouseRecentlyActive || hasRipples || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const activeColors = isDark ? darkColors : lightColors;
      const now = performance.now();
      const timeSec = now * 0.003;

      const cols = Math.ceil(width / gridSpacing) + 1;
      const rows = Math.ceil(height / gridSpacing) + 1;

      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = c * gridSpacing;
          const originY = r * gridSpacing;

          let posX = originX;
          let posY = originY;
          let scale = 1.0;
          let colorMix = 0;
          let customColor = '';

          // 1. Continuous Cursor Wave Proximity Effect
          if (mouse.active || now - mouse.lastActiveTime < 1600) {
            const distMouseX = originX - mouse.x;
            const distMouseY = originY - mouse.y;
            const distMouse = Math.sqrt(distMouseX * distMouseX + distMouseY * distMouseY);

            if (distMouse < waveRadius) {
              const normDist = distMouse / waveRadius; // 0 to 1
              const falloff = Math.cos(normDist * (Math.PI / 2)); // Smooth cosine falloff
              
              // Wave displacement
              const wavePhase = distMouse * 0.05 - timeSec * 2.8;
              const waveAmp = Math.sin(wavePhase) * falloff * 8;
              
              const angle = Math.atan2(distMouseY, distMouseX);
              posX += Math.cos(angle) * waveAmp;
              posY += Math.sin(angle) * waveAmp;

              scale += falloff * 2.0;
              colorMix = Math.max(colorMix, falloff);

              const colorIndex = (c + r) % activeColors.length;
              customColor = activeColors[colorIndex];
            }
          }

          // 2. Click Shockwave Propagation (Wave Detonation)
          for (let i = 0; i < ripples.length; i++) {
            const rip = ripples[i];
            const elapsed = now - rip.startTime;
            const progress = elapsed / rip.duration; // 0 to 1
            const currentRadius = progress * rip.maxRadius;

            const distRipX = originX - rip.x;
            const distRipY = originY - rip.y;
            const distRip = Math.sqrt(distRipX * distRipX + distRipY * distRipY);

            const waveThickness = 140;
            const distFromFront = Math.abs(distRip - currentRadius);

            if (distFromFront < waveThickness) {
              const frontFactor = 1 - distFromFront / waveThickness;
              const intensity = frontFactor * (1 - progress); // Decay over time
              const displacement = Math.sin(frontFactor * Math.PI) * rip.amplitude * intensity;

              const angle = Math.atan2(distRipY, distRipX);
              posX += Math.cos(angle) * displacement;
              posY += Math.sin(angle) * displacement;

              scale += intensity * 2.6;
              colorMix = Math.max(colorMix, intensity * 1.3);

              const colorIndex = (c + r + i) % activeColors.length;
              customColor = activeColors[colorIndex];
            }
          }

          // 3. Render Shape (Lego Stud / Circle)
          const baseRadius = isDark ? 1.4 : 1.6;
          const currentRadius = Math.max(0.5, baseRadius * scale);

          ctx.save();
          ctx.translate(posX, posY);

          if (colorMix > 0.05 && customColor) {
            ctx.fillStyle = customColor;
            ctx.globalAlpha = Math.min(1, 0.2 + colorMix * 0.85);

            // Glowing Neon Aura in Dark Mode
            if (isDark && colorMix > 0.2) {
              ctx.beginPath();
              ctx.arc(0, 0, currentRadius + 3.5, 0, Math.PI * 2);
              ctx.strokeStyle = customColor;
              ctx.lineWidth = 1.2;
              ctx.globalAlpha = colorMix * 0.45;
              ctx.stroke();
              ctx.globalAlpha = Math.min(1, 0.2 + colorMix * 0.85);
            }
          } else {
            ctx.fillStyle = isDark
              ? 'rgba(255, 255, 255, 0.09)'
              : 'rgba(26, 28, 28, 0.12)';
            ctx.globalAlpha = 1;
          }

          // Draw chosen shape
          if (shapeType === 'stud') {
            // Tactile 3D Lego Stud with inner bevel
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            if (scale > 1.3) {
              ctx.beginPath();
              ctx.arc(0, 0, currentRadius * 0.55, 0, Math.PI * 2);
              ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)';
              ctx.fill();
            }
          } else if (shapeType === 'cross') {
            const size = currentRadius * 1.6;
            ctx.fillRect(-size, -size * 0.3, size * 2, size * 0.6);
            ctx.fillRect(-size * 0.3, -size, size * 0.6, size * 2);
          } else if (shapeType === 'square') {
            const size = currentRadius * 1.5;
            ctx.fillRect(-size, -size, size * 2, size * 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }
    }

    const observer = new MutationObserver(() => {
      draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('themechange', draw);
    draw();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('themechange', draw);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gridSpacing, shapeType, waveRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};
