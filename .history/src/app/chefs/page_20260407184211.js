"use client";

import { motion } from 'framer-motion';

// Signature Luxe Easing Curve
const smoothEase = [0.22, 1, 0.36, 1];

// Scroll-triggered Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: smoothEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40, filter: 'blur(10px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: smoothEase } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.2, ease: smoothEase } }
};

export default function ChefsPage() {
  return (
    <>
      {/* 1. Global Cinematic Background Video (Visibility Synced with Menu) */}
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 grayscale" 
        >
          {/* Increased opacity to 60 to match menu */}
          <source src="/video1.mp4" type="video/mp4" />
          <img src="/fallback-hero.jpg" alt="Background Fallback" />
        </video>
        {/* Lightened gradient overlay to match the menu exactly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/50 to-[#050505]/90 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 min-h-screen bg-transparent text-zinc-100 overflow-hidden">
        
        {/* SECTION 1: FULL-SCREEN HERO */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-amber-500 font-medium tracking-[0.4em] uppercase text-xs md:text-sm mb-6 drop-shadow-md">
              The Visionaries
            </p>
            <h1 className="text-5xl md:text-8xl font-serif font-light mb-6 drop-shadow-lg">
              Culinary <span className="font-bold text-amber-500 italic">Masters</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl font-light max-w-2xl mx-auto drop-shadow-md">
              Meet the architects of flavor who transform raw, earthly ingredients into fleeting moments of perfection.
            </p>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-2 text-zinc-400 drop-shadow-md"
          >
            <span className="text-[10px] uppercase tracking-widest">Discover</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-amber-500 to-transparent animate-pulse" />
          </motion.div>
        </section>

        {/* SECTION 2: THE EXECUTIVE CHEF */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInLeft}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-amber-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80" 
                alt="Executive Chef" 
                className="relative w-full h-[650px] object-cover rounded-[2rem] border border-white/10 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 shadow-2xl"
              />
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideInRight} 
              className="space-y-6 p-8 md:p-10 rounded-[2rem] bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-md">Alexander <span className="text-amber-500 italic">Wright</span></h2>
                <h3 className="text-xs tracking-[0.3em] text-zinc-300 uppercase mt-4 drop-shadow-md">Executive Chef & Founder</h3>
                <div className="w-16 h-[1px] bg-amber-500 mt-6 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              </div>
              
              <div className="text-zinc-200 font-light leading-relaxed space-y-6 pt-4">
                <p className="text-xl text-white font-serif italic border-l-2 border-amber-500 pl-6 py-2 bg-gradient-to-r from-amber-500/10 to-transparent drop-shadow-md">
                  "Cooking is the ultimate act of vulnerability. You are putting your heritage and your heart onto a plate."
                </p>
                <p className="drop-shadow-md">
                  Trained in the Michelin-starred kitchens of Paris and Tokyo, Chef Alexander brings a rigorous discipline to Luxe Dining. He is obsessive about technique, yet deeply respectful of natural, unadulterated flavors. 
                </p>
                <p className="drop-shadow-md">
                  Arriving at the kitchen at 5:00 AM daily to inspect the morning's harvest, his philosophy is simple: perfection is a moving target, but the relentless pursuit of it is what elevates food into art.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: THE CULINARY BRIGADE */}
        {/* Changed background from opaque #050505 to heavily transparent black/30 so the video is visible while scrolling */}
        <section className="py-24 bg-black/30 border-y border-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-serif text-white drop-shadow-md">The Brigade</h2>
              <p className="text-zinc-300 mt-4 tracking-widest uppercase text-sm drop-shadow-md">Masters of their respective crafts</p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Chef 1 */}
              <motion.div variants={fadeInUp} className="group p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.06] transition-all duration-500 shadow-lg">
                <div className="h-64 rounded-2xl overflow-hidden mb-6 border border-white/5">
                  <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80" alt="Chef de Cuisine" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-1 drop-shadow-md">Isabella Rossi</h3>
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-4 drop-shadow-md">Chef de Cuisine</p>
                <p className="text-zinc-300 text-sm font-light leading-relaxed drop-shadow-md">The conductor of the kitchen during service. Isabella ensures that every dish leaving the pass meets Chef Alexander's exacting standards.</p>
              </motion.div>

              {/* Chef 2 */}
              <motion.div variants={fadeInUp} className="group p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.06] transition-all duration-500 shadow-lg">
                <div className="h-64 rounded-2xl overflow-hidden mb-6 border border-white/5">
                  <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80" alt="Executive Pastry Chef" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-1 drop-shadow-md">Elena Dubois</h3>
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-4 drop-shadow-md">Executive Pastry Chef</p>
                <p className="text-zinc-300 text-sm font-light leading-relaxed drop-shadow-md">An architect of sugar and chocolate. Elena balances the savory menu with desserts that are as structurally stunning as they are delicious.</p>
              </motion.div>

              {/* Chef 3 */}
              <motion.div variants={fadeInUp} className="group p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.06] transition-all duration-500 shadow-lg">
                <div className="h-64 rounded-2xl overflow-hidden mb-6 border border-white/5">
                  <img src="https://images.unsplash.com/photo-1559564022-edba56c3d526?auto=format&fit=crop&w=600&q=80" alt="Head Sommelier" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-1 drop-shadow-md">Julian Thorne</h3>
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-4 drop-shadow-md">Head Sommelier</p>
                <p className="text-zinc-300 text-sm font-light leading-relaxed drop-shadow-md">Curator of our 2,000-bottle cellar. Julian travels globally to discover rare vintages that perfectly elevate the tasting menu experience.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 4: BEHIND THE LINE GALLERY */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white drop-shadow-md">Behind The Line</h2>
            <p className="text-zinc-300 mt-4 tracking-widest uppercase text-sm drop-shadow-md">The choreography of service</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.div variants={fadeInUp} className="h-[300px] md:h-[500px] rounded-3xl overflow-hidden relative group border border-white/10 shadow-xl">
              <img src="https://images.unsplash.com/photo-1576867757603-05b1afabc73e?auto=format&fit=crop&w=1000&q=80" alt="Sauté station" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
            </motion.div>
            
            <div className="grid grid-rows-2 gap-4 h-[500px]">
              <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden relative group h-full border border-white/10 shadow-xl">
                <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80" alt="Plating details" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
              <motion.div variants={fadeInUp} className="rounded-3xl overflow-hidden relative group h-full border border-white/10 shadow-xl">
                <img src="https://images.unsplash.com/photo-1544025162-8766810a911a?auto=format&fit=crop&w=800&q=80" alt="Finishing touches" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
            </div>
          </motion.div>
        </section>

      </main>
    </>
  );
}