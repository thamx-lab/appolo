// ====================================================================
// ROLEX GYM - MEMBERSHIP PLANS SECTION & JOIN MODAL
// Fetches plans from our REST API (or uses luxury local seed fallbacks),
// displays premium responsive 3D pricing tiers, and opens a custom sign-up
// glass modal connecting directly to POST /api/join.
// ====================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, X, CheckCircle, Smartphone, User, Mail } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GymButton from '../components/GymButton';

// Default luxury seed fallback data if backend API is not yet running
const DEFAULT_PLANS = [
  {
    id: "silver-plan-111",
    name: "Silver Tier",
    price: 49.00,
    duration: "month",
    features: [
      "Access to elite gym floor",
      "Premium high-tech equipment",
      "Locker room & organic spa access",
      "1 complimentary trainer onboarding session"
    ],
    popular: false
  },
  {
    id: "gold-plan-222",
    name: "Gold Elite Tier",
    price: 99.00,
    duration: "month",
    features: [
      "All-hours access (24/7 keycard)",
      "Unlimited premium group classes",
      "Custom biological nutrition profile",
      "Personal dedicated locker & gear cleaning",
      "Bi-weekly sessions with a master trainer"
    ],
    popular: true
  },
  {
    id: "platinum-plan-333",
    name: "Rolex Platinum VIP",
    price: 249.00,
    duration: "month",
    features: [
      "Full 24/7 unrestricted VIP access",
      "Private premium trainer assigned to you",
      "Daily organic protein meal delivery",
      "Access to VIP sauna, pool, and recovery lounges",
      "Elite monthly blood biomarker analysis",
      "Private physiological coaching"
    ],
    popular: false
  }
];

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null); // Tracks chosen plan for signup modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ type: '', message: '' });

  // 1. Fetch active pricing plans from Express API on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        // Replace with production URL on deploy: e.g. https://your-backend.vercel.app/api/plans
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/plans`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setPlans(result.data);
        } else {
          setPlans(DEFAULT_PLANS);
        }
      } catch (err) {
        console.warn("Could not connect to backend API. Loading premium fallback plans...", err);
        setPlans(DEFAULT_PLANS);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const openSignupModal = (plan) => {
    setSelectedPlan(plan);
    setFormFeedback({ type: '', message: '' });
    setFormData({ fullName: '', email: '', phone: '' });
    setIsModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  // 2. Submit new member signup to POST /api/join
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormFeedback({ type: '', message: '' });

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        planId: selectedPlan.id
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setFormFeedback({
          type: 'success',
          message: result.message || "🎉 Successfully signed up! Welcome to Rolex Gym."
        });
        // Clear fields on success
        setFormData({ fullName: '', email: '', phone: '' });
      } else {
        setFormFeedback({
          type: 'error',
          message: result.message || "We encountered an error. Please try again."
        });
      }
    } catch (err) {
      console.error("Join submission error:", err);
      setFormFeedback({
        type: 'error',
        message: "Unable to connect to registration server. Please try again later."
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section id="plans" className="relative py-28 px-6 bg-gym-pitch overflow-hidden">
      
      {/* Decorative neon ambient glows */}
      <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] bg-red-950/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-[450px] h-[450px] bg-zinc-900/50 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Tiered Memberships
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            CHOOSE YOUR LIFESTYLE
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div key={plan.id} className="h-full flex">
              <GlassCard 
                tiltIntensity={6}
                className={`h-full flex flex-col justify-between ${
                  plan.popular ? 'border-red-500/50 shadow-neon-red/20 relative' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gym-neon text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 shadow-neon-red-strong/45">
                    <Flame className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-extrabold text-gym-silver">$</span>
                    <span className="text-6xl font-black text-white tracking-tight">
                      {Math.floor(plan.price)}
                    </span>
                    <span className="text-zinc-500 font-light text-sm lowercase">
                      /{plan.duration}
                    </span>
                  </div>

                  <div className="w-full h-px bg-zinc-800 my-6" />

                  {/* Plan Features */}
                  <ul className="flex flex-col gap-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-0.5 rounded-full bg-gym-neon/10 border border-gym-neon/40 mt-1">
                          <Check className="w-3.5 h-3.5 text-gym-neon" />
                        </div>
                        <span className="text-zinc-400 font-light text-sm leading-snug">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action button */}
                <div className="mt-8 pt-4">
                  <GymButton 
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => openSignupModal(plan)}
                  >
                    Select Plan
                  </GymButton>
                </div>

              </GlassCard>
            </div>
          ))}
        </div>

      </div>

      {/* ====================================================================
          SIGNUP POPUP OVERLAY MODAL (Framer Motion Animated)
          ==================================================================== */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSignupModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg glass-card p-8 rounded-2xl border border-zinc-800 shadow-neon-red/10 z-10 overflow-hidden"
            >
              
              {/* Close Button */}
              <button 
                onClick={closeSignupModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-gym-neon transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-gym-neon uppercase tracking-widest text-[10px] font-semibold">
                  // Secure Checkout
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                  JOIN ROLEX ELITE
                </h3>
                <p className="text-zinc-500 text-xs font-light mt-1">
                  You are subscribing to: <strong className="text-gym-silver">{selectedPlan.name}</strong> for ${Math.floor(selectedPlan.price)}/mo.
                </p>
              </div>

              {formFeedback.message && (
                <div className={`p-4 rounded-lg mb-6 border text-sm ${
                  formFeedback.type === 'success' 
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-950/30 border-red-500/30 text-red-400'
                }`}>
                  {formFeedback.type === 'success' && <CheckCircle className="w-4 h-4 inline mr-2 align-middle" />}
                  <span className="align-middle">{formFeedback.message}</span>
                </div>
              )}

              {/* Form Block */}
              {formFeedback.type !== 'success' ? (
                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                  
                  {/* Field A: Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field B: Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                      />
                    </div>
                  </div>

                  {/* Field C: Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                      />
                    </div>
                  </div>

                  <GymButton 
                    type="submit" 
                    variant="primary" 
                    loading={formSubmitting} 
                    className="w-full mt-2"
                  >
                    Confirm & Onboard
                  </GymButton>

                </form>
              ) : (
                <div className="flex justify-center mt-4">
                  <GymButton 
                    variant="secondary"
                    onClick={closeSignupModal}
                    className="w-full"
                  >
                    Close Window
                  </GymButton>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
