// ====================================================================
// ROLEX GYM - CONCIERGE BRAND ABOUT SECTION
// Details the philosophical luxury pillars of Rolex Gym and features
// highly responsive 3D statistical blocks.
// ====================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, ShieldAlert, Cpu } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function About() {
  
  // Custom scroll entry animations
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-gym-neon" />,
      title: "Bio-Tracking Integration",
      desc: "Real-time biometric monitoring synced with our tailored tracking systems to optimize every rep and heartbeat."
    },
    {
      icon: <Activity className="w-6 h-6 text-gym-neon" />,
      title: "Scientific Regeneration Labs",
      desc: "Cryotherapy chambers, organic hyperbaric oxygen recovery tanks, and private spa lounges to speed muscle recovery."
    },
    {
      icon: <Award className="w-6 h-6 text-gym-neon" />,
      title: "World-Class Coach Squad",
      desc: "Work directly with master physiologically-certified coaches specializing in physical transformations and biomarker optimization."
    }
  ];

  return (
    <section id="about" className="relative py-28 px-6 bg-zinc-950 overflow-hidden">
      
      {/* Decorative ambient lighting */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-red-900/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-zinc-900/40 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* COLUMN 1: Story telling content (occupies 7 cols) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
              // Premium Heritage
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              REDEFINE WHAT IS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon to-white font-black">
                PHYSIOLOGICALLY POSSIBLE
              </span>
            </h2>

            <p className="text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
              At Rolex Gym, we believe fitness is not just about effort; it is a meticulous blend of luxury comfort, scientific physiological optimization, and mental strength. We have engineered a premium sanctuary designed for those who demand ultimate luxury and high-performance training systems.
            </p>

            {/* Core features listing */}
            <div className="flex flex-col gap-6 mt-4">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="p-3 bg-gym-steel rounded-xl border border-zinc-800 shadow-neon-red/5">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg uppercase tracking-wide">
                      {feat.title}
                    </h4>
                    <p className="text-zinc-500 font-light text-sm mt-1 max-w-xl">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>

          {/* COLUMN 2: 3D Grid Statistics (occupies 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-center items-center">
            
            {/* Stat Block A */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full max-w-sm"
            >
              <GlassCard tiltIntensity={8}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white">45K+</h3>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-semibold mt-1">Sq Ft Premium Space</p>
                  </div>
                  <div className="text-gym-neon font-black text-2xl">// 01</div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Stat Block B */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-full max-w-sm"
            >
              <GlassCard tiltIntensity={8}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-gym-neon">100%</h3>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-semibold mt-1">Biometric Customization</p>
                  </div>
                  <div className="text-white font-black text-2xl">// 02</div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Stat Block C */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-sm"
            >
              <GlassCard tiltIntensity={8}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white">15+</h3>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs font-semibold mt-1">Certified Master Coaches</p>
                  </div>
                  <div className="text-gym-neon font-black text-2xl">// 03</div>
                </div>
              </GlassCard>
            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}
