// ====================================================================
// ROLEX GYM - BRAND CONCIERGE FOOTER
// Renders the luxury brand logo, structured quick-links, direct coords,
// and custom newsletter styling.
// ====================================================================

import React from 'react';
import { Flame, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

export default function Footer() {
  
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gym-pitch border-t border-zinc-900 py-16 px-6 relative overflow-hidden">
      
      {/* Subtle background red light */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-red-950/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMN 1: Brand details */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-1.5 rounded-lg bg-gym-neon shadow-neon-red/35">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">
                ROLEX<span className="text-gym-neon">GYM</span>
              </span>
            </div>
            
            <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-xs mt-2">
              The world's premium biometric-integrated luxury fitness sanctuary. Combining physiological science with premium comfort.
            </p>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-extrabold mb-4">// Quick Navigation</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <button onClick={() => handleScroll('about')} className="text-zinc-500 hover:text-gym-neon text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('plans')} className="text-zinc-500 hover:text-gym-neon text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none">
                  Membership Tiers
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('trainers')} className="text-zinc-500 hover:text-gym-neon text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none">
                  Elite Master Coaches
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('bmi')} className="text-zinc-500 hover:text-gym-neon text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none">
                  Physique Assessor
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll('testimonials')} className="text-zinc-500 hover:text-gym-neon text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none">
                  Executive Endorsements
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Concierge info */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-extrabold mb-4">// Direct Coords</h4>
            <p className="text-zinc-500 text-xs font-light leading-relaxed">
              bava medical, GH opposite,<br />
              palavanchipalayam, tiruppur<br />
              <span className="text-zinc-400 font-semibold mt-2 block">P: +1 (800) 700-GYM-ROLEX</span>
              <span className="text-zinc-400 font-semibold block">E: concierge@rolexgym.com</span>
            </p>
          </div>

          {/* COLUMN 4: Cyber Newsletter */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-extrabold mb-4">// Bio-Updates</h4>
            <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
              Subscribe to receive private reports on bio-hacking, physical fitness, and nutrient delivery updates.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("🧬 Newsletter encrypted and registered successfully!"); }} className="flex gap-2">
              <input 
                type="email"
                required
                placeholder="Enter email..."
                className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-all flex-1 min-w-0"
              />
              <button 
                type="submit"
                className="p-2 bg-gym-neon rounded-lg text-white hover:bg-red-500 btn-neon-glow transition-all flex items-center justify-center cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom divider line */}
        <div className="w-full h-px bg-zinc-900 my-8" />

        {/* Bottom footer text */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest">
            © {currentYear} ROLEX GYM SANCTUARY. ALL RIGHTS RESERVED.
          </p>
          
          {/* Social icons */}
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-gym-neon hover:bg-gym-neon/10 border border-zinc-800 hover:border-gym-neon/20 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-gym-neon hover:bg-gym-neon/10 border border-zinc-800 hover:border-gym-neon/20 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-gym-neon hover:bg-gym-neon/10 border border-zinc-800 hover:border-gym-neon/20 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

    </footer>
  );
}
