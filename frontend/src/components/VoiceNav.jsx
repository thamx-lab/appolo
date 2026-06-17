import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

const VOICE_COMMANDS = {
  'about': 'about',
  'our story': 'about',
  'story': 'about',
  'equipment': 'equipment',
  'tech': 'equipment',
  'schedule': 'schedule',
  'classes': 'schedule',
  'plans': 'plans',
  'membership': 'plans',
  'pricing': 'plans',
  'bmi': 'bmi',
  'metrics': 'bmi',
  'calculator': 'bmi',
  'contact': 'contact',
  'trainers': 'trainers',
  'coaches': 'trainers',
  'testimonials': 'testimonials',
  'reviews': 'testimonials',
  'top': null, // scroll to top
  'home': null,
};

export default function VoiceNav() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState(''); // 'listening', 'matched', 'no-match'
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (e) => {
        const result = e.results[e.results.length - 1];
        const text = result[0].transcript.toLowerCase().trim();
        setTranscript(text);

        if (result.isFinal) {
          handleCommand(text);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setStatus('no-match');
        clearAfterDelay();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearAfterDelay = () => {
    timeoutRef.current = setTimeout(() => {
      setTranscript('');
      setStatus('');
    }, 2500);
  };

  const handleCommand = (text) => {
    let matched = false;
    for (const [keyword, sectionId] of Object.entries(VOICE_COMMANDS)) {
      if (text.includes(keyword)) {
        matched = true;
        setStatus('matched');
        if (sectionId === null) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      }
    }
    if (!matched) {
      setStatus('no-match');
    }
    clearAfterDelay();
  };

  const toggleListening = () => {
    if (!supported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setStatus('listening');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!supported) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        title="Voice Navigation"
        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs uppercase font-bold tracking-widest transition-all cursor-pointer ${
          isListening
            ? 'border-gym-neon bg-gym-neon/10 text-gym-neon shadow-[0_0_12px_rgba(255,46,46,0.3)]'
            : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-400 hover:text-white'
        }`}
      >
        {isListening
          ? <Mic className="w-3.5 h-3.5 animate-pulse" />
          : <MicOff className="w-3.5 h-3.5" />
        }
        <span className="hidden sm:inline">Voice</span>
      </button>

      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute top-12 right-0 w-56 p-3 rounded-xl border backdrop-blur-md text-xs shadow-xl z-50 ${
              status === 'matched'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'
                : status === 'no-match'
                ? 'bg-zinc-900/90 border-zinc-700 text-zinc-500'
                : 'bg-zinc-900/90 border-gym-neon/30 text-zinc-300'
            }`}
          >
            <div className="text-[9px] uppercase tracking-widest mb-1 opacity-60">
              {status === 'matched' ? '✓ Navigating' : status === 'no-match' ? '? Not recognized' : '🎙 Heard'}
            </div>
            <div className="font-semibold truncate">"{transcript}"</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
