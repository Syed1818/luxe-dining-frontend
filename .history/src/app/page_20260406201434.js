"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-40 pb-32 relative z-10 text-center">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="text-amber-500 font-medium tracking-[0.3em] uppercase text-sm mb-6">Established 2024</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-12">
            A Legacy of <br/><span className="font-bold text-amber-500 italic">Flavor</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }}
          className="space-y-8 text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto text-justify"
        >
          <p>
            What began as a quiet ambition in a small cobblestone kitchen has blossomed into a sanctuary for culinary excellence. Luxe Dining was founded on a singular philosophy: that a meal is not merely sustenance, but a woven tapestry of memories, art, and the finest ingredients the earth has to offer.
          </p>
          <p>
            For years, we have cultivated relationships with local artisans, organic farmers, and deep-sea fishers to ensure that every plate tells the story of its origin. 
          </p>
          <p>
            Our dining room is designed to strip away the noise of the outside world. Here, time slows down. The clinking of crystal, the ambient warmth, and the meticulous architecture of our dishes invite you to be entirely present in the moment.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="mt-20">
          <img 
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80" 
            alt="Restaurant Interior" 
            className="w-full h-[400px] object-cover rounded-3xl opacity-80 border border-white/10"
          />
        </motion.div>

      </div>
    </main>
  );
}