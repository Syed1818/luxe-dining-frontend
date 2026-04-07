"use client";

import { motion } from 'framer-motion';

// The signature "Luxe" easing curve for buttery smooth, native-feeling animations
const smoothEase = [0.22, 1, 0.36, 1];

// Reusable animation variants for clean code
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: smoothEase } }
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
      {/* 1. Cinematic Background Video */}
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 grayscale"
        >
          {/* You can use the same video as the menu, or drop a new one named 'chef-video.mp4' into the public folder */}
          <source src="/video1.mp4" type="video/mp4" />
          <img src="/fallback-hero.jpg" alt="Background Fallback" />
        </video>
        {/* Deep gradient overlay to ensure text pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505]/95 backdrop-blur-[2px]" />
      </div>

      {/* 2. Main Content - Transparent background to reveal the video */}
      <main className="relative z-10 min-h-screen bg-transparent pt-40 pb-32 text-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp} 
            className="text-center mb-24"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 drop-shadow-lg">
              The <span className="font-bold text-amber-500 italic">Masters</span>
            </h1>
            <p className="text-zinc-400 tracking-[0.3em] uppercase text-sm drop-shadow-md">
              Meet the visionaries behind the menu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Chef Image with smooth blur-in and un-grayscale on hover */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={slideInLeft}
              className="relative group"
            >
              {/* Subtle background glow behind the image */}
              <div className="absolute -inset-4 bg-amber-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80" 
                alt="Head Chef" 
                className="relative w-full h-[600px] object-cover rounded-[2rem] border border-white/10 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 shadow-2xl"
              />
            </motion.div>

            {/* Chef Bio wrapped in a premium Glassmorphism card */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={slideInRight} 
              className="space-y-6 p-8 md:p-10 rounded-[2rem] bg-white/[0.02] backdrop-blur-md border border-white/5 shadow-2xl"
            >
              <div>
                <h2 className="text-3xl font-serif text-amber-500 drop-shadow-md">Chef Alexander Wright</h2>
                <h3 className="text-sm tracking-[0.2em] text-zinc-400 uppercase mt-2">Executive Chef & Founder</h3>
              </div>
              
              <div className="text-zinc-300 font-light leading-relaxed space-y-5 pt-4">
                <p className="text-xl text-white font-serif italic border-l-2 border-amber-500 pl-6 py-2 bg-gradient-to-r from-amber-500/10 to-transparent">
                  "Cooking is the ultimate act of vulnerability. You are putting your heritage, your training, and your heart onto a plate and offering it to someone else."
                </p>
                <p className="drop-shadow-md">
                  Trained in the Michelin-starred kitchens of Paris and Tokyo, Chef Alexander brings a rigorous discipline to Luxe Dining. He is obsessive about technique, yet deeply respectful of natural flavors. 
                </p>
                <p className="drop-shadow-md">
                  He arrives at the kitchen at 5:00 AM every day to inspect the morning's harvest. If a truffle isn't aromatic enough, or a micro-green lacks the perfect snap, it doesn't make it to your table. His philosophy is simple: perfection is a moving target, but the pursuit of it is what makes food art.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </>
  );
}