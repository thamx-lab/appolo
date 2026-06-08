// ====================================================================
// BLACK SHEEP - USER DASHBOARD COMPONENT
// A personal fitness command center with:
//   • Daily Workout Reminders (localStorage-persisted)
//   • Water Intake Tracker (daily goal: 8 glasses)
//   • Calorie Tracker (daily log with in/out)
//   • BMI History Log (stores past calculations)
// ====================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Droplets,
  Flame,
  Bell,
  BellOff,
  Activity,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Coffee,
  Dumbbell,
  Apple
} from 'lucide-react';

// ─── Local Storage Helpers ─────────────────────────────────────────────────
const getTodayKey = () => new Date().toISOString().slice(0, 10); // e.g. "2025-06-07"

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {/* quota exceeded, ignore */}
}

// ─── Sub-Component: Circular Progress Ring ─────────────────────────────────
function ProgressRing({ value, max, color, size = 80, children }) {
  const pct = Math.min(value / max, 1);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ──────────────────────────────────────────────
export default function UserDashboard({ onClose }) {
  const today = getTodayKey();

  // ── Reminders ──────────────────────────────────────────────────────────
  const [reminders, setReminders] = useState(() => loadFromStorage('bs_reminders', [
    { id: 1, text: 'Morning stretch routine', done: false, time: '07:00' },
    { id: 2, text: 'Evening cardio session',  done: false, time: '18:00' },
    { id: 3, text: 'Drink 8 glasses of water', done: false, time: '09:00' },
  ]));
  const [newReminder, setNewReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');

  // ── Water Tracker ──────────────────────────────────────────────────────
  const waterKey = `bs_water_${today}`;
  const [waterGlasses, setWaterGlasses] = useState(() => loadFromStorage(waterKey, 0));
  const WATER_GOAL = 8;

  // ── Calorie Tracker ────────────────────────────────────────────────────
  const calKey = `bs_calories_${today}`;
  const [calorieLog, setCalorieLog] = useState(() => loadFromStorage(calKey, []));
  const [newCalLabel, setNewCalLabel] = useState('');
  const [newCalAmount, setNewCalAmount] = useState('');
  const [calType, setCalType] = useState('consumed'); // 'consumed' | 'burned'
  const DAILY_CAL_GOAL = 2000;

  // ── BMI History ────────────────────────────────────────────────────────
  const [bmiHistory, setBmiHistory] = useState(() => loadFromStorage('bs_bmi_history', []));
  const [bmiForm, setBmiForm] = useState({ weight: '', height: '', unit: 'metric' });
  const [showBmiForm, setShowBmiForm] = useState(false);

  // ── Persist Changes ────────────────────────────────────────────────────
  useEffect(() => saveToStorage('bs_reminders', reminders), [reminders]);
  useEffect(() => saveToStorage(waterKey, waterGlasses), [waterGlasses, waterKey]);
  useEffect(() => saveToStorage(calKey, calorieLog), [calorieLog, calKey]);
  useEffect(() => saveToStorage('bs_bmi_history', bmiHistory), [bmiHistory]);

  // ── Handlers: Reminders ────────────────────────────────────────────────
  const toggleReminder = useCallback((id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  }, []);

  const addReminder = useCallback(() => {
    if (!newReminder.trim()) return;
    setReminders(prev => [
      ...prev,
      { id: Date.now(), text: newReminder.trim(), done: false, time: reminderTime }
    ]);
    setNewReminder('');
    setReminderTime('08:00');
  }, [newReminder, reminderTime]);

  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── Handlers: Water ────────────────────────────────────────────────────
  const addWater = () => setWaterGlasses(prev => Math.min(prev + 1, WATER_GOAL + 4));
  const removeWater = () => setWaterGlasses(prev => Math.max(prev - 1, 0));

  // ── Handlers: Calories ─────────────────────────────────────────────────
  const addCalorieEntry = useCallback(() => {
    const amt = parseInt(newCalAmount, 10);
    if (!newCalLabel.trim() || isNaN(amt) || amt <= 0) return;
    setCalorieLog(prev => [
      { id: Date.now(), label: newCalLabel.trim(), amount: amt, type: calType, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev
    ]);
    setNewCalLabel('');
    setNewCalAmount('');
  }, [newCalLabel, newCalAmount, calType]);

  const deleteCalEntry = useCallback((id) => {
    setCalorieLog(prev => prev.filter(e => e.id !== id));
  }, []);

  const caloriesConsumed = calorieLog.filter(e => e.type === 'consumed').reduce((s, e) => s + e.amount, 0);
  const caloriesBurned   = calorieLog.filter(e => e.type === 'burned').reduce((s, e) => s + e.amount, 0);
  const netCalories = caloriesConsumed - caloriesBurned;

  // ── Handlers: BMI ──────────────────────────────────────────────────────
  const calculateBMI = useCallback(() => {
    const w = parseFloat(bmiForm.weight);
    const h = parseFloat(bmiForm.height);
    if (!w || !h || w <= 0 || h <= 0) return;

    let bmiValue;
    if (bmiForm.unit === 'metric') {
      const hMeters = h / 100;
      bmiValue = w / (hMeters * hMeters);
    } else {
      // imperial: weight in lbs, height in inches
      bmiValue = (w / (h * h)) * 703;
    }

    const rounded = parseFloat(bmiValue.toFixed(1));
    let category = 'Normal';
    let color = '#22c55e';
    if (rounded < 18.5) { category = 'Underweight'; color = '#3b82f6'; }
    else if (rounded >= 25 && rounded < 30) { category = 'Overweight'; color = '#f59e0b'; }
    else if (rounded >= 30) { category = 'Obese'; color = '#ef4444'; }

    setBmiHistory(prev => [
      { id: Date.now(), bmi: rounded, category, color, date: new Date().toLocaleDateString(), weight: w, height: h, unit: bmiForm.unit },
      ...prev.slice(0, 9) // keep last 10 entries
    ]);
    setBmiForm({ weight: '', height: '', unit: bmiForm.unit });
    setShowBmiForm(false);
  }, [bmiForm]);

  const deleteBmiEntry = useCallback((id) => {
    setBmiHistory(prev => prev.filter(e => e.id !== id));
  }, []);

  const doneReminders = reminders.filter(r => r.done).length;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl"
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gym-neon/10 border border-gym-neon/20">
                <Activity className="w-5 h-5 text-gym-neon" />
              </div>
              <div>
                <h2 className="text-white font-black text-lg uppercase tracking-widest">Personal Dashboard</h2>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-500 hover:text-white hover:border-gym-neon/40 hover:bg-gym-neon/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Dashboard Grid ────────────────────────────────────────── */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ═══════════════════════════════════════════
                PANEL 1: DAILY REMINDERS
            ═══════════════════════════════════════════ */}
            <div className="lg:col-span-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gym-neon" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest">Reminders</h3>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {doneReminders}/{reminders.length} done
                </span>
              </div>

              {/* Progress mini-bar */}
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gym-neon rounded-full transition-all duration-500"
                  style={{ width: `${reminders.length ? (doneReminders / reminders.length) * 100 : 0}%` }}
                />
              </div>

              {/* Reminder list */}
              <ul className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-52 pr-1">
                {reminders.length === 0 && (
                  <li className="text-zinc-600 text-xs text-center py-6">No reminders yet. Add one below!</li>
                )}
                {reminders.map(r => (
                  <li key={r.id} className="flex items-center gap-3 group">
                    <button
                      onClick={() => toggleReminder(r.id)}
                      className="flex-shrink-0 text-zinc-600 hover:text-gym-neon transition-colors cursor-pointer"
                    >
                      {r.done
                        ? <CheckCircle className="w-4 h-4 text-gym-neon" />
                        : <Circle className="w-4 h-4" />
                      }
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate transition-all ${r.done ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                        {r.text}
                      </p>
                      <p className="text-[10px] text-zinc-600">{r.time}</p>
                    </div>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-all cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add reminder */}
              <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                <input
                  type="text"
                  value={newReminder}
                  onChange={e => setNewReminder(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addReminder()}
                  placeholder="New reminder..."
                  className="bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-gym-neon transition-all"
                />
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="bg-zinc-800/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-zinc-400 focus:outline-none focus:border-gym-neon transition-all flex-1"
                  />
                  <button
                    onClick={addReminder}
                    className="px-3 py-2 bg-gym-neon rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                PANEL 2: WATER TRACKER
            ═══════════════════════════════════════════ */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Water Intake</h3>
              </div>

              <div className="flex flex-col items-center gap-4 flex-1 justify-center py-2">
                <ProgressRing value={waterGlasses} max={WATER_GOAL} color="#60a5fa" size={110}>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{waterGlasses}</p>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">/ {WATER_GOAL}</p>
                  </div>
                </ProgressRing>

                <div className="text-center">
                  <p className="text-blue-400 text-xs font-bold">
                    {waterGlasses >= WATER_GOAL ? '🎉 Daily goal reached!' : `${WATER_GOAL - waterGlasses} glasses to go`}
                  </p>
                  <p className="text-zinc-600 text-[10px] mt-0.5">≈ {(waterGlasses * 250)} ml consumed</p>
                </div>

                {/* Water glass grid */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: WATER_GOAL }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        i < waterGlasses
                          ? 'bg-blue-500/20 border-blue-400 text-blue-400'
                          : 'bg-zinc-800/40 border-zinc-700 text-zinc-700'
                      }`}
                    >
                      <Droplets className="w-3.5 h-3.5" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={removeWater}
                  disabled={waterGlasses === 0}
                  className="flex-1 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  − Remove
                </button>
                <button
                  onClick={addWater}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
                >
                  + Add Glass
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                PANEL 3: CALORIE TRACKER
            ═══════════════════════════════════════════ */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Calories</h3>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Consumed', value: caloriesConsumed, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { label: 'Burned',   value: caloriesBurned,   color: 'text-green-400',  bg: 'bg-green-500/10'  },
                  { label: 'Net',      value: netCalories,      color: netCalories > DAILY_CAL_GOAL ? 'text-red-400' : 'text-white', bg: 'bg-zinc-800/60' },
                ].map(item => (
                  <div key={item.label} className={`${item.bg} rounded-lg p-2.5 text-center border border-zinc-800`}>
                    <p className={`text-base font-black ${item.color}`}>{item.value.toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Net progress bar */}
              <div>
                <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
                  <span>Net vs Goal ({DAILY_CAL_GOAL} kcal)</span>
                  <span>{Math.min(Math.round((netCalories / DAILY_CAL_GOAL) * 100), 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${netCalories > DAILY_CAL_GOAL ? 'bg-red-500' : 'bg-orange-400'}`}
                    style={{ width: `${Math.min((netCalories / DAILY_CAL_GOAL) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Log list */}
              <ul className="flex flex-col gap-1.5 overflow-y-auto max-h-28 pr-1">
                {calorieLog.length === 0 && (
                  <li className="text-zinc-600 text-xs text-center py-3">No entries yet. Log your first meal!</li>
                )}
                {calorieLog.map(e => (
                  <li key={e.id} className="flex items-center gap-2 group text-xs">
                    <span className={`flex-shrink-0 px-1.5 py-0.5 rounded font-bold uppercase text-[9px] tracking-wide ${e.type === 'consumed' ? 'bg-orange-500/15 text-orange-400' : 'bg-green-500/15 text-green-400'}`}>
                      {e.type === 'consumed' ? 'IN' : 'OUT'}
                    </span>
                    <span className="text-zinc-300 flex-1 truncate">{e.label}</span>
                    <span className="text-zinc-500 flex-shrink-0">{e.amount} kcal</span>
                    <button onClick={() => deleteCalEntry(e.id)} className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-all cursor-pointer flex-shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add entry */}
              <div className="border-t border-zinc-800 pt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalType('consumed')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${calType === 'consumed' ? 'bg-orange-500/20 border-orange-400 text-orange-400' : 'border-zinc-700 text-zinc-600 hover:border-zinc-500'}`}
                  >
                    <Apple className="w-3 h-3 inline mr-1" />Ate
                  </button>
                  <button
                    onClick={() => setCalType('burned')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${calType === 'burned' ? 'bg-green-500/20 border-green-400 text-green-400' : 'border-zinc-700 text-zinc-600 hover:border-zinc-500'}`}
                  >
                    <Dumbbell className="w-3 h-3 inline mr-1" />Burned
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCalLabel}
                    onChange={e => setNewCalLabel(e.target.value)}
                    placeholder="Food / Activity..."
                    className="flex-1 min-w-0 bg-zinc-800/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-gym-neon transition-all"
                  />
                  <input
                    type="number"
                    value={newCalAmount}
                    onChange={e => setNewCalAmount(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCalorieEntry()}
                    placeholder="kcal"
                    min="1"
                    className="w-16 bg-zinc-800/80 border border-zinc-700 rounded-lg px-2 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-gym-neon transition-all"
                  />
                  <button
                    onClick={addCalorieEntry}
                    className="px-3 py-2 bg-gym-neon rounded-lg text-white text-xs font-bold hover:bg-red-500 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                PANEL 4: BMI HISTORY LOG (full-width)
            ═══════════════════════════════════════════ */}
            <div className="lg:col-span-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-white font-bold text-sm uppercase tracking-widest">BMI History Log</h3>
                  <span className="text-[10px] text-zinc-600 ml-1">(last 10 entries)</span>
                </div>
                <button
                  onClick={() => setShowBmiForm(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  {showBmiForm ? 'Cancel' : 'Log BMI'}
                </button>
              </div>

              {/* BMI input form */}
              <AnimatePresence>
                {showBmiForm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 flex flex-wrap gap-3 items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBmiForm(f => ({ ...f, unit: 'metric' }))}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer border transition-all ${bmiForm.unit === 'metric' ? 'bg-purple-500/20 border-purple-400 text-purple-400' : 'border-zinc-700 text-zinc-600'}`}
                        >
                          Metric (kg/cm)
                        </button>
                        <button
                          onClick={() => setBmiForm(f => ({ ...f, unit: 'imperial' }))}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer border transition-all ${bmiForm.unit === 'imperial' ? 'bg-purple-500/20 border-purple-400 text-purple-400' : 'border-zinc-700 text-zinc-600'}`}
                        >
                          Imperial (lbs/in)
                        </button>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                            Weight ({bmiForm.unit === 'metric' ? 'kg' : 'lbs'})
                          </label>
                          <input
                            type="number"
                            value={bmiForm.weight}
                            onChange={e => setBmiForm(f => ({ ...f, weight: e.target.value }))}
                            placeholder={bmiForm.unit === 'metric' ? '70' : '154'}
                            min="1"
                            className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                            Height ({bmiForm.unit === 'metric' ? 'cm' : 'inches'})
                          </label>
                          <input
                            type="number"
                            value={bmiForm.height}
                            onChange={e => setBmiForm(f => ({ ...f, height: e.target.value }))}
                            placeholder={bmiForm.unit === 'metric' ? '175' : '69'}
                            min="1"
                            className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 transition-all"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={calculateBMI}
                            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
                          >
                            Calculate & Log
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BMI categories reference */}
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: 'Underweight', range: '< 18.5', color: 'text-blue-400 border-blue-400/20 bg-blue-500/5' },
                  { label: 'Normal',      range: '18.5–24.9', color: 'text-green-400 border-green-400/20 bg-green-500/5' },
                  { label: 'Overweight',  range: '25–29.9', color: 'text-yellow-400 border-yellow-400/20 bg-yellow-500/5' },
                  { label: 'Obese',       range: '≥ 30', color: 'text-red-400 border-red-400/20 bg-red-500/5' },
                ].map(c => (
                  <div key={c.label} className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${c.color}`}>
                    {c.label} <span className="font-normal opacity-70">{c.range}</span>
                  </div>
                ))}
              </div>

              {/* BMI History Table */}
              {bmiHistory.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-xs">
                  No BMI records yet. Click "Log BMI" to record your first entry.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left text-zinc-600 text-[10px] uppercase tracking-widest pb-2 pr-4">Date</th>
                        <th className="text-left text-zinc-600 text-[10px] uppercase tracking-widest pb-2 pr-4">BMI</th>
                        <th className="text-left text-zinc-600 text-[10px] uppercase tracking-widest pb-2 pr-4">Category</th>
                        <th className="text-left text-zinc-600 text-[10px] uppercase tracking-widest pb-2 pr-4">Weight</th>
                        <th className="text-left text-zinc-600 text-[10px] uppercase tracking-widest pb-2 pr-4">Height</th>
                        <th className="text-right text-zinc-600 text-[10px] uppercase tracking-widest pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bmiHistory.map((entry, idx) => (
                        <motion.tr
                          key={entry.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-zinc-800/50 group"
                        >
                          <td className="py-2.5 pr-4 text-zinc-500">{entry.date}</td>
                          <td className="py-2.5 pr-4">
                            <span className="font-black text-white text-base">{entry.bmi}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                              style={{ color: entry.color, backgroundColor: `${entry.color}18`, border: `1px solid ${entry.color}30` }}
                            >
                              {entry.category}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-zinc-400">{entry.weight} {entry.unit === 'metric' ? 'kg' : 'lbs'}</td>
                          <td className="py-2.5 pr-4 text-zinc-400">{entry.height} {entry.unit === 'metric' ? 'cm' : 'in'}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={() => deleteBmiEntry(entry.id)}
                              className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-500 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
