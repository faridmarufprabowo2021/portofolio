import React, { useState } from 'react';
import { Mail, Send, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo, socialLinks } from '../data/portfolioData';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // Anti-bot honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If honeypot is filled, silent discard (bot trapped)
    if (formData.honeypot) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#AF101A', '#0055A4', '#FFD700', '#00852B']
        });
      } catch {
        // Fallback
      }

      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col items-start gap-2 reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brick-yellow text-on-surface border-2 border-on-surface dark:border-[#2A2F3D] brick-shadow-sm rounded-lg font-mono text-xs font-bold uppercase">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>06 // INITIATE TRANSMISSION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-on-surface dark:text-white">
          LET'S BUILD <span className="text-primary dark:text-red-500">TOGETHER</span>
        </h2>
        <p className="text-sm text-on-surface-variant dark:text-slate-400 font-mono">
          Have an exciting project, open engineering role, or collaboration idea? Get in touch!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 reveal-left delay-100">
          
          <div className="brick-card p-6 sm:p-8 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] space-y-4">
            {/* 3 Top Corner Studs */}
            <div className="absolute -top-3 left-6 flex gap-2 pointer-events-none">
              <span className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-brick-blue border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-brick-yellow border-2 border-on-surface dark:border-[#2A2F3D] shadow-inner" />
            </div>

            <h3 className="text-xl font-display font-bold text-on-surface dark:text-white">
              Direct Channels
            </h3>
            
            <p className="text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body leading-relaxed">
              Feel free to reach out directly through email or connect on professional networks. I typically reply within 24 hours.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg flex items-center gap-3">
                <div className="p-2 bg-primary text-white border-2 border-on-surface dark:border-[#2A2F3D] rounded">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 uppercase">EMAIL ADDRESS</p>
                  <a href={`mailto:${personalInfo.email}`} className="text-xs font-mono font-bold text-primary dark:text-red-400 hover:underline">
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              <div className="p-3 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded-lg flex items-center gap-3">
                <div className="p-2 bg-brick-blue text-white border-2 border-on-surface dark:border-[#2A2F3D] rounded">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-on-surface-variant dark:text-slate-400 uppercase">LOCATION</p>
                  <p className="text-xs font-mono font-bold text-on-surface dark:text-slate-200">
                    {personalInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Network Chips with Hardened Links */}
            <div className="pt-3 border-t-2 border-on-surface/15 dark:border-white/10">
              <p className="text-xs font-mono font-bold text-on-surface-variant dark:text-slate-400 uppercase mb-2">
                SOCIAL PROFILES:
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-surface-container dark:bg-[#1E222B] text-on-surface dark:text-slate-200 border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs font-bold hover:bg-brick-yellow dark:hover:bg-brick-yellow dark:hover:text-on-surface transition-all brick-shadow-sm flex items-center gap-1.5"
                  >
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Brutalist Contact Form (7 Cols) */}
        <div className="lg:col-span-7 brick-card p-6 sm:p-8 bg-white dark:bg-[#161920] border-4 border-on-surface dark:border-[#2A2F3D] reveal-right delay-200">
          
          <h3 className="text-xl font-display font-bold text-on-surface dark:text-white mb-4">
            Send a Dispatch
          </h3>

          {isSuccess ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border-3 border-brick-green rounded-xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-brick-green mx-auto animate-bounce" />
              <h4 className="font-display font-bold text-lg text-on-surface dark:text-white">Message Transmitted!</h4>
              <p className="text-xs sm:text-sm text-on-surface dark:text-slate-300 font-body">
                Thank you, your dispatch has been received. I will review it and get back to you shortly!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Bot Honeypot Field */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-bold uppercase text-on-surface dark:text-slate-300 flex items-center gap-1">
                    <span>YOUR NAME</span>
                    <span className="text-primary dark:text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-[#252A36] focus:outline-none focus:ring-2 focus:ring-primary brick-shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-bold uppercase text-on-surface dark:text-slate-300 flex items-center gap-1">
                    <span>YOUR EMAIL</span>
                    <span className="text-primary dark:text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={100}
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-[#252A36] focus:outline-none focus:ring-2 focus:ring-primary brick-shadow-sm"
                  />
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold uppercase text-on-surface dark:text-slate-300">
                  SUBJECT / TOPIC
                </label>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Full-Stack Role / Project Collaboration"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-[#252A36] focus:outline-none focus:ring-2 focus:ring-primary brick-shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-bold uppercase text-on-surface dark:text-slate-300 flex items-center gap-1">
                  <span>MESSAGE</span>
                  <span className="text-primary dark:text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  maxLength={2500}
                  placeholder="Describe your project, proposal, or inquiry here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface dark:bg-[#1E222B] border-2 border-on-surface dark:border-[#2A2F3D] rounded font-mono text-xs text-on-surface dark:text-slate-100 focus:bg-white dark:focus:bg-[#252A36] focus:outline-none focus:ring-2 focus:ring-primary brick-shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary text-white font-mono text-xs sm:text-sm font-bold uppercase border-3 border-on-surface dark:border-[#2A2F3D] brick-btn flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>TRANSMITTING MESSAGE...</span>
                ) : (
                  <>
                    <span>SEND MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>

    </section>
  );
};
