import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { experiencesData } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col items-start gap-2 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brick-green text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
          <Briefcase className="w-3.5 h-3.5" />
          <span>03 // TRACK RECORD & POSITIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-on-surface dark:text-white">
          EXPERIENCE & <span className="text-brick-green dark:text-emerald-400">LEADERSHIP</span>
        </h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 font-mono">
          Industry internships, campus academic roles, and technical organizations.
        </p>
      </div>

      {/* Experience Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiencesData.map((exp, idx) => (
          <div
            key={exp.id}
            className={`brick-card p-6 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] flex flex-col justify-between hover:-translate-y-1 transition-transform ${idx % 2 === 0 ? 'reveal-left delay-100' : 'reveal-right delay-200'}`}
          >
            {/* Top Accent Stud */}
            <div className="absolute -top-3 left-6 flex gap-1.5 pointer-events-none">
              <span className="w-3.5 h-3.5 rounded-full bg-brick-green border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            </div>

            <div className="space-y-4">
              {/* Type Badge & Period */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 bg-brick-yellow text-on-surface border border-on-surface text-[11px] font-mono font-bold rounded">
                  {exp.type.toUpperCase()}
                </span>
                <span className="font-mono text-xs font-bold text-primary dark:text-red-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {exp.period}
                </span>
              </div>

              {/* Role & Institution */}
              <div>
                <h3 className="text-lg font-display font-bold text-on-surface dark:text-white leading-snug">
                  {exp.role}
                </h3>
                <p className="text-xs font-mono font-bold text-brick-blue dark:text-sky-400 mt-1">
                  {exp.institution}
                </p>
                <p className="text-[11px] font-mono text-on-surface-variant dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary dark:text-red-400" /> {exp.location}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body leading-relaxed">
                {exp.description}
              </p>

              {/* Key Highlights */}
              <div className="space-y-1.5 pt-2 border-t border-on-surface/15 dark:border-white/10">
                <p className="text-[11px] font-mono font-bold text-on-surface-variant dark:text-slate-400 uppercase">
                  KEY ACHIEVEMENTS:
                </p>
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-on-surface dark:text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-brick-green dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div className="mt-6 pt-3 border-t-2 border-on-surface/15 dark:border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-surface-container dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] rounded text-[10px] font-mono font-bold text-on-surface dark:text-slate-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
