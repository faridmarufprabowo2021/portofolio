import React from 'react';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';
import { certificationsData } from '../data/portfolioData';

export const Certifications: React.FC = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start gap-2 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brick-blue text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
          <Award className="w-3.5 h-3.5" />
          <span>05 // CREDENTIALS & CERTIFICATES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-on-surface dark:text-white">
          VERIFIED <span className="text-brick-blue dark:text-sky-400">CERTIFICATIONS</span>
        </h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 font-mono">
          Industry accreditations in Full-Stack, Databases, and Cloud Containers.
        </p>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certificationsData.map((cert, idx) => {
          const delays = ['delay-100', 'delay-200', 'delay-300'];
          const delayClass = delays[idx % delays.length];

          return (
            <div
              key={cert.id}
              className={`brick-card p-6 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] flex flex-col justify-between hover:-translate-y-1 transition-transform reveal-snap ${delayClass}`}
            >
            {/* Top Stud */}
            <div className="absolute -top-3 right-6 flex gap-1.5 pointer-events-none">
              <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-surface-container dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] font-mono text-[11px] font-bold rounded text-primary dark:text-red-400">
                  ISSUED: {cert.date}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-brick-green dark:text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> VERIFIED
                </span>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-on-surface dark:text-white leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono font-bold text-brick-blue dark:text-sky-400 mt-0.5">
                  {cert.issuer}
                </p>
                <p className="text-[11px] font-mono text-on-surface-variant dark:text-slate-400 mt-1">
                  ID: <span className="text-primary dark:text-brick-yellow font-bold">{cert.credentialId}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {cert.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-surface dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] text-[10px] font-mono font-bold text-on-surface dark:text-slate-200 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {cert.verifyUrl && (
              <div className="mt-5 pt-3 border-t-2 border-on-surface/15 dark:border-white/10">
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-surface-container dark:bg-[#1E222B] text-on-surface dark:text-slate-200 font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>VERIFY CREDENTIAL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
          );
        })}
      </div>

    </section>
  );
};
