import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Sparkles } from 'lucide-react';
import { Magnet } from './Magnet';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Smart reveal: Show navbar only when user reaches Hero or later content
      const heroEl = document.getElementById('hero') || document.getElementById('about');
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        // Reveal navbar as soon as Hero section approaches viewport
        setShowNavbar(heroRect.top <= window.innerHeight * 0.7);
      } else {
        setShowNavbar(window.scrollY > window.innerHeight * 1.5);
      }

      setIsScrolled(window.scrollY > 20);

      const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-500 ease-out transform ${
        showNavbar
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto border-4 border-on-surface dark:border-[#2A2F3D] brick-shadow rounded-xl transition-all duration-200 px-4 sm:px-6 py-2.5 flex items-center justify-between ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#161920]/95 backdrop-blur-md shadow-brick-md'
            : 'bg-white dark:bg-[#161920]'
        }`}
      >
        {/* Brand / Logo */}
        <a href="#" className="group flex items-center gap-2 select-none">
          <div className="px-2.5 py-1 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm font-display font-extrabold text-sm sm:text-base tracking-wider flex items-center gap-1 group-hover:-rotate-2 transition-transform">
            <span>FARID</span>
            <span className="text-brick-yellow">.DEV</span>
          </div>
          <span className="hidden sm:inline font-mono text-[11px] font-bold text-on-surface-variant dark:text-slate-400">
            // UMS 2026
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                className={`font-mono text-xs font-bold px-3 py-1.5 transition-all duration-150 border-2 rounded ${
                  isActive
                    ? 'bg-brick-yellow text-on-surface border-on-surface dark:border-[#2A2F3D] brick-shadow-sm'
                    : 'text-on-surface dark:text-slate-200 hover:text-primary dark:hover:text-brick-yellow border-transparent hover:border-on-surface dark:hover:border-[#2A2F3D] hover:bg-surface-container dark:hover:bg-[#1E222B]'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Theme Toggle */}
          <ThemeToggle />

          <Magnet strength={15}>
            <button
              onClick={onOpenResume}
              className="px-3.5 py-1.5 bg-primary text-white text-xs font-mono font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] brick-btn flex items-center gap-1.5 cursor-pointer select-none"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESUME</span>
              <Sparkles className="w-3 h-3 text-brick-yellow" />
            </button>
          </Magnet>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border-2 border-on-surface dark:border-[#2A2F3D] rounded hover:bg-surface-container dark:hover:bg-[#1E222B] text-on-surface dark:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] brick-shadow rounded-xl p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-sm font-bold px-3 py-2 border-2 border-transparent hover:border-on-surface dark:hover:border-[#2A2F3D] hover:bg-brick-yellow hover:text-on-surface rounded text-on-surface dark:text-slate-200 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenResume();
            }}
            className="mt-2 w-full py-2.5 bg-primary text-white font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] brick-btn flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>VIEW RESUME</span>
          </button>
        </div>
      )}
    </header>
  );
};
