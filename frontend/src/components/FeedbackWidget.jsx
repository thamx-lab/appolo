import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackWidget() {
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleFeedback = (type) => {
    if (type === 'up') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.05, y: 0.9 },
        colors: ['#ff2e2e', '#ffffff', '#ff6b6b', '#ff0000'],
        ticks: 200
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="feedback-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="pointer-events-auto bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-3 shadow-xl flex items-center gap-3"
          >
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider pl-1">
              Experience?
            </span>
            <div className="flex gap-1.5 border-l border-zinc-800 pl-3">
              <button
                onClick={() => handleFeedback('up')}
                className="p-1.5 rounded-lg hover:bg-green-500/10 text-zinc-500 hover:text-green-500 transition-colors"
                title="Good"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-colors"
                title="Poor"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback-thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-auto bg-gym-neon/10 backdrop-blur-md border border-gym-neon/30 rounded-xl p-3 shadow-[0_0_15px_rgba(255,46,46,0.1)] flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-gym-neon" />
            <span className="text-xs text-gym-neon font-bold uppercase tracking-wider pr-1">
              Recorded
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
