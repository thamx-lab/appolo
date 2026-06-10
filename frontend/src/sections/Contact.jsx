// ====================================================================
// BLACK SHEEP - BRAND CONCIERGE CONTACT FORM
// Features brand coords, support hours, and a premium client inquiry
// form that connects directly to the POST /api/contact endpoint.
// ====================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GymButton from '../components/GymButton';

export default function Contact() {
  // Form input states
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // 1. Submit contact inquiry to POST /api/contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setFeedback({
          type: 'success',
          message: result.message || "✉️ Message sent successfully! Our concierge team will reply shortly."
        });
        // Reset form inputs on success
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback({
          type: 'error',
          message: result.message || "Could not process message. Please check the inputs."
        });
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      setFeedback({
        type: 'error',
        message: "Unable to connect to the messaging server. Please try again later."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 px-6 bg-gym-pitch overflow-hidden">
      
      {/* Visual neon ambient spots */}
      <div className="absolute left-1/4 bottom-1/4 w-[400px] h-[400px] bg-red-950/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/4 w-[350px] h-[350px] bg-zinc-900/30 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-gym-neon uppercase tracking-widest text-xs font-semibold">
            // Brand Concierge
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            CONNECT WITH BLACK SHEEP
          </h2>
          <div className="w-16 h-1 bg-gym-neon mt-4 rounded-full shadow-neon-red/50" />
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* COLUMN 1: Concierge details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <GlassCard tiltIntensity={4} className="h-full bg-zinc-900/10 border-zinc-800/80 p-8 flex flex-col justify-between">
              
              <div>
                <span className="text-gym-neon text-[10px] uppercase font-bold tracking-widest">// Direct Coordinates</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-wide mt-1 mb-6">Black Sheep Sanctuary</h3>
                
                <div className="flex flex-col gap-6">
                  
                  {/* Address */}
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Black+Sheep+Sanctuary,+Bava+Medical,+GH+Opposite,+Palavanchipalayam,+Tiruppur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 items-start p-4 -m-4 rounded-xl hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/60 transition-all duration-300 group cursor-pointer block"
                  >
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 text-gym-neon shadow-neon-red/5 group-hover:bg-gym-neon group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-white text-sm uppercase tracking-wider font-semibold">HQ Physical Lounge</h5>
                      <p className="text-zinc-500 text-xs font-light mt-1 leading-relaxed">
                        bava medical, GH opposite,<br />
                        palavanchipalayam, tiruppur
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-gym-neon text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors duration-200">
                        Get Directions
                        <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </span>
                    </div>
                  </a>

                  {/* Phone */}
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 text-gym-neon shadow-neon-red/5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-white text-sm uppercase tracking-wider font-semibold">Concierge Direct Phone</h5>
                      <p className="text-zinc-500 text-xs font-light mt-1">
                        +91 93458 12081
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 text-gym-neon shadow-neon-red/5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-white text-sm uppercase tracking-wider font-semibold">Support Coordinates</h5>
                      <p className="text-zinc-500 text-xs font-light mt-1">
                        k26647300@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800/80 text-gym-neon shadow-neon-red/5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-white text-sm uppercase tracking-wider font-semibold">Operational Cycles</h5>
                      <p className="text-zinc-500 text-xs font-light mt-1">
                        Gym Floor: 24/7/365 Access<br />
                        Concierge Desk: Mon - Sun (8:00 AM - 10:00 PM)
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-zinc-800/60">
                <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest">
                  // Elite Athleticism Awaits Your Entry
                </p>
              </div>

            </GlassCard>
          </div>

          {/* COLUMN 2: Contact Form inputs */}
          <div className="lg:col-span-7">
            <GlassCard tiltIntensity={5} className="bg-zinc-900/10 border-zinc-800/80 p-8 h-full">
              
              <span className="text-gym-neon text-[10px] uppercase font-bold tracking-widest">// Send Encryption</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-wide mt-1 mb-6">Physique Consult Inquiry</h3>

              {feedback.message && (
                <div className={`p-4 rounded-lg mb-6 border text-sm ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-950/30 border-red-500/30 text-red-400'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 inline mr-2 align-middle" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 inline mr-2 align-middle" />
                  )}
                  <span className="align-middle">{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Your Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Marcus Sterling"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Your Email</label>
                  <input 
                    type="email"
                    required
                    placeholder="marcus@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Inquiry Subject</label>
                  <input 
                    type="text"
                    required
                    placeholder="VIP Platinum Onboarding Consultation"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Support/Request Message</label>
                  <textarea 
                    rows="4"
                    required
                    placeholder="Describe your physical goals and preferred timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-900/60 border border-zinc-850 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-gym-neon focus:ring-1 focus:ring-gym-neon transition-colors resize-none"
                  />
                </div>

                <div className="sm:col-span-2 mt-2">
                  <GymButton 
                    type="submit" 
                    variant="primary" 
                    loading={submitting}
                    className="w-full"
                  >
                    <Send className="w-4 h-4" />
                    Transmit Inquiry
                  </GymButton>
                </div>

              </form>

            </GlassCard>
          </div>

        </div>

      </div>

    </section>
  );
}
