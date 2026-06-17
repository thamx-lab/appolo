import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    // We only initialize the audio context when the user clicks 'Play'
    // to comply with browser autoplay policies.
    if (isPlaying && !audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      
      // Create a low drone oscillator
      oscillatorRef.current = audioCtxRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(55, audioCtxRef.current.currentTime); // Low A

      // Create a gain node for volume control
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime); // Start at 0 volume
      
      // Add subtle modulation (LFO) for a "breathing" effect
      const lfo = audioCtxRef.current.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, audioCtxRef.current.currentTime); // Very slow
      const lfoGain = audioCtxRef.current.createGain();
      lfoGain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gainNodeRef.current.gain);
      lfo.start();

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioCtxRef.current.destination);
      oscillatorRef.current.start();
    }

    if (audioCtxRef.current) {
      if (isPlaying) {
        // Fade in
        audioCtxRef.current.resume();
        gainNodeRef.current.gain.setTargetAtTime(0.1, audioCtxRef.current.currentTime, 1);
      } else {
        // Fade out
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
          if (audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
          }
        }, 1000);
      }
    }

    return () => {
      // Cleanup is handled cautiously to allow pausing/resuming
    };
  }, [isPlaying]);

  return (
    <button
      onClick={() => setIsPlaying(!isPlaying)}
      title="Toggle Ambient Sound"
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-transparent border border-zinc-700 hover:border-gym-neon text-zinc-400 hover:text-gym-neon text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
    >
      {isPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">Audio</span>
    </button>
  );
}
