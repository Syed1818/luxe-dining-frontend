"use client";

import { motion } from 'framer-motion';

export default function ChefsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pt-40 pb-32">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-24">
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6">The <span className="font-bold text-amber-500 italic">Masters</span></h1>
          <p className="text-white/50 tracking-widest uppercase text-sm">Meet the visionaries behind the menu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <img 
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80" 
              alt="Head Chef" 
              className="w-full h-[600px] object-cover rounded-[2rem] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="space-y-6">
            <h2 className="text-3xl font-serif text-amber-500">Chef Alexander Wright</h2>
            <h3 className="text-sm tracking-widest text-white/40 uppercase">Executive Chef & Founder</h3>
            
            <div className="text-white/70 font-light leading-relaxed space-y-4 pt-4">
              <p>
                "Cooking is the ultimate act of vulnerability. You are putting your heritage, your training, and your heart onto a plate and offering it to someone else."
              </p>
              <p>
                Trained in the Michelin-starred kitchens of Paris and Tokyo, Chef Alexander brings a rigorous discipline to Luxe Dining. He is obsessive about technique, yet deeply respectful of natural flavors. 
              </p>
              <p>
                He arrives at the kitchen at 5:00 AM every day to inspect the morning's harvest. If a truffle isn't aromatic enough, or a micro-green lacks the perfect snap, it doesn't make it to your table. His philosophy is simple: perfection is a moving target, but the pursuit of it is what makes food art.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}