// ====================================================================
// ROLEX GYM - ELITE TRAINERS SECTION
// Presents our physiological coaching squad as high-tech trading cards,
// with hover animations, glassmorphic grids, and experience levels.
// ====================================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Instagram, Linkedin, Twitter, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const COACHES = [
  {
    id: 1,
    name: "Marcus Vance",
    role: "Master Bio-Optimizer",
    bio: "Former Olympic strength specialist focused on hormonal and biomarker physical performance.",
    rating: 5,
    xp: "12 Yrs Exp",
    specialty: "Hypertrophy & Bio-hacking",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dr. Elena Rostova",
    role: "Regeneration Lead",
    bio: "Ph.D. in Kinesiology, specializing in biological speed-recovery and post-injury structural building.",
    rating: 5,
    xp: "9 Yrs Exp",
    specialty: "Neuromuscular Recovery",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Jaxson Sterling",
    role: "Elite Shred Coach",
    bio: "Transformation specialist using high-intensity scientific programs and strict custom meal regimes.",
    rating: 5,
    xp: "10 Yrs Exp",
    specialty: "Athletic Conditioning",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
  }
];

export default function Trainers() {
  return (
    <section id="trainers" className="relative py-28 px-6 bg-zinc-950 overflow-hidden">
      
      {/* Background visual highlights */}
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-red-950/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[350px] h-[350px] bg-zinc-900/40 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Elite Physiology Guides
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            MASTER PERFORMANCE COACHES
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COACHES.map((coach) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: coach.id * 0.15 }}
            >
              <GlassCard 
                tiltIntensity={7}
                className="group p-0 rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900/10 hover:border-gym-neon/40 transition-colors"
              >
                
                {/* 1. Trainer Profile Image with custom neon overlays */}
                <div className="relative h-80 overflow-hidden bg-zinc-950">
                  
                  {/* Neon Glow overlay boundary */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10 opacity-70" />
                  
                  <img 
                    src={coach.image} 
                    alt={coach.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur px-2.5 py-1 rounded-md border border-zinc-800 text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1 z-20">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span>5.0</span>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4 bg-gym-neon/80 backdrop-blur px-2.5 py-1 rounded-md text-[10px] text-white font-bold uppercase tracking-wider z-20 shadow-neon-red/35">
                    {coach.xp}
                  </div>
                </div>

                {/* 2. Trainer Details */}
                <div className="p-6 relative z-20 bg-zinc-950/50">
                  <span className="text-gym-neon text-[10px] uppercase font-bold tracking-widest">
                    {coach.role}
                  </span>
                  
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide mt-1 group-hover:text-gym-neon transition-colors">
                    {coach.name}
                  </h3>

                  <p className="text-zinc-500 text-xs font-light mt-2 leading-relaxed h-12 overflow-hidden">
                    {coach.bio}
                  </p>

                  <div className="w-full h-px bg-zinc-900 my-4" />

                  {/* Specialty Capsule */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Specialty:</span>
                    <span className="text-xs text-gym-silver font-semibold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                      {coach.specialty}
                    </span>
                  </div>

                  {/* Interactive Social Handles */}
                  <div className="flex gap-3 mt-5">
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

              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}
