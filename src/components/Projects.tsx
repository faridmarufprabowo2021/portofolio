import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Eye, Star, Cpu, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { projectsData } from '../data/portfolioData';
import type { Project } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { GithubIcon } from './Icons';
import { PixelCard } from './PixelCard';
import { DecryptedText } from './DecryptedText';

export const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Full-Stack', 'Backend', 'Frontend', 'DevOps & Cloud', 'Mobile / IoT'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  // Separate Flagship Project (First featured project or Senja CS / UjianCBT)
  const flagshipProject = filteredProjects.find((p) => p.featured) || filteredProjects[0];
  const otherProjects = filteredProjects.filter((p) => p.id !== flagshipProject?.id);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="mb-10 flex flex-col items-start gap-2 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span><DecryptedText text="04 // FEATURED WORKS" speed={30} animateOn="view" /></span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-on-surface dark:text-white tracking-tight">
          ENGINEERED <span className="text-primary dark:text-red-500"><DecryptedText text="SYSTEMS & APPS" speed={35} animateOn="both" /></span>
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant dark:text-slate-400 font-mono">
          Full-Stack applications, distributed microservices, WhatsApp automations, and Computer Vision AI.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 reveal delay-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-brick-yellow text-on-surface brick-shadow font-extrabold -translate-y-0.5'
                : 'bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 hover:bg-surface-container dark:hover:bg-[#252A36] brick-shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Layout Container */}
      <div className="space-y-8">
        
        {/* 🏆 FLAGSHIP HERO BENTO CARD (Span Full Width) */}
        {flagshipProject && (
          <div className="reveal delay-150">
            <PixelCard
              variant="yellow"
              pixelSize={20}
              gap={4}
              className="brick-card bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] rounded-2xl overflow-hidden group hover:border-primary dark:hover:border-red-500 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Side: Media & Badge (5 Cols) */}
                <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto w-full overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-on-surface dark:border-[#2A2F3D] bg-surface-container dark:bg-[#1E222B]">
                  <img
                    src={flagshipProject.image}
                    alt={flagshipProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Studs Accent */}
                  <div className="absolute top-3 right-3 z-10 flex gap-1.5 pointer-events-none">
                    <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
                    <span className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
                  </div>

                  {/* Flagship Badge Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-black rounded-lg uppercase flex items-center gap-1.5 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current text-brick-yellow" />
                      FLAGSHIP SYSTEM
                    </span>
                    <span className="px-2.5 py-1 bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-xs font-bold rounded-lg uppercase">
                      {flagshipProject.category}
                    </span>
                  </div>

                  {/* Live Status Indicator */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-emerald-500 text-white border-2 border-on-surface font-mono text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      PRODUCTION LIVE
                    </span>
                  </div>
                </div>

                {/* Right Side: Details & Tech Specs (7 Cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary dark:text-red-400 uppercase tracking-wider">
                      <Cpu className="w-4 h-4" />
                      <span>{flagshipProject.year} • Enterprise Architecture</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-display font-black text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-brick-yellow transition-colors leading-tight">
                      {flagshipProject.title}
                    </h3>

                    <p className="text-sm sm:text-base text-on-surface-variant dark:text-slate-300 font-body leading-relaxed">
                      {flagshipProject.description}
                    </p>

                    {/* Key Solution Highlight */}
                    {flagshipProject.solution && (
                      <div className="p-3.5 bg-surface-container dark:bg-[#1E222B] border-2 border-on-surface/20 dark:border-[#2A2F3D] rounded-xl text-xs font-mono text-on-surface dark:text-slate-300 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Engineering Impact:</strong> {flagshipProject.solution}</span>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Pills & CTAs */}
                  <div className="space-y-4 pt-2 border-t-2 border-on-surface/10 dark:border-[#2A2F3D]">
                    <div className="flex flex-wrap gap-1.5">
                      {flagshipProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-surface-container dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] rounded-md text-xs font-mono font-bold text-on-surface dark:text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setSelectedProject(flagshipProject)}
                        className="px-5 py-2.5 bg-primary text-white font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg brick-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect Architecture</span>
                      </button>

                      {flagshipProject.liveUrl && (
                        <a
                          href={flagshipProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-brick-yellow text-on-surface font-mono text-xs font-bold uppercase border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg brick-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}

                      {flagshipProject.githubUrl && (
                        <a
                          href={flagshipProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 font-mono text-xs font-bold border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg brick-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </PixelCard>
          </div>
        )}

        {/* 📦 SUB-GRID PROJECTS (2 & 3 Column Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project, idx) => {
            const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
            const delayClass = delays[idx % delays.length];

            return (
              <PixelCard
                key={project.id}
                variant="yellow"
                pixelSize={16}
                gap={3}
                className={`brick-card bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] rounded-2xl flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 hover:border-primary dark:hover:border-brick-yellow transition-all duration-300 reveal-snap ${delayClass}`}
              >
                {/* Top Corner Stud Accent */}
                <div className="absolute top-2 right-2 z-10 flex gap-1 pointer-events-none">
                  <span className="w-3 h-3 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
                  <span className="w-3 h-3 rounded-full bg-primary border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
                </div>

                <div>
                  {/* Project Image Banner */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b-4 border-on-surface dark:border-[#2A2F3D] bg-surface-container dark:bg-[#1E222B]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category & Year Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-[11px] font-bold rounded-md uppercase">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] font-mono text-[11px] font-bold rounded-md">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-on-surface dark:text-white group-hover:text-primary dark:group-hover:text-brick-yellow transition-colors leading-snug">
                      {project.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 font-body leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-surface-container dark:bg-[#1E222B] border border-on-surface dark:border-[#2A2F3D] rounded text-[10px] font-mono font-bold text-on-surface dark:text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 bg-surface dark:bg-[#1E222B] text-on-surface-variant dark:text-slate-400 text-[10px] font-mono font-bold">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t-2 border-dashed border-on-surface/10 dark:border-[#2A2F3D] mt-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3.5 py-1.5 bg-surface-container dark:bg-[#1E222B] hover:bg-primary hover:text-white text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg hover:bg-surface-container transition-all"
                        title="Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-brick-yellow text-on-surface border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg hover:brightness-110 transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </PixelCard>
            );
          })}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </section>
  );
};

export default Projects;
