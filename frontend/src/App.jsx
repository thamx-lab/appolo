// ====================================================================
// ROLEX GYM - MAIN REACT APPLICATION CORE
// Coordinates the active scrolling sections, overlays, global custom headers,
// and implements a gorgeous cinematic introductory loading screen.
// ====================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu, X, Star } from 'lucide-react';

// Section Imports
import Hero from './sections/Hero';
import About from './sections/About';
import Plans from './sections/Plans';
import Trainers from './sections/Trainers';
import BMICalculator from './sections/BMICalculator';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Cinematic Loading Sequence: simulates loading assets and calibrating biomarkers
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400); // 2.4 seconds loading experience
    return () => clearTimeout(timer);
  }, []);

  // 2. Track scrolling to make the header background active on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative text-gym-silver select-none">
      
      <AnimatePresence mode="wait">
        
        {/* ====================================================================
            A. CINEMATIC LOADING PRELOADER SCREEN
            ==================================================================== */}
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 bg-gym-pitch z-[999] flex flex-col items-center justify-center p-6"
          >
            <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
              
              {/* Pulsing Glowing Brand Emblem */}
              <motion.div
                animate={{ 
                  scale: [0.95, 1.05, 0.95],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="p-4 bg-gym-steel rounded-2xl border border-red-500/25 shadow-neon-red-strong/20"
              >
                <Flame className="w-10 h-10 text-gym-neon fill-gym-neon" />
              </motion.div>

              {/* Loader Labels */}
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white mt-2">
                  ROLEX<span className="text-gym-neon">GYM</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Calibrating Biological Transmitters...
                </p>
              </div>

              {/* Cybermatic Progress Bar */}
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-4 border border-zinc-800/40">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  className="h-full bg-gym-neon shadow-[0_0_8px_#ff2e2e]"
                />
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ====================================================================
          B. PREMIUM GLASSbackdrop FLOATING NAVIGATION HEADER
          ==================================================================== */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-zinc-950/80 backdrop-blur-md py-4 border-zinc-900 shadow-glass' 
          : 'bg-transparent py-6 border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand Emblem */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-1 rounded-md bg-gym-neon shadow-neon-red/35">
              <Flame className="w-4.5 h-4.5 fill-white text-white" />
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-white">
              ROLEX<span className="text-gym-neon">GYM</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('about')} className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
              Story
            </button>
            <button onClick={() => handleNavClick('plans')} className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
              Tiers
            </button>
            <button onClick={() => handleNavClick('trainers')} className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
              Coaches
            </button>
            <button onClick={() => handleNavClick('bmi')} className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
              Metrics
            </button>
            <button onClick={() => handleNavClick('contact')} className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
              Concierge
            </button>
          </nav>

          {/* Action button */}
          <div className="hidden md:block">
            <button 
              onClick={() => handleNavClick('plans')}
              className="px-5 py-2.5 rounded-lg bg-transparent border border-zinc-700 hover:border-gym-neon text-white hover:bg-gym-neon/10 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-glass"
            >
              Enter Sanctuary
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* ====================================================================
          C. MOBILE DRAWER NAVIGATION MENU (Framer Motion Animated)
          ==================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] z-30 bg-black/95 backdrop-blur-lg md:hidden p-6 border-t border-zinc-900"
          >
            <nav className="flex flex-col gap-6 items-center justify-center h-2/3">
              <button onClick={() => handleNavClick('about')} className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                Our Story
              </button>
              <button onClick={() => handleNavClick('plans')} className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                Membership Tiers
              </button>
              <button onClick={() => handleNavClick('trainers')} className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                Master Coaches
              </button>
              <button onClick={() => handleNavClick('bmi')} className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                Bio Assessor
              </button>
              <button onClick={() => handleNavClick('contact')} className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                Concierge Desk
              </button>
              <button 
                onClick={() => handleNavClick('plans')}
                className="w-full max-w-xs mt-6 px-6 py-3 rounded-lg bg-gym-neon text-white text-sm font-bold uppercase tracking-widest text-center shadow-neon-red/35"
              >
                Join Rolex Gym
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          D. PAGE SECTIONS MOUNTING
          ==================================================================== */}
      <main>
        <Hero />
        <About />
        <Plans />
        <Trainers />
        <BMICalculator />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

    </div>
  );
}
