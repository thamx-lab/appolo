// ====================================================================
// ROLEX GYM - CONCIERGE BRANDING BUTTON
// A highly polished, custom reactive button utilizing Framer Motion for
// click-scale physical feel and customized premium neon red glows.
// ====================================================================

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable premium branding button with built-in Framer Motion micro-interactions.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Label or content inside button.
 * @param {string} props.variant - Button style: 'primary' (glowing red) or 'secondary' (glass border).
 * @param {string} props.className - Extra custom styling classes.
 * @param {boolean} props.loading - Shows loading spinner if active.
 */
export default function GymButton({ 
  children, 
  variant = 'primary', 
  className = '', 
  loading = false, 
  ...props 
}) {
  
  // 1. Establish the base styles for a modern wide-pill buttons
  const baseStyle = "px-6 py-3 rounded-lg font-semibold tracking-wider text-sm uppercase transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer focus:outline-none";
  
  // 2. Map styling presets
  const styles = {
    // Primary: Glowing neon red background
    primary: "bg-gym-neon text-white hover:bg-red-500 btn-neon-glow border border-red-500",
    
    // Secondary: Dark glassmorphism border with text neon hover glows
    secondary: "bg-transparent border border-zinc-700 text-gym-silver hover:border-gym-neon hover:text-white glass-card"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04 }} // Scale up slightly on hover
      whileTap={{ scale: 0.96 }}  // Bounce down on click
      className={`${baseStyle} ${styles[variant]} ${loading ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          {/* Loading spinner */}
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
