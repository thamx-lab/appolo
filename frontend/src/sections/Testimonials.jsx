// ====================================================================
// ROLEX GYM - CINEMATIC TESTIMONIALS SLIDER
// An autoplay and manually controlled review slider displaying quotes
// from executive members with smooth Framer Motion slide-crossfade animations.
// ====================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const REVIEWS = [
  {
    id: 1,
    name: "Arthur Pendelton",
    role: "CEO, Sterling Tech",
    tier: "Platinum VIP Member",
    quote: "The biological meal delivery combined with private master coaching changed everything. I am in the absolute best shape of my life, both physically and mentally.",
    rating: 5,
  },
  {
    id: 2,
    name: "Victoria Cross",
    role: "Professional Athlete",
    tier: "Gold Elite Member",
    quote: "Rolex Gym is not just a training floor; it is a high-tech athletic laboratory. The muscle recovery spa and hyperbaric chambers cut down my post-workout fatigue drastically.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Julian Thorne",
    role: "Cardiologist",
    tier: "Silver Tier Member",
    quote: "As a physician, I highly appreciate their attention to biometric tracking and scientific training. The master trainers construct plans that respect your body chemistry.",
    rating: 5,
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // 1. Auto-rotation effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000); // rotates every 8 seconds
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  // 2. Framer Motion slide animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    })
  };

  return (
    <section id="testimonials" className="relative py-28 px-6 bg-zinc-950 overflow-hidden">
      
      {/* Decorative glows */}
      <div className="absolute left-0 bottom-1/4 w-[350px] h-[350px] bg-red-950/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-zinc-900/40 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Client Verification
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            EXECUTIVE ENDORSEMENTS
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Carousel Slider */}
        <div className="relative min-h-[340px] flex items-center justify-center">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex"
            >
              <GlassCard tiltIntensity={4} className="bg-zinc-900/20 p-10 flex flex-col items-center text-center">
                
                {/* Large Quote Icon decoration */}
                <div className="p-4 bg-gym-steel rounded-full border border-zinc-800/80 mb-6 shadow-neon-red/5">
                  <Quote className="w-7 h-7 text-gym-neon" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-zinc-300 font-light text-base sm:text-xl italic leading-relaxed max-w-2xl">
                  "{REVIEWS[currentIndex].quote}"
                </p>

                <div className="w-12 h-px bg-zinc-800 my-6" />

                {/* Reviewer Details */}
                <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                  {REVIEWS[currentIndex].name}
                </h4>
                
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
                  {REVIEWS[currentIndex].role} — <span className="text-gym-neon">{REVIEWS[currentIndex].tier}</span>
                </p>

                {/* Five Stars visual ratings */}
                <div className="flex gap-1 mt-4">
                  {[...Array(REVIEWS[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-16 z-20">
            <button 
              onClick={handlePrev}
              className="p-3 bg-zinc-900/80 hover:bg-gym-neon/20 border border-zinc-800 hover:border-gym-neon/30 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer shadow-glass"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-16 z-20">
            <button 
              onClick={handleNext}
              className="p-3 bg-zinc-900/80 hover:bg-gym-neon/20 border border-zinc-800 hover:border-gym-neon/30 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer shadow-glass"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Bullet Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {REVIEWS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 bg-gym-neon shadow-[0_0_8px_#ff2e2e]' 
                  : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              }`}
            />
          ))}
        </div>

      </div>

    </section>
  );
}
