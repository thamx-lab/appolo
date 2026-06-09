// ====================================================================
// BLACK SHEEP - MEMBERSHIP PLANS SECTION & SECURE CHECKOUT
// Fetches plans from our REST API (or uses seed fallbacks),
// displays premium responsive 3D pricing tiers, provides a USD/INR
// conversion toggle (mapping ₹600, ₹800, and ₹1000), and opens a
// custom checkout modal powered by Razorpay.
// ====================================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, X, CheckCircle, Smartphone, User, Mail, CreditCard, ShieldCheck } from 'lucide-react';
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
      "Access to elite Black Sheep floor",
      "Premium high-tech bio-equipment",
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
    name: "Black Sheep Platinum VIP",
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
  const [currency, setCurrency] = useState('INR'); // Default to INR as requested
  const [selectedPlan, setSelectedPlan] = useState(null); // Tracks chosen plan for signup modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ type: '', message: '' });

  // 1. Fetch plans and load Razorpay Script
  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
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

    // Dynamically load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // 2. Helper to determine the price based on currency
  const getPlanPrice = (plan) => {
    if (currency === 'INR') {
      if (plan.name.toLowerCase().includes('silver')) return 600;
      if (plan.name.toLowerCase().includes('gold')) return 800;
      return 1000;
    }
    return Math.floor(plan.price);
  };

  const openSignupModal = (plan) => {
    setSelectedPlan(plan);
    setFormFeedback({ type: '', message: '' });
    setFormData({ fullName: '', email: '', phone: '' });
    setPaymentSuccessData(null);
    setIsModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setPaymentSuccessData(null);
  };

  // 3. SECURE payment flow:
  //    Step 1 → Server creates Razorpay Order (amount set server-side, tamper-proof)
  //    Step 2 → Client opens Razorpay Checkout with server-provided order_id & key
  //    Step 3 → After payment, server verifies HMAC-SHA256 signature
  //    Step 4 → Only after verification, member is registered
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setFormFeedback({ type: 'error', message: 'Please fill out all onboarding fields.' });
      return;
    }

    setFormSubmitting(true);
    setFormFeedback({ type: '', message: '' });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      // ── STEP 1: Create order on the SERVER ──────────────────────
      // The amount is determined by the server based on plan name.
      // This prevents users from tampering with the price in the browser.
      const orderRes = await fetch(`${apiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: selectedPlan.name,
          memberEmail: formData.email
        })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Could not create payment order.');
      }

      // ── STEP 2: Open Razorpay Checkout ──────────────────────────
      if (!window.Razorpay) {
        throw new Error('Payment system is still loading. Please wait a moment and try again.');
      }

      const options = {
        key: orderData.keyId,            // Public key from server (safe to use in browser)
        amount: orderData.amount,         // Amount in paise, from server
        currency: orderData.currency,     // INR, from server
        order_id: orderData.orderId,      // Razorpay order ID from server
        name: "Black Sheep Fitness",
        description: `Membership: ${selectedPlan.name}`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#ff2e2e" },
        handler: async function (response) {
          // ── STEP 3: Verify payment on the SERVER ────────────────
          // Send the signature for HMAC-SHA256 verification.
          // The server checks that Razorpay genuinely signed this payment.
          try {
            const verifyRes = await fetch(`${apiUrl}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                memberName:  formData.fullName,
                memberEmail: formData.email,
                planName:    selectedPlan.name,
                amount:      orderData.amount
              })
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Payment verification failed.');
            }

            // ── STEP 4: Register member ───────────────────────────
            const registerRes = await fetch(`${apiUrl}/api/join`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                planId: selectedPlan.id
              })
            });
            const registerData = await registerRes.json();

            if (!registerRes.ok || !registerData.success) {
              // Payment went through but registration failed — still show success
              // since money was collected. The admin can register manually.
              console.warn('Member registration note:', registerData.message);
            }

            setFormFeedback({
              type: 'success',
              message: '🎉 Payment verified! Welcome to Black Sheep.'
            });

            setPaymentSuccessData({
              txnId: response.razorpay_payment_id,
              amount: orderData.amount / 100, // convert paise to INR for display
              currency: 'INR',
              planName: selectedPlan.name,
              timestamp: new Date().toLocaleString()
            });

            setFormData({ fullName: '', email: '', phone: '' });
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setFormFeedback({
              type: 'error',
              message: verifyErr.message || 'Payment verification failed. Contact support.'
            });
          } finally {
            setFormSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setFormSubmitting(false);
            setFormFeedback({ type: 'error', message: 'Payment cancelled.' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Checkout error:', err);
      setFormFeedback({
        type: 'error',
        message: err.message || 'Unable to start payment. Please try again.'
      });
      setFormSubmitting(false);
    }
  };

  return (
    <section id="plans" className="relative py-28 px-6 bg-gym-pitch overflow-hidden">
      
      <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] bg-red-950/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 w-[450px] h-[450px] bg-zinc-900/50 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Tiered Memberships
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            CHOOSE YOUR LIFESTYLE
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Currency Switcher Toggle */}
        <div className="flex justify-center items-center gap-3 mb-16">
          <span className={`text-xs uppercase font-bold tracking-widest transition-colors ${currency === 'USD' ? 'text-gym-neon' : 'text-zinc-500'}`}>
            USD ($)
          </span>
          <button 
            onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
            className="w-12 h-6 rounded-full bg-zinc-900 border border-zinc-800 p-0.5 flex items-center transition-all cursor-pointer relative"
          >
            <div className={`w-4.5 h-4.5 rounded-full bg-gym-neon transition-all shadow-neon-red/35 ${
              currency === 'INR' ? 'ml-6' : 'ml-0'
            }`} />
          </button>
          <span className={`text-xs uppercase font-bold tracking-widest transition-colors ${currency === 'INR' ? 'text-gym-neon' : 'text-zinc-500'}`}>
            INR (₹)
          </span>
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
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gym-neon text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 shadow-neon-red-strong/45">
                    <Flame className="w-3 h-3 fill-white" />
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    {plan.name.replace("Rolex", "Black Sheep")}
                  </h3>
                  
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-extrabold text-gym-silver">
                      {currency === 'INR' ? '₹' : '$'}
                    </span>
                    <span className="text-6xl font-black text-white tracking-tight">
                      {getPlanPrice(plan)}
                    </span>
                    <span className="text-zinc-500 font-light text-sm lowercase">
                      /{plan.duration}
                    </span>
                  </div>

                  <div className="w-full h-px bg-zinc-800 my-6" />

                  <ul className="flex flex-col gap-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="p-0.5 rounded-full bg-gym-neon/10 border border-gym-neon/40 mt-1">
                          <Check className="w-3.5 h-3.5 text-gym-neon" />
                        </div>
                        <span className="text-zinc-400 font-light text-sm leading-snug">
                          {feat.replace("Rolex", "Black Sheep")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

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

      {/* SIGNUP POPUP OVERLAY MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSignupModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg glass-card p-8 rounded-2xl border border-zinc-800 shadow-neon-red/10 z-10 overflow-hidden"
            >
              
              <button 
                onClick={closeSignupModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-gym-neon transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-gym-neon uppercase tracking-widest text-[10px] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Secure Checkout Portal
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
                  JOIN BLACK SHEEP ELITE
                </h3>
                <p className="text-zinc-500 text-xs font-light mt-1">
                  Subscribing to: <strong className="text-gym-silver">{selectedPlan.name.replace("Rolex", "Black Sheep")}</strong> for {currency === 'INR' ? '₹' : '$'}{getPlanPrice(selectedPlan)}/{selectedPlan.duration}.
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

              {/* Secure Receipt display if payment completes */}
              {paymentSuccessData ? (
                <div className="flex flex-col gap-4 bg-zinc-950/80 p-5 rounded-xl border border-zinc-850 text-sm mb-6">
                  <div className="text-center font-bold text-emerald-400 uppercase tracking-widest text-xs border-b border-zinc-900 pb-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Payment Receipt
                  </div>
                  <div className="flex justify-between"><span className="text-zinc-500">Plan Sanctuary:</span> <span className="font-semibold text-white">{paymentSuccessData.planName.replace("Rolex", "Black Sheep")}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Amount Charged:</span> <span className="font-black text-gym-neon">{paymentSuccessData.currency === 'INR' ? '₹' : '$'}{paymentSuccessData.amount}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Transaction ID:</span> <span className="font-mono text-zinc-400 text-xs">{paymentSuccessData.txnId}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Authorized At:</span> <span className="text-zinc-400 text-xs">{paymentSuccessData.timestamp}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Status Check:</span> <span className="text-xs uppercase bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold">Paid & Active</span></div>
                </div>
              ) : null}

              {/* Form Block */}
              {!paymentSuccessData ? (
                <form onSubmit={handleCheckout} className="flex flex-col gap-4">
                  
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="tel"
                        required
                        placeholder="9345812081"
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
                    <CreditCard className="w-4 h-4" />
                    Authorize Payment & Onboard
                  </GymButton>

                </form>
              ) : (
                <div className="flex justify-center mt-4">
                  <GymButton 
                    variant="secondary"
                    onClick={closeSignupModal}
                    className="w-full"
                  >
                    Close Portal Window
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
