import React from 'react';
import { User, GraduationCap, MapPin, CheckCircle2, Box, Award, School } from 'lucide-react';
import { personalInfo, educationData } from '../data/portfolioData';
import { PixelCard } from './PixelCard';
import { DecryptedText } from './DecryptedText';

export const About: React.FC = () => {
  const [umsEdu, manEdu] = educationData;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header with Studs */}
      <div className="mb-12 flex flex-col items-start gap-2 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brick-blue text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
          <User className="w-3.5 h-3.5" />
          <span><DecryptedText text="01 // IDENTITY & ACADEMIC BACKGROUND" speed={30} animateOn="view" /></span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-on-surface dark:text-white">
          ABOUT <span className="text-primary dark:text-red-500"><DecryptedText text="FARID" speed={35} animateOn="both" /></span>
        </h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 font-mono">
          Maba Teknik Informatika UMS 2026 & Alumni MAN 1 Surakarta — Building scalable systems modularly.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Story & Engineering Mindset (7 Cols) */}
        <div className="md:col-span-7 brick-card p-6 sm:p-8 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] flex flex-col justify-between reveal-left delay-100">
          
          {/* Top Studs Accent */}
          <div className="absolute -top-3.5 right-8 flex gap-2 pointer-events-none">
            <span className="w-4 h-4 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary dark:text-red-400 font-mono text-xs font-bold uppercase">
              <Box className="w-4 h-4" />
              <span>THE LEGO METAPHOR IN CODE</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-on-surface dark:text-white">
              {personalInfo.about.intro}
            </h3>

            <p className="text-sm sm:text-base text-on-surface dark:text-slate-300 font-body leading-relaxed">
              {personalInfo.about.description}
            </p>

            <div className="space-y-2.5 pt-2">
              {personalInfo.about.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body">
                  <CheckCircle2 className="w-4 h-4 text-brick-green dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-on-surface/15 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-on-surface-variant dark:text-slate-400 font-bold">CORE FOCUS: FULL-STACK, AI & COMPUTER VISION</span>
            <span className="px-2.5 py-1 bg-surface-container dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] rounded font-bold text-primary dark:text-brick-yellow">
              #UMS2026 #MAN1Surakarta
            </span>
          </div>

        </div>

        {/* Card 2: Academic Journey (UMS + MAN 1 Surakarta) (5 Cols) */}
        <div className="md:col-span-5 brick-card p-6 sm:p-8 bg-surface-container dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] flex flex-col justify-between reveal-right delay-200">
          
          {/* Top Studs Accent */}
          <div className="absolute -top-3.5 left-8 flex gap-2 pointer-events-none">
            <span className="w-4 h-4 rounded-full bg-primary border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            <span className="w-4 h-4 rounded-full bg-primary border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-brick-blue dark:text-sky-400 font-mono text-xs font-bold uppercase">
              <GraduationCap className="w-4 h-4" />
              <span>ACADEMIC FOUNDATION</span>
            </div>

            {/* University Level: UMS */}
            <PixelCard
              variant="blue"
              pixelSize={16}
              gap={3}
              className="p-4 bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded-xl brick-shadow-sm space-y-3 reveal-snap delay-300"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-mono font-bold rounded">
                  PERGURUAN TINGGI
                </span>
                <span className="text-xs font-mono font-bold text-brick-green dark:text-emerald-400">
                  2026 — 2030 (MABA)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 p-1.5 bg-white dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] rounded-xl brick-shadow-sm flex items-center justify-center shrink-0">
                  <img src="/assets/logo_ums.webp" alt="Logo UMS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-on-surface dark:text-white leading-tight">
                    {umsEdu.institution}
                  </h3>
                  <p className="text-xs font-mono font-bold text-primary dark:text-red-400 mt-0.5">
                    {umsEdu.degree}
                  </p>
                </div>
              </div>
              <p className="text-xs text-on-surface dark:text-slate-300 font-body leading-relaxed">
                {umsEdu.description}
              </p>
            </PixelCard>

            {/* High School Level: MAN 1 Surakarta */}
            {manEdu && (
              <PixelCard
                variant="emerald"
                pixelSize={16}
                gap={3}
                className="p-4 bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded-xl brick-shadow-sm space-y-3 reveal-snap delay-400"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-brick-blue text-white text-[10px] font-mono font-bold rounded flex items-center gap-1">
                    <School className="w-3 h-3" /> ALUMNI 2026
                  </span>
                  <span className="text-xs font-mono font-bold text-on-surface-variant dark:text-slate-400">
                    2023 — 2026
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 p-1.5 bg-white dark:bg-[#161920] border-2 border-on-surface dark:border-[#2A2F3D] rounded-xl brick-shadow-sm flex items-center justify-center shrink-0">
                    <img src="/assets/logo_man1ska.webp" alt="Logo MAN 1 Surakarta" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-display font-bold text-on-surface dark:text-white leading-tight">
                      {manEdu.institution}
                    </h4>
                    <p className="text-xs font-mono font-bold text-brick-blue dark:text-sky-400 mt-0.5">
                      {manEdu.degree}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-on-surface dark:text-slate-300 font-body leading-relaxed">
                  {manEdu.description}
                </p>
              </PixelCard>
            )}

          </div>

          <div className="mt-6 pt-4 border-t-2 border-on-surface/15 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 text-on-surface-variant dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-primary dark:text-red-400" /> Surakarta, Jawa Tengah
            </span>
            <span className="flex items-center gap-1 font-bold text-primary dark:text-brick-yellow">
              <Award className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>

        </div>

      </div>

    </section>
  );
};
