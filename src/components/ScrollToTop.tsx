import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 animate-fadeIn">
      {/* 2-Stud Yellow Lego Brick Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex flex-col items-center justify-center w-12 h-14 md:w-14 md:h-16 bg-brick-yellow border-4 border-on-surface brick-shadow transition-all duration-200 hover:-translate-y-1.5 hover:-rotate-3 hover:shadow-brick-lg active:translate-y-0.5 active:rotate-0 cursor-pointer select-none"
      >
        {/* Top 2 Studs on the Brick */}
        <div className="absolute -top-3 left-0 w-full flex justify-around px-2 pointer-events-none">
          <span className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-t-md bg-brick-yellow border-t-2 border-x-2 border-b-0 border-on-surface" />
          <span className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-t-md bg-brick-yellow border-t-2 border-x-2 border-b-0 border-on-surface" />
        </div>

        {/* Content Inside the Brick */}
        <div className="flex flex-col items-center justify-center z-10 pt-0.5">
          <ArrowUp className="w-5 h-5 text-on-surface font-extrabold transition-transform duration-200 group-hover:-translate-y-1" />
          <span className="font-mono text-[9px] md:text-[10px] font-black text-on-surface tracking-wider leading-none mt-0.5">
            TOP
          </span>
        </div>
      </button>
    </div>
  );
};
