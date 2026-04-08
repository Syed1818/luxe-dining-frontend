"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

// 1. Internal component that uses the Search Params
function WelcomeCheckInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tableNumber, setTableNumber] = useState("Unknown");

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Extract the table number from the URL (e.g., ?table=5)
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);
  }, [searchParams]);

  const handleStartOrdering = (e) => {
    e.preventDefault();
    
    // Save the customer data and table number to the browser's local storage
    localStorage.setItem('sessionData', JSON.stringify({
      ...customer,
      table: tableNumber
    }));

    // Redirect to the main menu page
    router.push('/menu');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Styling to match your app theme */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/10"
      >
        <div className="text-center mb-8">
          <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4">Luxe Dining Room</p>
          <h1 className="text-4xl font-serif text-white mb-2">Welcome! 🍽️</h1>
          <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mt-2">
             <p className="text-amber-500 font-medium text-sm tracking-widest uppercase">Table {tableNumber}</p>
          </div>
          <p className="text-xs text-zinc-500 mt-6 tracking-wider uppercase">Please check in to view the menu</p>
        </div>

        <form onSubmit={handleStartOrdering} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Full Name *</label>
            <input 
              required 
              type="text" 
              className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.05] text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="John Doe"
              value={customer.name} 
              onChange={e => setCustomer({...customer, name: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Phone Number *</label>
            <input 
              required 
              type="tel" 
              className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.05] text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="(555) 000-0000"
              value={customer.phone} 
              onChange={e => setCustomer({...customer, phone: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-4 border border-white/5 rounded-xl bg-white/[0.05] text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all" 
              placeholder="john@example.com"
              value={customer.email} 
              onChange={e => setCustomer({...customer, email: e.target.value})} 
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-4 rounded-xl mt-6 tracking-widest uppercase text-xs transition-all shadow-lg shadow-amber-500/20"
          >
            Open Menu
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

// 2. Main Export wrapped in Suspense (This fixes the Vercel Error)
export default function WelcomePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      }
    >
      <WelcomeCheckInContent />
    </Suspense>
  );
}