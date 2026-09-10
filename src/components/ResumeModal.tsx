import React from 'react';
import { X, ExternalLink, GraduationCap, Briefcase, Code, Award, MapPin, Mail, Zap } from 'lucide-react';
import { personalInfo, educationData, experiencesData, skillCategories, certificationsData } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] brick-shadow-xl rounded-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Lego Studs */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none z-20">
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
        </div>

        {/* Modal Window Header */}
        <div className="bg-primary text-white border-b-4 border-on-surface dark:border-[#2A2F3D] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-brick-yellow text-on-surface font-mono text-xs font-bold border-2 border-on-surface">
              CURRICULUM VITAE // DOC-2026
            </span>
            <span className="hidden sm:inline text-xs font-mono opacity-90">
              {personalInfo.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-bold text-sm brick-shadow-sm hover:bg-brick-yellow flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Resume Content Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh] space-y-8 bg-white dark:bg-[#161920]">
          
          {/* Header Banner inside CV */}
          <div className="p-6 bg-surface-container dark:bg-[#1E222B] border-3 border-on-surface dark:border-[#2A2F3D] brick-shadow rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 bg-brick-blue border-3 border-on-surface dark:border-[#2A2F3D] rounded-lg overflow-hidden brick-shadow-sm shrink-0">
                <img src="/images.webp" alt={personalInfo.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-on-surface dark:text-white">
                  {personalInfo.name}
                </h2>
                <p className="text-primary dark:text-red-400 font-bold font-mono text-sm mt-0.5">
                  {personalInfo.role} • {personalInfo.university} (Class of {personalInfo.batch})
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-on-surface-variant dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary dark:text-red-400" /> {personalInfo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-primary dark:text-red-400" /> {personalInfo.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href="#contact"
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] brick-btn inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" /> HIRE ME
              </a>
            </div>
          </div>

          {/* Section: Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1.5">
              <span className="w-2.5 h-2.5 bg-primary dark:bg-red-400 rounded-full" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Executive Profile Summary
              </h3>
            </div>
            <p className="text-sm text-on-surface dark:text-slate-300 leading-relaxed font-body">
              {personalInfo.about.description}
            </p>
          </div>

          {/* Section: Education */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1.5">
              <GraduationCap className="w-4 h-4 text-brick-blue dark:text-sky-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Academic Background
              </h3>
            </div>
            {educationData.map((edu, idx) => (
              <div key={idx} className="p-4 bg-surface dark:bg-[#1E222B] rounded-lg border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-2.5">
                    {edu.logo && (
                      <div className="w-8 h-8 p-1 bg-white dark:bg-[#161920] border border-on-surface dark:border-[#2A2F3D] rounded-md shrink-0 flex items-center justify-center">
                        <img src={edu.logo} alt={edu.institution} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-on-surface dark:text-white leading-tight">{edu.degree}</h4>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 font-mono mt-0.5">{edu.institution} — {edu.location}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary dark:text-red-400 self-start sm:self-center shrink-0">{edu.period}</span>
                </div>
                <p className="text-xs text-on-surface dark:text-slate-300 mt-1">{edu.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {edu.courses.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-[#161920] border border-on-surface dark:border-[#2A2F3D] text-[11px] font-mono text-on-surface dark:text-slate-200 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Section: Experience */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1.5">
              <Briefcase className="w-4 h-4 text-brick-green dark:text-emerald-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Experience & Academic Positions
              </h3>
            </div>
            {experiencesData.map((exp) => (
              <div key={exp.id} className="p-4 bg-surface dark:bg-[#1E222B] rounded-lg border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <h4 className="font-bold text-sm text-on-surface dark:text-white">{exp.role}</h4>
                  <span className="text-xs font-mono font-bold text-brick-blue dark:text-sky-400">{exp.period}</span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-slate-400 font-mono">{exp.institution} — {exp.location}</p>
                <ul className="list-disc list-inside text-xs text-on-surface dark:text-slate-300 space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Section: Core Technical Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1.5">
              <Code className="w-4 h-4 text-brick-yellow" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Technical Stack & Competencies
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillCategories.map((cat, idx) => (
                <div key={idx} className="p-3 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg">
                  <h4 className="font-mono font-bold text-xs text-primary dark:text-red-400 mb-1.5">{cat.title}</h4>
                  <p className="text-xs text-on-surface dark:text-slate-300 font-body">
                    {cat.skills.map(s => s.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Certifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1.5">
              <Award className="w-4 h-4 text-primary dark:text-red-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Certifications & Credentials
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {certificationsData.map((cert) => (
                <div key={cert.id} className="p-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded text-xs space-y-0.5">
                  <p className="font-bold text-on-surface dark:text-white">{cert.title}</p>
                  <p className="text-[11px] text-on-surface-variant dark:text-slate-400 font-mono">{cert.issuer} ({cert.date})</p>
                  <p className="text-[10px] font-mono text-primary dark:text-brick-yellow">{cert.credentialId}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container dark:bg-[#1E222B] border-t-4 border-on-surface dark:border-[#2A2F3D] flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary dark:text-brick-yellow" />
            <span>VERIFIED FULL-STACK RESUME</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white dark:bg-[#161920] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold uppercase brick-shadow-sm hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> PRINT / SAVE PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold uppercase brick-shadow-sm hover:bg-red-800 cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
