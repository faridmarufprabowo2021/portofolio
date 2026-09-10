import React, { useRef, useEffect, useState, Suspense, lazy } from 'react';
import { ChevronDown, FastForward, Sparkles, Terminal } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const LanyardCard = lazy(() => import('./LanyardCard').then((m) => ({ default: m.LanyardCard })));

const TOTAL_FRAMES = 214;
const getFrameSrc = (index: number) =>
  `/frames/frame_${index.toString().padStart(5, '0')}.webp`;

export const LegoIntroSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  const framesCache = useRef<(HTMLImageElement | undefined)[]>([]);
  const isLoadedMap = useRef<boolean[]>(Array(TOTAL_FRAMES + 1).fill(false));

  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const lastDrawnFrameRef = useRef<number>(-1);
  const animFrameIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);

  const [show3DCard, setShow3DCard] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Preloading system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#0D0F12' : '#FBF9F8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const frames: (HTMLImageElement | undefined)[] = Array(TOTAL_FRAMES + 1);
    framesCache.current = frames;

    const drawFrame = (frameNum: number) => {
      const idx = Math.max(1, Math.min(TOTAL_FRAMES, frameNum));
      if (lastDrawnFrameRef.current === idx && frames[idx]?.complete) return;

      const img = frames[idx];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnFrameRef.current = idx;
      } else {
        // Fallback to nearest loaded frame
        for (let offset = 1; offset <= 25; offset++) {
          const prev = idx - offset;
          const next = idx + offset;
          if (prev >= 1 && frames[prev]?.complete && (frames[prev]?.naturalWidth ?? 0) > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(frames[prev]!, 0, 0, canvas.width, canvas.height);
            lastDrawnFrameRef.current = prev;
            break;
          }
          if (next <= TOTAL_FRAMES && frames[next]?.complete && (frames[next]?.naturalWidth ?? 0) > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(frames[next]!, 0, 0, canvas.width, canvas.height);
            lastDrawnFrameRef.current = next;
            break;
          }
        }
      }
    };

    const loadSingle = (index: number, highPriority = false) => {
      if (index < 1 || index > TOTAL_FRAMES || frames[index]) return;
      const img = new Image();
      if (highPriority && 'fetchPriority' in img) {
        (img as any).fetchPriority = 'high';
      }
      img.src = getFrameSrc(index);
      img.onload = () => {
        frames[index] = img;
        isLoadedMap.current[index] = true;
        if (index === 1 && lastDrawnFrameRef.current === -1) {
          drawFrame(1);
        }
        if (Math.round(currentFrameRef.current) === index) {
          drawFrame(index);
        }
      };
      frames[index] = img;
    };

    // 1. High priority: first few frames & smash sequence frames
    [1, 2, 3, 4, 5, 138, 140, 142, 200, 205, 210, 214].forEach((f) => loadSingle(f, true));

    // 2. Sparse load
    for (let f = 10; f <= TOTAL_FRAMES; f += 4) {
      loadSingle(f, false);
    }

    // 3. Background idle load all remaining frames
    let currentBatch = 1;
    const loadRemaining = () => {
      const end = Math.min(TOTAL_FRAMES, currentBatch + 12);
      for (let i = currentBatch; i <= end; i++) {
        loadSingle(i, false);
      }
      currentBatch = end + 1;
      if (currentBatch <= TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadRemaining);
        } else {
          setTimeout(loadRemaining, 35);
        }
      }
    };
    loadRemaining();

    // Frame interpolation engine
    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.4;
        const target = Math.round(currentFrameRef.current);
        drawFrame(target);

        // Preload immediate neighbors
        for (let i = -3; i <= 3; i++) {
          const neighbor = target + i;
          if (neighbor >= 1 && neighbor <= TOTAL_FRAMES) {
            loadSingle(neighbor, true);
          }
        }

        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        if (currentFrameRef.current !== targetFrameRef.current) {
          currentFrameRef.current = targetFrameRef.current;
          drawFrame(Math.round(currentFrameRef.current));
        }
        isLoopRunningRef.current = false;
      }
    };

    const triggerRender = () => {
      if (!isLoopRunningRef.current) {
        isLoopRunningRef.current = true;
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      }
    };

    triggerRender();

    // Scroll listener for frame scrubbing
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      let progress = 0;

      if (totalScrollable > 0) {
        progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      }

      setScrollProgress(progress);

      let targetFrame = 1;
      if (progress <= 0.88) {
        targetFrame = 1 + Math.floor((progress / 0.88) * (TOTAL_FRAMES - 1));
      } else {
        targetFrame = TOTAL_FRAMES;
      }

      targetFrame = Math.max(1, Math.min(TOTAL_FRAMES, targetFrame));

      if (targetFrameRef.current !== targetFrame) {
        targetFrameRef.current = targetFrame;
        triggerRender();
      }

      // Trigger 3D Card appearance when wall smashes (frame >= 135 or progress >= 0.52)
      if (targetFrame >= 135 || progress >= 0.52) {
        setShow3DCard(true);
      } else {
        setShow3DCard(false);
      }

      // Fade HUD when scrolling begins
      if (hudRef.current) {
        if (progress > 0.05) {
          hudRef.current.style.opacity = `${Math.max(0, 1 - progress * 6)}`;
          hudRef.current.style.pointerEvents = 'none';
        } else {
          hudRef.current.style.opacity = '1';
          hudRef.current.style.pointerEvents = 'auto';
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      isLoopRunningRef.current = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSkipIntro = () => {
    const heroEl = document.getElementById('about');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else if (containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop + containerRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="h-[280vh] w-full relative z-40 bg-[#FBF9F8] dark:bg-[#0D0F12] transition-colors"
      aria-label="Lego Stop-Motion Interactive Intro Sequence"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#FBF9F8] dark:bg-[#0D0F12]">
        
        {/* Canvas Image Sequence Player */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-100 translate-y-6 md:translate-y-10"
          style={{ maxHeight: '100vh' }}
        />

        {/* 3D Physics Lanyard Card Dropping In through Shattered Wall */}
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
            show3DCard
              ? 'opacity-100 translate-y-6 md:translate-y-10 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-40 scale-90 pointer-events-none'
          }`}
        >
          {show3DCard && (
            <div className="w-full max-w-md sm:max-w-lg h-[540px] md:h-[600px] relative pointer-events-auto">
              <Suspense fallback={null}>
                <LanyardCard transparent={true} />
              </Suspense>
            </div>
          )}
        </div>

        {/* Top HUD Brand Badge */}
        <div className="absolute top-6 left-6 z-50 flex items-center gap-2 select-none">
          <div className="px-3 py-1 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm font-display font-extrabold text-xs tracking-wider flex items-center gap-1.5 rounded-md">
            <span>FARID.DEV</span>
            <span className="text-brick-yellow font-mono">// 2026</span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 bg-white dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] text-on-surface dark:text-slate-200 font-mono text-[10px] font-bold rounded-md brick-shadow-sm">
            MABA UMS • ALUMNI MAN 1 SKA
          </span>
        </div>

        {/* Top Right: Theme Toggle & Skip Intro Button */}
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2.5 select-none">
          <ThemeToggle />
          <button
            onClick={handleSkipIntro}
            className="px-3.5 py-1.5 bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg font-mono text-xs font-bold uppercase brick-btn hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface flex items-center gap-1.5 cursor-pointer select-none"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Starting HUD Hint */}
        <div
          ref={hudRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-200"
        >
          <div className="px-4 py-2 bg-brick-yellow text-on-surface border-3 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-xl font-mono text-xs font-extrabold uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span>SCROLL TO DETONATE & REVEAL</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-on-surface dark:text-slate-300 bg-white/80 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-on-surface/20">
            <span>SCROLL DOWN</span>
            <ChevronDown className="w-3.5 h-3.5 text-primary animate-bounce" />
          </div>
        </div>

        {/* Progress Bar along bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-on-surface/10 dark:bg-white/10 z-50">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${Math.min(100, scrollProgress * 100)}%` }}
          />
        </div>

      </div>

      {/* Lego Cloud Transition Divider at Bottom */}
      <div className="relative w-full z-40 pointer-events-none select-none -mt-[14vw] md:-mt-[18vw] lg:-mt-[21vw] mb-[-3vw] leading-none overflow-hidden">
        <img
          src="/assets/awan-section.webp"
          alt="Cloud Transition Bottom"
          className="w-full h-auto object-cover translate-y-1"
        />
      </div>
    </section>
  );
};
