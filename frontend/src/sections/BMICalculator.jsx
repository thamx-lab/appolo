// ====================================================================
// ROLEX GYM - HIGH-TECH PHYSIOLOGICAL BMI CALCULATOR
// Provides real-time calculations of Body Mass Index, displaying color-coded
// progress grids, numerical feedback, and elite nutritional/training quotes.
// ====================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Sparkles, RefreshCw } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GymButton from '../components/GymButton';

export default function BMICalculator() {
  const [weight, setWeight] = useState(70); // in kg
  const [height, setHeight] = useState(175); // in cm
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  // 1. Calculate BMI mathematical function
  const calculateBMI = (e) => {
    e.preventDefault();
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const computedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(computedBmi);

    // 2. Classify categories with premium physiological quotes
    if (computedBmi < 18.5) {
      setCategory('Underweight');
      setMessage('💡 Recommended: Focused caloric surplus program & heavy compound lift training to build dense muscle mass safely.');
    } else if (computedBmi >= 18.5 && computedBmi < 25) {
      setCategory('Optimal Fitness');
      setMessage('🔥 Recommended: Peak biomarker conditioning. Maintain metabolic strength with an even ratio of progressive strength and conditioning.');
    } else if (computedBmi >= 25 && computedBmi < 30) {
      setCategory('Overweight');
      setMessage('⚡ Recommended: Optimized caloric deficit tracking, steady state cardio intervals, and high volume weight training to preserve muscle.');
    } else {
      setCategory('Obesity Risk');
      setMessage('🧬 Recommended: Biological metabolism coaching, high intensity interval circuits, and personalized nutritional guidance.');
    }
  };

  const resetCalculator = () => {
    setWeight(70);
    setHeight(175);
    setBmi(null);
    setCategory('');
    setMessage('');
  };

  return (
    <section id="bmi" className="relative py-28 px-6 bg-gym-pitch overflow-hidden">
      
      {/* Decorative cyber ambient grids */}
      <div className="absolute right-1/4 top-1/4 w-[450px] h-[450px] bg-red-950/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-1/4 w-[400px] h-[400px] bg-zinc-900/30 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Biomarker Analytics
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            INSTANT BMI ASSESSOR
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Dynamic Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* COLUMN 1: Slider Forms (6 cols) */}
          <div className="lg:col-span-6">
            <GlassCard tiltIntensity={4} className="bg-zinc-900/10 border-zinc-800/60 p-8">
              
              <div className="flex items-center gap-2.5 mb-6 text-white">
                <Calculator className="w-5 h-5 text-gym-neon" />
                <h3 className="text-xl font-bold uppercase tracking-wide">Physique Metrology</h3>
              </div>

              <form onSubmit={calculateBMI} className="flex flex-col gap-6">
                
                {/* Sliders A: Height */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Height</span>
                    <span className="text-lg font-black text-white">{height} <small className="text-zinc-500 font-normal">cm</small></span>
                  </div>
                  <input 
                    type="range"
                    min="120"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gym-neon focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                    <span>120 cm</span>
                    <span>170 cm</span>
                    <span>220 cm</span>
                  </div>
                </div>

                {/* Sliders B: Weight */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Weight</span>
                    <span className="text-lg font-black text-white">{weight} <small className="text-zinc-500 font-normal">kg</small></span>
                  </div>
                  <input 
                    type="range"
                    min="40"
                    max="150"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gym-neon focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                    <span>40 kg</span>
                    <span>95 kg</span>
                    <span>150 kg</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-2">
                  <GymButton type="submit" variant="primary" className="flex-1">
                    Analyze Biomarkers
                  </GymButton>
                  {bmi && (
                    <button 
                      type="button"
                      onClick={resetCalculator}
                      className="p-3 bg-zinc-900 border border-zinc-800 hover:border-gym-neon rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </div>

              </form>

            </GlassCard>
          </div>

          {/* COLUMN 2: Screen Feedback Results (6 cols) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <GlassCard tiltIntensity={6} className="bg-zinc-950/20 border-zinc-900 shadow-glass w-full min-h-[320px] flex items-center justify-center p-8">
              
              {!bmi ? (
                <div className="text-center flex flex-col items-center gap-4">
                  <div className="p-4 bg-gym-steel rounded-full border border-zinc-800 animate-pulse">
                    <Sparkles className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Awaiting Bio-Input Data</h4>
                  <p className="text-zinc-600 font-light text-xs max-w-xs">
                    Adjust the sliders to input height and weight, then click Analyze to view premium advice.
                  </p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col gap-6 text-center"
                >
                  
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">// Your Biological Score</span>
                    <h3 className="text-7xl font-black text-white tracking-tighter mt-1 neon-text-glow">
                      {bmi}
                    </h3>
                  </div>

                  {/* Rating scale visual display */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-400 font-semibold px-2">
                      <span className={category === 'Underweight' ? 'text-blue-400 font-bold' : 'text-zinc-600'}>Under</span>
                      <span className={category === 'Optimal Fitness' ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>Optimal</span>
                      <span className={category === 'Overweight' ? 'text-orange-400 font-bold' : 'text-zinc-600'}>Over</span>
                      <span className={category === 'Obesity Risk' ? 'text-red-500 font-bold' : 'text-zinc-600'}>Obese</span>
                    </div>

                    {/* Progress grid boxes */}
                    <div className="grid grid-cols-4 gap-1.5 h-2">
                      <div className={`rounded-sm transition-all duration-500 ${category === 'Underweight' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-zinc-800'}`} />
                      <div className={`rounded-sm transition-all duration-500 ${category === 'Optimal Fitness' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-zinc-800'}`} />
                      <div className={`rounded-sm transition-all duration-500 ${category === 'Overweight' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'bg-zinc-800'}`} />
                      <div className={`rounded-sm transition-all duration-500 ${category === 'Obesity Risk' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`} />
                    </div>
                  </div>

                  {/* Specialty advice text box */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-left">
                    <h5 className={`font-bold text-xs uppercase tracking-widest ${
                      category === 'Optimal Fitness' ? 'text-emerald-400' :
                      category === 'Underweight' ? 'text-blue-400' :
                      category === 'Overweight' ? 'text-orange-400' : 'text-red-500'
                    }`}>
                      Physique Status: {category}
                    </h5>
                    <p className="text-zinc-400 text-xs font-light mt-1.5 leading-relaxed">
                      {message}
                    </p>
                  </div>

                </motion.div>
              )}

            </GlassCard>
          </div>

        </div>

      </div>

    </section>
  );
}
