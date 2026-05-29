// ====================================================================
// ROLEX GYM - PREMIUM 3D GLASSMOPRHIC CARD
// A self-contained card container that features glass styling, custom
// neon lighting, and responsive 3D tilting on mouse hover.
// ====================================================================

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '../hooks/useMouseTilt';

/**
 * Reusable premium GlassCard with smooth 3D mouse tilt animations.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements inside the card.
 * @param {string} props.className - Custom Tailwind classes for size, margins, etc.
 * @param {number} props.tiltIntensity - Maximum angle of 3D tilt (default is 10).
 */
export default function GlassCard({ children, className = '', tiltIntensity = 10, ...props }) {
  // 1. Create a reference pointer to track our card
  const cardRef = useRef(null);

  // 2. Load our mouse tracking hook for 3D rotations
  const { rotateX, rotateY, isHovered } = useMouseTilt(cardRef, { maxAngle: tiltIntensity });

  return (
    <div 
      ref={cardRef} 
      className="perspective-1000 w-full select-none" 
      {...props}
    >
      <motion.div
        className={`glass-card p-8 rounded-2xl preserve-3d border-gradient-glow relative overflow-hidden ${className}`}
        style={{
          // Apply active rotational angles, or smoothly return to neutral flat position
          transform: isHovered 
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
            : 'rotateX(0deg) rotateY(0deg)',
          // High-speed responsiveness on move, smooth glide on exit
          transition: isHovered 
            ? 'transform 0.08s ease-out' 
            : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Subtle decorative glowing neon light in the background inside the card */}
        <div 
          className="absolute -right-20 -top-20 w-40 h-40 bg-gym-neon rounded-full filter blur-[80px] opacity-20 pointer-events-none transition-opacity duration-500"
          style={{ opacity: isHovered ? 0.35 : 0.15 }}
        />

        {/* 3D Content Wrapper (ensures child components have a layer that pops out!) */}
        <div className="relative preserve-3d translate-z-20">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
