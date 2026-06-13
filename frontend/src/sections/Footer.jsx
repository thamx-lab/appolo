// ====================================================================
// BLACK SHEEP - BRAND CONCIERGE FOOTER
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
                BLACK<span className="text-gym-neon"> SHEEP</span>
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
            <a 
              href="https://maps.app.goo.gl/kXHAxro9ZYZ8x9Uv5"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-400 text-xs font-light leading-relaxed block group transition-colors"
            >
              Bava Medical, GH Opposite,<br />
              Palavanchipalayam, Tiruppur<br />
              <span className="text-gym-neon group-hover:text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2 block transition-colors duration-200">
                Open in Google Maps →
              </span>
            </a>
            <p className="text-zinc-500 text-xs font-light leading-relaxed mt-2">
              <span className="text-zinc-400 font-semibold block">P: +91 9345812081</span>
              <span className="text-zinc-400 font-semibold block">E: k26647300@gmail.com</span>
            </p>
          </div>

          {/* COLUMN 4: Cyber Newsletter */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-widest font-extrabold mb-4">// Bio-Updates</h4>
            <p className="text-zinc-500 text-xs font-light leading-relaxed mb-4">
              Subscribe to receive private reports on bio-hacking, physical fitness, and nutrient delivery updates.
            </p>
            
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const btn = e.currentTarget.querySelector('button');
                btn.innerHTML = '<svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                setTimeout(() => {
                  e.target.innerHTML = '<div class="w-full text-center text-gym-neon text-xs font-bold uppercase tracking-widest bg-gym-neon/10 border border-gym-neon/20 rounded-lg py-2.5">Check email to confirm</div>';
                }, 1500);
              }} 
              className="flex gap-2"
            >
              <input 
                type="email"
                required
                placeholder="Enter email..."
                className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-all flex-1 min-w-0"
              />
              <button 
                type="submit"
                className="p-2 w-10 h-10 bg-gym-neon rounded-lg text-white hover:bg-red-500 btn-neon-glow transition-all flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-zinc-600 mt-2 uppercase tracking-widest">Powered by encrypted double opt-in</p>
          </div>

        </div>

        {/* Bottom divider line */}
        <div className="w-full h-px bg-zinc-900 my-8" />

        {/* Bottom footer text */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest">
            © {currentYear} BLACK SHEEP FITNESS SANCTUARY. ALL RIGHTS RESERVED.
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
