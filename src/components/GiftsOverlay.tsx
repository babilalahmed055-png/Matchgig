/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface FloatingIcon {
  id: number;
  icon: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  label: string;
}

interface GiftsOverlayProps {
  triggerEvent: { icon: string; label: string; timestamp: number } | null;
}

export default function GiftsOverlay({ triggerEvent }: GiftsOverlayProps) {
  const [particles, setParticles] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    if (!triggerEvent) return;

    // Generate burst of particles centered on user screen
    const newParticles: FloatingIcon[] = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      icon: triggerEvent.icon,
      // Random coordinates shooting from bottom center
      x: (Math.random() - 0.5) * 300,
      y: -(Math.random() * 400 + 100),
      size: Math.random() * 24 + 28,
      rotation: (Math.random() - 0.5) * 60,
      label: triggerEvent.label
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Cleanup individual particles after 2 seconds
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id > Date.now() - 2500));
    }, 2500);

    return () => clearTimeout(timer);
  }, [triggerEvent]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Big Center Gift Notification Card */}
      <AnimatePresence>
        {triggerEvent && Date.now() - triggerEvent.timestamp < 2000 && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.4, opacity: 0, y: -80 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-neutral-900/90 border border-amber-500/40 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 backdrop-blur-md"
            id={`gift-promo-${triggerEvent.timestamp}`}
          >
            <div className="text-5xl animate-bounce">{triggerEvent.icon}</div>
            <div>
              <p className="text-amber-400 text-xs uppercase tracking-widest font-mono font-semibold">Virtual Gift Sent</p>
              <h4 className="text-xl font-bold text-white tracking-tight">{triggerEvent.label} Activated!</h4>
              <p className="text-gray-400 text-xs">Simulating spectacular creators support</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparks/Gifts */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0.5, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [1, 1, 0.8, 0],
                x: particle.x,
                y: particle.y,
                rotate: particle.rotation,
                scale: [0.5, 1.2, 1, 0.6]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="absolute select-none text-center"
              style={{ fontSize: `${particle.size}px` }}
              id={`particle-${particle.id}`}
            >
              {particle.icon}
              <div className="text-[10px] text-white font-mono bg-black/50 px-1 py-0.5 rounded backdrop-blur-sm -mt-1 font-semibold whitespace-nowrap">
                {particle.label}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
