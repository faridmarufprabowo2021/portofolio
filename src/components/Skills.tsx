import React, { useState } from 'react';
import { skillsData, skillGroups } from '../data/portfolioData';
import { DecryptedText } from './DecryptedText';

export const Skills: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [showAll, setShowAll] = useState<boolean>(false);

  const initialLimit = 12;

  const filteredSkills = activeGroup === 'ALL'
    ? skillsData
    : skillsData.filter((s) => s.group === activeGroup);

  const displayedSkills = showAll ? filteredSkills : filteredSkills.slice(0, initialLimit);
  const remainingCount = filteredSkills.length - initialLimit;

  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24 w-full"
    >
      {/* Section Header with Filter Buttons on Right */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-on-surface dark:border-[#2A2F3D] pb-6 reveal">
        
        {/* Left Header Title */}
        <div>
          <div className="font-mono text-xs text-primary dark:text-red-400 mb-2 font-bold uppercase tracking-wider">
            <DecryptedText text="TECHNICAL ARSENAL // TOOLBOX" speed={30} animateOn="view" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-on-surface dark:text-white uppercase tracking-tight">
            BRICKBOX <span className="text-brick-blue dark:text-sky-400"><DecryptedText text="// SKILLS" speed={35} animateOn="both" /></span>
          </h2>
        </div>

        {/* Right Filter Buttons */}
        <div className="flex flex-wrap gap-2 reveal-right delay-100">
          {skillGroups.map((group) => {
            const isActive = activeGroup === group;
            return (
              <button
                key={group}
                onClick={() => {
                  setActiveGroup(group);
                  setShowAll(false);
                }}
                className={`px-3.5 sm:px-4 py-2 border-3 sm:border-4 border-on-surface dark:border-[#2A2F3D] font-mono font-bold text-xs uppercase transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:-rotate-1.5 hover:shadow-brick-md active:translate-y-0.5 active:rotate-0 rounded ${
                  isActive
                    ? 'bg-brick-yellow text-on-surface brick-shadow font-black'
                    : 'bg-white dark:bg-[#1E222B] text-on-surface dark:text-slate-200 hover:bg-surface-container-high dark:hover:bg-[#252A36] brick-shadow-sm'
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Skill Cards with Tool Logos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 mt-8">
        {displayedSkills.map((skill, idx) => {
          const delays = ['delay-50', 'delay-100', 'delay-150', 'delay-200', 'delay-250', 'delay-300', 'delay-350', 'delay-400', 'delay-450', 'delay-500'];
          const delayClass = delays[idx % delays.length];

          return (
            <div
              key={skill.name}
              className={`bg-white dark:bg-[#161920] border-3 sm:border-4 border-on-surface dark:border-[#2A2F3D] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 sm:gap-3.5 brick-shadow hover:-translate-y-1.5 hover:rotate-1 transition-all group select-none min-w-0 reveal-pop ${delayClass}`}
            >
              {/* Logo Container Box */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl border-2 border-on-surface dark:border-[#2A2F3D] bg-[#f3f4f6] dark:bg-[#1E222B] flex items-center justify-center p-2 flex-shrink-0 group-hover:bg-amber-50 dark:group-hover:bg-[#282E3B] group-hover:border-primary dark:group-hover:border-brick-yellow transition-colors">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="w-full h-full object-contain group-hover:scale-115 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Skill Name & Category Badge */}
              <div className="flex flex-col items-start min-w-0 flex-grow">
                <h3 className="font-display text-on-surface dark:text-slate-100 font-extrabold text-xs sm:text-sm md:text-[15px] tracking-wide uppercase truncate w-full group-hover:text-primary dark:group-hover:text-brick-yellow transition-colors">
                  {skill.name}
                </h3>
                <span className="bg-brick-yellow border border-on-surface/90 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-on-surface font-mono inline-block mt-1 truncate max-w-full shadow-inner">
                  {skill.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less Button with Top Studs */}
      {filteredSkills.length > initialLimit && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3.5 bg-white dark:bg-[#161920] text-on-surface dark:text-slate-100 border-4 border-on-surface dark:border-[#2A2F3D] font-mono text-xs sm:text-sm font-bold uppercase brick-btn relative cursor-pointer flex items-center gap-2 hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface"
          >
            {/* 3 Top Decorative Studs */}
            <div className="absolute -top-3 left-0 w-full flex justify-around px-3 pointer-events-none">
              <span className="w-3 h-3 rounded-full bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
              <span className="w-3 h-3 rounded-full bg-white dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            </div>

            <span>
              {showAll
                ? 'COLLAPSE // SHOW LESS'
                : `SHOW ALL TOOLS (+${remainingCount} MORE)`}
            </span>
          </button>
        </div>
      )}

    </section>
  );
};
