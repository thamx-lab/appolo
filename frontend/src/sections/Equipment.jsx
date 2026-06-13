import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Target, Zap, Activity } from 'lucide-react';

const equipmentData = {
  title: 'Apex Bio-Treadmill',
  subtitle: 'Zero-Gravity Resistance Engine',
  image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200', // High-end gym equipment looking image
  hotspots: [
    {
      id: 1,
      x: 35, // percentage from left
      y: 25, // percentage from top
      icon: <Cpu className="w-4 h-4 text-gym-neon" />,
      title: 'Neural Core Processor',
      description: 'Adapts belt speed instantly based on your bio-metric output and footstrike pattern.'
    },
    {
      id: 2,
      x: 65,
      y: 45,
      icon: <Activity className="w-4 h-4 text-gym-neon" />,
      title: 'Bio-Metric Handles',
      description: 'Real-time heart rate, oxygen saturation, and hydration level scanning.'
    },
    {
      id: 3,
      x: 50,
      y: 80,
      icon: <Zap className="w-4 h-4 text-gym-neon" />,
      title: 'Zero-G Deck',
      description: 'Magnetic levitation suspension reduces joint impact by up to 45%.'
    }
  ]
};

export default function Equipment() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <section id="equipment" className="py-24 bg-gym-pitch relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gym-neon/20 bg-zinc-900/50 text-gym-neon text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Tech Showcase</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6"
          >
            State of the Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-gym-neon">Machinery</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Interact with our cutting-edge equipment. Click the glowing nodes to explore the technology driving your performance.
          </motion.p>
        </div>

        {/* Equipment Display Area */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
          
          <div className="absolute top-6 left-6 z-20">
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
              {equipmentData.title}
            </h3>
            <p className="text-gym-neon font-bold uppercase tracking-widest text-sm drop-shadow-md">
              {equipmentData.subtitle}
            </p>
          </div>

          <div className="relative aspect-video w-full bg-zinc-800">
            {/* Base Image */}
            <img 
              src={equipmentData.image} 
              alt={equipmentData.title}
              loading="lazy"
              fetchpriority="low"
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-80 transition-opacity duration-700"
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

            {/* Hotspots */}
            {equipmentData.hotspots.map((spot) => (
              <div 
                key={spot.id}
                className="absolute z-30"
                style={{ top: `${spot.y}%`, left: `${spot.x}%`, transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Pulsing Node */}
                <div className="relative flex items-center justify-center cursor-pointer group">
                  <div className="absolute w-12 h-12 bg-gym-neon/20 rounded-full animate-ping" />
                  <div className="absolute w-8 h-8 bg-gym-neon/40 rounded-full animate-pulse" />
                  <div className="relative w-4 h-4 bg-gym-neon rounded-full shadow-[0_0_15px_rgba(255,46,46,1)] group-hover:scale-150 transition-transform duration-300" />
                </div>

                {/* Tooltip Card */}
                <AnimatePresence>
                  {activeHotspot === spot.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-8 left-1/2 -translate-x-1/2 w-64 p-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl z-40 pointer-events-none"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-md">
                          {spot.icon}
                        </div>
                        <h4 className="text-white font-bold uppercase tracking-wide text-sm">
                          {spot.title}
                        </h4>
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        {spot.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
