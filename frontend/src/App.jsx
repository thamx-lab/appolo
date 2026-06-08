import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Menu, X, LayoutDashboard } from 'lucide-react';

// ✅ Lazy load ALL sections — each becomes its own chunk
const Hero         = lazy(() => import('./sections/Hero'));
const About        = lazy(() => import('./sections/About'));
const Plans        = lazy(() => import('./sections/Plans'));
const Trainers     = lazy(() => import('./sections/Trainers'));
const BMICalculator= lazy(() => import('./sections/BMICalculator'));
const Testimonials = lazy(() => import('./sections/Testimonials'));
const Contact      = lazy(() => import('./sections/Contact'));
const Footer        = lazy(() => import('./sections/Footer'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));

// Simple dark fallback while a section loads
const SectionFallback = () => (
  <div className="w-full min-h-[200px] bg-gym-pitch" />
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative text-gym-silver select-none">

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 bg-gym-pitch z-[999] flex flex-col items-center justify-center p-6"
          >
            <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center">
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="p-4 bg-gym-steel rounded-2xl border border-red-500/25 shadow-neon-red-strong/20"
              >
                <Flame className="w-10 h-10 text-gym-neon fill-gym-neon" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-widest text-white mt-2">
                  BLACK<span className="text-gym-neon"> SHEEP</span>
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Calibrating Biological Transmitters...
                </p>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-4 border border-zinc-800/40">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.0, ease: "easeInOut" }}
                  className="h-full bg-gym-neon shadow-[0_0_8px_#ff2e2e]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Nav Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-md py-4 border-zinc-900 shadow-glass'
          : 'bg-transparent py-6 border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 cursor-pointer">
            <div className="p-1 rounded-md bg-gym-neon shadow-neon-red/35">
              <Flame className="w-4.5 h-4.5 fill-white text-white" />
            </div>
            <span className="text-lg font-black uppercase tracking-widest text-white">
              BLACK<span className="text-gym-neon"> SHEEP</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['about','plans','trainers','bmi','contact'].map((id, i) => (
              <button key={id} onClick={() => handleNavClick(id)}
                className="text-zinc-400 hover:text-gym-neon text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer focus:outline-none">
                {['Story','Tiers','Coaches','Metrics','Concierge'][i]}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setDashboardOpen(true)}
              title="My Dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-transparent border border-zinc-700 hover:border-purple-400 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button onClick={() => handleNavClick('plans')}
              className="px-5 py-2.5 rounded-lg bg-transparent border border-zinc-700 hover:border-gym-neon text-white hover:bg-gym-neon/10 text-xs uppercase font-bold tracking-widest transition-all cursor-pointer shadow-glass">
              Enter Sanctuary
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white transition-colors">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[70px] z-30 bg-black/95 backdrop-blur-lg md:hidden p-6 border-t border-zinc-900"
          >
            <nav className="flex flex-col gap-6 items-center justify-center h-2/3">
              {[['about','Our Story'],['plans','Membership Tiers'],['trainers','Master Coaches'],['bmi','Bio Assessor'],['contact','Concierge Desk']].map(([id, label]) => (
                <button key={id} onClick={() => handleNavClick(id)}
                  className="text-zinc-400 hover:text-white text-base font-bold uppercase tracking-widest focus:outline-none">
                  {label}
                </button>
              ))}
              <button
                onClick={() => { setMobileMenuOpen(false); setDashboardOpen(true); }}
                className="w-full max-w-xs px-6 py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-bold uppercase tracking-widest text-center"
              >
                My Dashboard
              </button>
              <button onClick={() => handleNavClick('plans')}
                className="w-full max-w-xs mt-2 px-6 py-3 rounded-lg bg-gym-neon text-white text-sm font-bold uppercase tracking-widest text-center shadow-neon-red/35">
                Join Black Sheep
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ All sections wrapped in Suspense — load only when needed */}
      <main>
        <Suspense fallback={<SectionFallback />}><Hero /></Suspense>
        <Suspense fallback={<SectionFallback />}><About /></Suspense>
        <Suspense fallback={<SectionFallback />}><Plans /></Suspense>
        <Suspense fallback={<SectionFallback />}><Trainers /></Suspense>
        <Suspense fallback={<SectionFallback />}><BMICalculator /></Suspense>
        <Suspense fallback={<SectionFallback />}><Testimonials /></Suspense>
        <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
      </main>

      <Suspense fallback={<SectionFallback />}><Footer /></Suspense>

      {/* User Dashboard Overlay */}
      {dashboardOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center"><Flame className="w-8 h-8 text-gym-neon animate-pulse" /></div>}>
          <UserDashboard onClose={() => setDashboardOpen(false)} />
        </Suspense>
      )}

    </div>
  );
}
