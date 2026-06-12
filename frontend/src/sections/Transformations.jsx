import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Star } from 'lucide-react';

const transformations = [
  {
    id: 1,
    name: 'John D.',
    duration: '12 Weeks',
    quote: "The personalized coaching completely changed my approach to fitness.",
    beforeImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800&h=800', // Man looking normal
    afterImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800&h=800',  // Man looking ripped
  },
  {
    id: 2,
    name: 'Sarah M.',
    duration: '6 Months',
    quote: "I've never felt stronger. The atmosphere here pushes you to your limits.",
    beforeImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800&h=800', // Woman normal
    afterImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800&h=800',  // Woman athletic
  }
];

export default function Transformations() {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const activeData = transformations[activeTab];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - left;
    const position = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(position);
  };

  // Reset slider when changing tabs
  useEffect(() => {
    setSliderPosition(50);
  }, [activeTab]);

  return (
    <section id="transformations" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gym-neon/20 bg-zinc-900/50 text-gym-neon text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Real Results</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6"
          >
            Member <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-gym-neon">Transformations</span>
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          
          {/* Tabs / Info section */}
          <div className="lg:w-1/3 w-full flex flex-col gap-6">
            <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 w-full md:w-auto self-start">
              {transformations.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                    activeTab === idx 
                    ? 'bg-gym-neon text-white shadow-[0_0_15px_rgba(255,46,46,0.3)]' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8"
            >
              <h3 className="text-3xl font-black text-white uppercase mb-2">{activeData.name}</h3>
              <p className="text-gym-neon font-bold uppercase tracking-widest text-sm mb-6">
                Time: {activeData.duration}
              </p>
              <p className="text-zinc-400 text-lg italic leading-relaxed">
                "{activeData.quote}"
              </p>
            </motion.div>
          </div>

          {/* Image Slider Section */}
          <div className="lg:w-2/3 w-full max-w-3xl">
            <motion.div 
              key={activeData.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              ref={containerRef}
              className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden cursor-ew-resize border border-zinc-800 shadow-2xl touch-none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Background) */}
              <div 
                className="absolute inset-0 bg-zinc-900 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeData.afterImg})` }}
              >
                <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/60 backdrop-blur-sm border border-zinc-700/50 rounded-full text-white font-bold uppercase tracking-widest text-xs z-10">
                  After
                </div>
              </div>

              {/* Before Image (Clipped overlay) */}
              <div 
                className="absolute inset-0 bg-zinc-800 bg-cover bg-center border-r-2 border-gym-neon"
                style={{ 
                  backgroundImage: `url(${activeData.beforeImg})`,
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                }}
              >
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-sm border border-zinc-700/50 rounded-full text-white font-bold uppercase tracking-widest text-xs z-10">
                  Before
                </div>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-gym-neon shadow-[0_0_15px_rgba(255,46,46,0.8)] z-20"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-zinc-950 border-2 border-gym-neon rounded-full flex items-center justify-center shadow-xl">
                  <ArrowLeftRight className="w-5 h-5 text-gym-neon" />
                </div>
              </div>
            </motion.div>
            <p className="text-center text-zinc-600 text-xs uppercase tracking-widest mt-4">
              Drag left and right to see the transformation
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
