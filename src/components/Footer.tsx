import React from 'react';
import { Mail } from 'lucide-react';
import { personalInfo, socialLinks } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './Icons';
import { Magnet } from './Magnet';
import { ParticleText } from './ParticleText';

export const Footer: React.FC = () => {
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <footer className="w-full bg-[#F3F4F6] dark:bg-[#07080A] text-on-surface dark:text-white border-t-4 border-on-surface dark:border-[#2A2F3D] pt-8 pb-12 px-4 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      {/* 3 Top Corner Studs Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 pointer-events-none z-20">
        <span className="w-4 h-4 rounded-full bg-primary border-2 border-on-surface shadow-inner" />
        <span className="w-4 h-4 rounded-full bg-brick-yellow border-2 border-on-surface shadow-inner" />
        <span className="w-4 h-4 rounded-full bg-brick-blue border-2 border-on-surface shadow-inner" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        
        {/* Interactive Hero-Sized Particle Text */}
        <div className="w-full border-4 border-on-surface dark:border-white/10 rounded-2xl bg-white dark:bg-black/40 backdrop-blur-sm p-2 sm:p-4 brick-shadow-lg relative overflow-hidden">
          <ParticleText
            text="FARID.DEV"
            particleSize={2.5}
            particleGap={4.2}
            mouseRadius={105}
            subText="INTERACTIVE LEGO PARTICLE ENGINE // TOUCH, DRAG OR CLICK"
          />
        </div>

        {/* Bottom Metadata Bar */}
        <div className="w-full pt-6 border-t-2 border-on-surface/15 dark:border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 reveal">
          
          {/* Brand & Metaphor */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2 py-0.5 bg-brick-yellow text-on-surface font-display font-black text-sm border-2 border-on-surface rounded brick-shadow-sm">
                FARID.DEV
              </span>
              <span className="font-mono text-xs font-bold text-on-surface/80 dark:text-slate-400">
                // UMS 2026
              </span>
            </div>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-mono">
              {personalInfo.role} • {personalInfo.university}
            </p>
          </div>

          {/* Social Links with Magnet Effect */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <Magnet key={s.name} strength={10}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="p-2.5 bg-white dark:bg-[#1E222B] text-on-surface dark:text-white hover:bg-brick-yellow dark:hover:bg-brick-yellow hover:text-on-surface border-2 border-on-surface dark:border-[#2A2F3D] rounded-full transition-all duration-200 brick-shadow-sm hover:scale-110 flex items-center justify-center"
                >
                  {getSocialIcon(s.name)}
                </a>
              </Magnet>
            ))}
          </div>

          {/* Copyright & Location */}
          <div className="text-center md:text-right text-xs font-mono space-y-0.5">
            <p className="text-on-surface dark:text-white font-bold flex items-center justify-center md:justify-end gap-1">
              <span>© 2026 {personalInfo.name.toUpperCase()}</span>
              <span className="text-primary dark:text-brick-yellow">• BUILT BY BRICK</span>
            </p>
            <p className="text-on-surface-variant dark:text-slate-500 text-[11px]">
              {personalInfo.location.toUpperCase()}
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};
