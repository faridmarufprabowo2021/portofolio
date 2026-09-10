import React, { useState } from 'react';
import { Terminal, Download, ArrowDown, Rocket, Sparkles, Zap, Layers, UserCheck, CreditCard } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { LegoCarTrack } from './LegoCarTrack';
import { Magnet } from './Magnet';
import { CountUp } from './CountUp';
import { DecryptedText } from './DecryptedText';
import { TrueFocus } from './TrueFocus';
import { VirtualFaridAvatar } from './VirtualFaridAvatar';
import { VirtualAnimeAvatar } from './VirtualAnimeAvatar';

export const Hero: React.FC = () => {
  const [heroView, setHeroView] = useState<'lego' | 'anime' | 'card'>('lego');
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden w-full"
    >
      {/* Background Dots & Ambient Baseplate Effect */}
      <div className="absolute inset-0 lego-dot-bg opacity-35 dark:opacity-20 pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Tech Identity & Narrative (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-left reveal-left">
          
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2.5 reveal delay-100">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brick-yellow animate-ping" />
              <span>{personalInfo.status}</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brick-yellow text-on-surface border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
              <img src="/assets/logo_ums.webp" alt="Logo UMS" className="w-4 h-4 object-contain" />
              <span><DecryptedText text="UMS INFORMATICS '26" speed={30} animateOn="hover" /></span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#161920] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
              <img src="/assets/logo_man1ska.webp" alt="Logo MAN 1 Surakarta" className="w-4 h-4 object-contain" />
              <span>ALUMNI MAN 1 SURAKARTA</span>
            </div>
          </div>

          {/* Main Headline (Option 2 - Professional & Purpose-Driven) */}
          <div className="space-y-3 reveal delay-150">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container dark:bg-[#161922] border border-on-surface/20 dark:border-[#2A2F3D] rounded-md font-mono text-[11px] font-bold text-on-surface-variant dark:text-slate-300">
              <span>👋 HI, I'M FARID MA'RUF PRABOWO</span>
            </div>

            <div className="py-1">
              <TrueFocus
                words={[
                  { text: 'ENGINEERING', className: 'text-on-surface dark:text-white' },
                  { text: 'SCALABLE', className: 'text-primary dark:text-red-500' },
                  { text: 'SYSTEMS', className: 'text-primary dark:text-red-500' },
                  { text: 'WITH', className: 'text-brick-blue dark:text-sky-400' },
                  { text: 'PURPOSE.', className: 'text-brick-blue dark:text-sky-400' },
                ]}
                blurAmount={3.5}
                borderColor="#FF2A85"
                glowColor="rgba(255, 42, 133, 0.4)"
                animationDuration={0.4}
                pauseBetweenAnimations={1.3}
                className="text-4xl sm:text-5xl lg:text-6xl leading-[1.12]"
              />
            </div>
            <p className="text-sm sm:text-base lg:text-lg font-mono font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-2 pt-1">
              <Terminal className="w-4 h-4 text-primary dark:text-red-400 shrink-0" />
              <DecryptedText
                text={personalInfo.bioHeadline}
                speed={35}
                maxIterations={8}
                animateOn="both"
                className="text-on-surface-variant dark:text-slate-200 font-mono font-bold"
              />
            </p>
          </div>

          {/* Bio Description (Persona, Philosophy & Purpose) */}
          <p className="text-sm sm:text-base text-on-surface dark:text-slate-300 font-body leading-relaxed max-w-2xl reveal delay-200">
            {personalInfo.about.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4 reveal delay-250">
            <Magnet strength={15}>
              <a
                href="#projects"
                className="px-6 py-3.5 bg-primary text-white font-mono text-xs sm:text-sm font-bold uppercase border-3 border-on-surface dark:border-[#2A2F3D] brick-btn inline-flex items-center gap-2 group"
              >
                <span>EXPLORE WORK</span>
                <Layers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </a>
            </Magnet>

            <Magnet strength={15}>
              <a
                href="#contact"
                className="px-6 py-3.5 bg-brick-yellow text-on-surface font-mono text-xs sm:text-sm font-bold uppercase border-3 border-on-surface dark:border-[#2A2F3D] brick-btn inline-flex items-center gap-2 hover:bg-yellow-400"
              >
                <span>INITIATE CONTACT</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </a>
            </Magnet>

            <a
              href={`mailto:${personalInfo.email}`}
              className="px-4 py-3 bg-white dark:bg-[#161920] text-on-surface dark:text-slate-200 font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm hover:bg-surface-container flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CONTACT EMAIL</span>
            </a>
          </div>

          {/* Bento Stats Counter Strip (Staggered Lego Snap) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl">
            <div className="p-2.5 bg-surface-container dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg text-center reveal-snap delay-300">
              <p className="text-sm sm:text-base font-display font-extrabold text-primary dark:text-red-400 leading-tight">
                {personalInfo.metrics[0].value}
              </p>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 mt-0.5">
                {personalInfo.metrics[0].label}
              </p>
            </div>

            <div className="p-2.5 bg-surface-container dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg text-center reveal-snap delay-350">
              <p className="text-sm sm:text-base font-display font-extrabold text-brick-blue dark:text-sky-400 leading-tight">
                {personalInfo.metrics[1].value}
              </p>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 mt-0.5">
                {personalInfo.metrics[1].label}
              </p>
            </div>

            <div className="p-2.5 bg-surface-container dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg text-center reveal-snap delay-400">
              <p className="text-sm sm:text-base font-display font-extrabold text-brick-yellow dark:text-brick-yellow leading-tight">
                <CountUp to={10} suffix="+" />
              </p>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 mt-0.5">
                {personalInfo.metrics[2].label}
              </p>
            </div>

            <div className="p-2.5 bg-surface-container dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg text-center reveal-snap delay-450">
              <p className="text-sm sm:text-base font-display font-extrabold text-primary dark:text-emerald-400 leading-tight">
                <CountUp to={25} suffix="+" />
              </p>
              <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 mt-0.5">
                {personalInfo.metrics[3].label}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Lego Car Track with 3D Minifigure / ID Card */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center reveal-right delay-200">
          
          {/* View Mode Switcher Pill */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-white dark:bg-[#161922] border-2 border-on-surface dark:border-[#2A2F3D] rounded-xl brick-shadow-sm mb-3 z-30">
            <button
              onClick={() => setHeroView('lego')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                heroView === 'lego'
                  ? 'bg-brick-yellow text-on-surface border border-on-surface shadow-sm font-black scale-105'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>🧱 3D Lego</span>
            </button>

            <button
              onClick={() => setHeroView('anime')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                heroView === 'anime'
                  ? 'bg-pink-500 text-white border border-on-surface shadow-sm font-black scale-105'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎌 3D Anime</span>
            </button>

            <button
              onClick={() => setHeroView('card')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                heroView === 'card'
                  ? 'bg-primary text-white border border-on-surface shadow-sm font-black scale-105'
                  : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>🪪 UMS Card</span>
            </button>
          </div>

          {/* Floating Accents */}
          <div className="absolute -top-3 right-2 z-30 px-3 py-1 bg-brick-blue text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold rounded-lg brick-shadow-sm animate-float-badge-2 hidden sm:flex items-center gap-1.5 pointer-events-none">
            <Zap className="w-3.5 h-3.5 text-brick-yellow" />
            <span>FULL-STACK & AI ARCHITECT</span>
          </div>

          <div className="absolute -bottom-3 left-2 z-30 px-3 py-1 bg-brick-yellow text-on-surface border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold rounded-lg brick-shadow-sm animate-float-badge-1 hidden sm:flex items-center gap-1.5 pointer-events-none">
            <Rocket className="w-3.5 h-3.5 text-primary" />
            <span>MABA UMS 2026 // EX-MAN 1</span>
          </div>

          {/* Animated Lego Car Track around Avatar / Anime / ID Card */}
          <LegoCarTrack speed={14}>
            {heroView === 'lego' ? (
              <VirtualFaridAvatar className="w-full max-w-sm" />
            ) : heroView === 'anime' ? (
              <VirtualAnimeAvatar className="w-full max-w-sm" />
            ) : (
              <div className="w-full max-w-sm brick-card bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] p-3 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center animate-fadeIn">
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border-2 border-on-surface dark:border-[#2A2F3D] bg-[#FBF9F8] dark:bg-[#12141A]">
                  <img
                    src="/assets/farid_lanyard_card.webp"
                    alt="Farid Ma'ruf Prabowo ID Card"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </LegoCarTrack>

        </div>

      </div>

      {/* Scroll Down Hint Button */}
      <a
        href="#about"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-full font-mono text-[11px] font-bold text-on-surface dark:text-slate-200 hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer z-10"
      >
        <span>SCROLL TO EXPLORE</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-primary dark:text-brick-yellow" />
      </a>

    </section>
  );
};
