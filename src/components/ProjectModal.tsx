import React from 'react';
import { X, ExternalLink, Layers, CheckCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import type { Project } from '../types/portfolio';
import { GithubIcon } from './Icons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Box */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] brick-shadow-xl rounded-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Studs */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none z-20">
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-sm" />
        </div>

        {/* Modal Header */}
        <div className="bg-brick-blue text-white border-b-4 border-on-surface dark:border-[#2A2F3D] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-brick-yellow text-on-surface font-mono text-xs font-bold border-2 border-on-surface">
              PROJECT CASE STUDY // {project.category.toUpperCase()}
            </span>
            <span className="hidden sm:inline text-xs font-mono opacity-80">
              YEAR: {project.year}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-bold text-sm brick-shadow-sm hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh] space-y-6 bg-white dark:bg-[#161920]">
          
          {/* Main Title Banner */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-on-surface dark:text-white">
              {project.title}
            </h2>
            <p className="text-sm font-mono font-bold text-primary dark:text-red-400">
              {project.tagline}
            </p>
          </div>

          {/* Project Image Banner */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border-3 border-on-surface dark:border-[#2A2F3D] brick-shadow">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-[#161920]/90 backdrop-blur-sm border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold text-on-surface dark:text-slate-200 rounded">
              {project.technologies.slice(0, 4).join(' • ')}
            </div>
          </div>

          {/* Problem vs Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Problem Box */}
            <div className="p-4 bg-red-50/80 dark:bg-red-950/40 border-2 border-primary dark:border-red-500/50 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-primary dark:text-red-400 font-mono text-xs font-bold uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>The Challenge / Problem</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body leading-relaxed">
                {project.problem}
              </p>
            </div>

            {/* Solution Box */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-brick-green dark:border-emerald-500/50 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-brick-green dark:text-emerald-400 font-mono text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Engineered Solution</span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body leading-relaxed">
                {project.solution}
              </p>
            </div>

          </div>

          {/* System Architecture */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1">
              <Layers className="w-4 h-4 text-brick-blue dark:text-sky-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Architectural Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {project.architecture.map((arch, i) => (
                <div key={i} className="p-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs text-on-surface dark:text-slate-200 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-brick-blue dark:bg-sky-400 shrink-0 mt-1.5" />
                  <span>{arch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-on-surface dark:border-[#2A2F3D] pb-1">
              <Cpu className="w-4 h-4 text-primary dark:text-red-400" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                Key Engineered Features
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-on-surface dark:text-slate-300">
                  <CheckCircle className="w-4 h-4 text-brick-green dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div>
            <p className="text-xs font-mono font-bold text-on-surface-variant dark:text-slate-400 uppercase mb-2">
              TECHNOLOGIES DEPLOYED:
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-surface-container dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs font-bold text-on-surface dark:text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-surface-container dark:bg-[#1E222B] border-t-4 border-on-surface dark:border-[#2A2F3D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white dark:bg-[#161920] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold uppercase brick-btn flex items-center gap-1.5 hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface"
              >
                <GithubIcon className="w-4 h-4" /> GITHUB REPO
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold uppercase brick-btn flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> LIVE DEMO
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-on-surface dark:bg-slate-800 text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold uppercase brick-shadow-sm hover:bg-black dark:hover:bg-slate-700 cursor-pointer"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
