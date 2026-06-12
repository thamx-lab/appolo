import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Flame, User, CheckCircle } from 'lucide-react';

const scheduleData = [
  { id: 1, time: '06:00 AM', name: 'Strength Training', trainer: 'Marcus V.', intensity: 'High', type: 'strength' },
  { id: 2, time: '08:00 AM', name: 'Indoor Cycling', trainer: 'Sarah K.', intensity: 'Extreme', type: 'cardio' },
  { id: 3, time: '10:00 AM', name: 'Yoga', trainer: 'Elena R.', intensity: 'Low', type: 'recovery' },
  { id: 4, time: '12:00 PM', name: 'HIIT Workout', trainer: 'David T.', intensity: 'Extreme', type: 'hiit' },
  { id: 5, time: '04:00 PM', name: 'Core Workout', trainer: 'Marcus V.', intensity: 'Medium', type: 'strength' },
  { id: 6, time: '06:30 PM', name: 'Boxing / MMA', trainer: 'Jay P.', intensity: 'High', type: 'mma' },
];

const getTypeColor = (type) => {
  switch (type) {
    case 'strength': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    case 'cardio': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    case 'recovery': return 'text-purple-500 border-purple-500/30 bg-purple-500/10';
    case 'hiit': return 'text-gym-neon border-gym-neon/30 bg-gym-neon/10';
    case 'mma': return 'text-red-500 border-red-500/30 bg-red-500/10';
    default: return 'text-zinc-400 border-zinc-700 bg-zinc-800/50';
  }
};

export default function Schedule() {
  const [hoveredClass, setHoveredClass] = useState(null);
  const [reservedClasses, setReservedClasses] = useState([]);

  const handleReserve = (id) => {
    if (!reservedClasses.includes(id)) {
      setReservedClasses([...reservedClasses, id]);
      // If we had global state, we'd add it to the User Dashboard here
      alert('Spot reserved! Added to your dashboard.');
    }
  };

  return (
    <section id="schedule" className="py-24 bg-gym-pitch relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gym-neon/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gym-neon/20 bg-zinc-900/50 text-gym-neon text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6"
          >
            Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-gym-neon">Schedule</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Reserve your spot in our high-performance classes. Spaces are limited to ensure personalized attention and optimal physiological output.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleData.map((cls, idx) => {
            const isReserved = reservedClasses.includes(cls.id);
            const isHovered = hoveredClass === cls.id;
            
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredClass(cls.id)}
                onMouseLeave={() => setHoveredClass(null)}
                className="relative group bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-gym-neon/40 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(255,46,46,0.1)]"
              >
                {/* Dynamic background glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,46,46,0.05) 0%, transparent 70%)'
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm tracking-widest bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
                      <Clock className="w-4 h-4 text-gym-neon" />
                      {cls.time}
                    </div>
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border ${getTypeColor(cls.type)}`}>
                      {cls.type}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 group-hover:text-gym-neon transition-colors">
                    {cls.name}
                  </h3>

                  {/* Expandable Content on Hover */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span className="font-medium text-zinc-300">{cls.trainer}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Intensity: <span className="font-bold text-white">{cls.intensity}</span></span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-800/50 flex-grow flex items-end">
                    <button
                      onClick={() => handleReserve(cls.id)}
                      disabled={isReserved}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                        ${isReserved 
                          ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' 
                          : 'bg-transparent border border-gym-neon text-gym-neon hover:bg-gym-neon hover:text-white hover:shadow-[0_0_20px_rgba(255,46,46,0.3)]'
                        }`}
                    >
                      {isReserved ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Reserved
                        </>
                      ) : (
                        'Reserve Spot'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
