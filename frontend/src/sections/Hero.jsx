// ====================================================================
// ROLEX GYM - CINEMATIC HERO SECTION
// Features high-end typographical entries, floating background neon grids,
// and glowing luxury action callouts.
// ====================================================================

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Flame, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GymButton from '../components/GymButton';
import Canvas3D from '../components/Canvas3D';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroContentRef = useRef(null);

  
  // 1. Framer Motion animation configs for parent and child entries
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const handleScrollToPlans = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. GSAP Scroll animation: fade and move content out when scrolling down
  useGSAP(() => {
    gsap.to(heroContentRef.current, {
      y: 150,
      opacity: 0,
      scrollTrigger: {
        trigger: "section.hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });
  }, { scope: heroContentRef });

  return (
    <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gym-pitch px-6 py-20">
      
      {/* A. Cinematic 3D Canvas Background */}
      <Canvas3D />

      {/* B. Main Hero Content Container */}
      <div ref={heroContentRef} className="relative z-10 max-w-5xl mx-auto text-center pointer-events-none">
        {/* We use pointer-events-none on the container so the canvas behind gets mouse moves, 
            but we re-enable pointer-events on the buttons */}
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Tagline micro-capsule */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/25 bg-zinc-950/65 backdrop-blur text-gym-neon text-xs font-semibold uppercase tracking-widest cursor-default select-none shadow-neon-red/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The New Era of High-Performance Luxury</span>
          </motion.div>

          {/* Majestic Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-none uppercase"
          >
            FORGE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-gym-neon neon-text-glow">
              ULTIMATE
            </span>{" "}
            PHYSIQUE
          </motion.h1>

          {/* Premium short bio description */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-zinc-400 text-base sm:text-lg md:text-xl font-light leading-relaxed mt-2"
          >
            Step into the future of luxury athletic performance. High-performance bio-monitoring, custom physiological coaching, and world-class recovery chambers.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto pointer-events-auto"
          >
            <GymButton 
              variant="primary" 
              className="w-full sm:w-56" 
              onClick={handleScrollToPlans}
            >
              <Flame className="w-4 h-4" />
              Join Rolex Elite
            </GymButton>
            
            <GymButton 
              variant="secondary" 
              className="w-full sm:w-56" 
              onClick={handleScrollToAbout}
            >
              <Shield className="w-4 h-4" />
              Discover Story
            </GymButton>
          </motion.div>

        </motion.div>
      </div>

      {/* C. Interactive scrolling indicator at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 select-none text-zinc-500 hover:text-gym-neon transition-colors"
        onClick={handleScrollToAbout}
      >
        <span className="text-xs uppercase tracking-widest font-semibold">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

    </section>
  );
}
