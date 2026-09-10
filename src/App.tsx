import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LegoIntroSequence } from './components/LegoIntroSequence';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ResumeModal } from './components/ResumeModal';
import { ClickSpark } from './components/ClickSpark';
import { CursorWave } from './components/CursorWave';
import { ScrollVelocity } from './components/ScrollVelocity';

export const App: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    // Reduced motion check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-snap, .reveal-left, .reveal-right, .reveal-pop').forEach((el) => {
        el.classList.add('reveal-visible');
      });
      return;
    }

    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
    );

    const observeElements = () => {
      document.querySelectorAll(
        '.reveal:not(.reveal-visible), .reveal-snap:not(.reveal-visible), .reveal-left:not(.reveal-visible), .reveal-right:not(.reveal-visible), .reveal-pop:not(.reveal-visible)'
      ).forEach((el) => {
        observer.observe(el);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F9F9F9] dark:bg-[#0D0F12] text-on-surface dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between selection:bg-primary selection:text-white">
      {/* React Bits Pro Style: Interactive Cursor Wave Background */}
      <CursorWave gridSpacing={28} shapeType="stud" waveRadius={190} />

      {/* React Bits: Lego Multi-color Click Spark Overlay */}
      <ClickSpark colors={['#AF101A', '#0055A4', '#FFD700', '#00852B', '#FF3B30', '#00DFD8']} sparkCount={10} sparkSize={4} />

      {/* Navigation Header */}
      <Navbar onOpenResume={() => setIsResumeOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1 w-full overflow-x-clip">
        {/* Lego Stop-Motion Image Sequence Intro */}
        <LegoIntroSequence />

        {/* Portfolio Content Sections */}
        <Hero />

        {/* React Bits Pro: Scroll Velocity Ticker Ribbon (Hero -> About) */}
        <div className="w-full bg-brick-yellow text-on-surface border-y-4 border-on-surface dark:border-[#2A2F3D] shadow-md my-6 -rotate-1 transform-gpu">
          <ScrollVelocity
            texts={[
              "★ FARID MA'RUF PRABOWO • INFORMATIKA UMS 2026 • FULL-STACK & AI ARCHITECT • ALUMNI MAN 1 SURAKARTA • BRICK BY BRICK",
              "FASTAPI • REACT 19 • OPENCV • DOCKER • TYPESCRIPT • TAILWIND CSS • REDIS • POSTGRESQL • LINUX"
            ]}
            velocity={0.65}
            className="py-1"
            parallaxClassName="py-0.5"
            reverse={[false, true]}
          />
        </div>

        <About />
        <Skills />
        <Experience />
        <Projects />

        {/* React Bits Pro: Scroll Velocity Ticker Ribbon (Projects -> Certifications) */}
        <div className="w-full bg-primary text-white border-y-4 border-on-surface dark:border-[#2A2F3D] shadow-md my-8 rotate-1 transform-gpu">
          <ScrollVelocity
            texts={[
              "⚡ MODULAR ARCHITECTURE • PRODUCTION READY • CLEAN CODE • HIGH PERFORMANCE • 100% LIGHTHOUSE COMPLIANT"
            ]}
            velocity={0.8}
            className="py-1.5"
            reverse={[false]}
          />
        </div>

        <Certifications />
        <Contact />
      </main>

      {/* Footer & Floating Controls */}
      <div className="relative z-10">
        <Footer />
      </div>
      <ScrollToTop />

      {/* In-App Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default App;
