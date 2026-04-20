"use client";

import { motion } from 'framer-motion';

// Animation settings for elements fading in as you scroll
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function HistoryPage() {
  return (
    <main className="relative bg-[#050505] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2000&q=80" 
            alt="Luxe Interior" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505]"></div>
        </div>
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="relative z-10 text-center px-4 mt-20"
        >
          <p className="text-amber-500 font-medium tracking-[0.4em] uppercase text-xs md:text-sm mb-6">Experience the Extraordinary</p>
          <h1 className="text-5xl md:text-8xl font-serif font-light text-white mb-6 tracking-tight">
            A Legacy of <span className="font-bold text-amber-500 italic">Flavor</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light max-w-xl mx-auto">
            Step into a world where culinary tradition meets avant-garde artistry. 
          </p>
        </motion.div>
      </section>

      {/* 2. THE ORIGIN (Where, When, How) */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-amber-900/20 blur-2xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=80" 
              alt="Plating food" 
              className="relative w-full h-[600px] object-cover rounded-[2rem] border border-white/10 shadow-2xl"
            />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">The Inception</h2>
              <div className="w-20 h-1 bg-amber-500 mb-8"></div>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              Founded in the winter of 2024, Luxe Dining began as a quiet ambition in a small cobblestone alleyway. The vision was simple yet radical: to strip away the pretension of fine dining while elevating the ingredients to their absolute peak.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              By forging direct relationships with deep-sea fishers and organic foragers, we bypassed traditional supply chains. This allowed us to craft a menu dictated entirely by the seasons, the earth, and the ocean.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-serif text-amber-500 mb-1">2024</p>
                <p className="text-xs text-zinc-500 tracking-widest uppercase">Established</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-amber-500 mb-1">NYC</p>
                <p className="text-xs text-zinc-500 tracking-widest uppercase">Location</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. THE TIMELINE */}
      <section className="py-24 bg-[#0a0a0a] relative border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-white">Our Journey</h2>
            <p className="text-zinc-500 mt-4 tracking-widest uppercase text-sm">Milestones of Excellence</p>
          </motion.div>

          <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-amber-500/50 before:to-transparent">
            
            {/* Timeline Item 1 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-amber-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10"></div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-amber-500/30 transition-colors">
                <time className="text-amber-500 font-bold tracking-widest text-sm uppercase">Early 2024</time>
                <h3 className="text-xl font-serif text-white mt-2 mb-3">The Blueprint</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Our founders acquire a historic building, spending six months restoring its original brickwork while designing a state-of-the-art open kitchen.</p>
              </div>
            </motion.div>

            {/* Timeline Item 2 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-amber-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10"></div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-amber-500/30 transition-colors">
                <time className="text-amber-500 font-bold tracking-widest text-sm uppercase">Late 2025</time>
                <h3 className="text-xl font-serif text-white mt-2 mb-3">Culinary Recognition</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">Luxe Dining receives its first major culinary award, praised for its innovative approach to traditional European techniques.</p>
              </div>
            </motion.div>

            {/* Timeline Item 3 */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0a0a0a] bg-amber-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10"></div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-amber-500/30 transition-colors">
                <time className="text-amber-500 font-bold tracking-widest text-sm uppercase">Present Day</time>
                <h3 className="text-xl font-serif text-white mt-2 mb-3">Digital Evolution</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">We launch our bespoke digital QR menu system, allowing guests to seamlessly interact with the kitchen while maintaining the luxury tableside experience.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. VISUAL GALLERY (Bento Grid) */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white">The Atmosphere</h2>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={fadeInUp} className="md:col-span-2 h-[400px] rounded-3xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80" alt="Dining Room" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="h-[400px] rounded-3xl overflow-hidden relative group">
            <img src="https://unsplash.com/photos/cropped-photo-of-a-male-sommelier-in-a-brown-apron-standing-in-the-cellar-and-pouring-wine-into-a-glass-2rnNYFnu47A" alt="Wine Pour" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </motion.div>

          <motion.div variants={fadeInUp} className="h-[400px] rounded-3xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" alt="Fine Details" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-2 h-[400px] rounded-3xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80" alt="Signature Dish" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}
