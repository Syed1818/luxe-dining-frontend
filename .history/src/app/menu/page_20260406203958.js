"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://localhost:7170"; 
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";

// Scroll Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function EditorialMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest", email: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Load Data
  useEffect(() => {
    const savedData = localStorage.getItem('sessionData');
    if (savedData) setSessionData(JSON.parse(savedData));

    fetch(`${API_BASE_URL}/api/Menu`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error(err));
  }, []);

  // 2. Real-time Connection
  useEffect(() => {
    if (sessionData.table === "Unknown") return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/orderHub`)
      .withAutomaticReconnect().build();

    connection.on("OrderReady", (data) => {
      if (data.tableID.toString() === sessionData.table.toString()) {
        toast.success(`Your order is ready, ${sessionData.name}!`, { icon: '✨', duration: 8000 });
      }
    });

    connection.start();
    return () => connection.stop();
  }, [sessionData]);

  // 3. Derived State
  const categories = ["All", ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  // 4. Cart Logic
  const addToCart = (item) => setCart([...cart, { ...item, cartId: Math.random() }]);
  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // 5. Submit Order
  const submitOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty!");

    const orderPayload = {
      tableID: parseInt(sessionData.table),
      customerName: sessionData.name,
      customerEmail: sessionData.email,
      orderItems: cart.map(item => ({ itemID: item.itemID, quantity: 1 }))
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        toast.success("Order sent to the kitchen! Your receipt has been emailed.", { duration: 5000 });
        setCart([]); 
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      toast.error("Network error. Could not reach the kitchen.");
    }
  };

  return (
    <main className="relative bg-[#050505] min-h-screen overflow-hidden pb-32">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center mt-20 md:mt-0">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544025162-8766810a911a?auto=format&fit=crop&w=2000&q=80" 
            alt="Chef plating" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]"></div>
        </div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10 text-center px-4 mt-16">
          <p className="text-amber-500 font-medium tracking-[0.4em] uppercase text-xs md:text-sm mb-4">The Collection</p>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6">
            Culinary <span className="font-bold text-amber-500 italic">Canvas</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light max-w-md mx-auto">
            Curated exclusively for <span className="text-white font-medium">{sessionData.name}</span> at Table {sessionData.table}.
          </p>
        </motion.div>
      </section>

      {/* 2. THE PHILOSOPHY */}
      <section className="py-16 md:py-24 px-6 max-w-4xl mx-auto text-center border-b border-white/5">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed font-serif italic">
          "Every dish on this menu is a dialogue between the earth's raw beauty and our kitchen's meticulous discipline. Please, take your time."
        </motion.p>
      </section>

      {/* 3. THE INTERACTIVE MENU & CART */}
      <section className="max-w-[1600px] mx-auto px-6 py-16 flex flex-col xl:flex-row gap-12 relative">
        
        {/* LEFT/CENTER: The Menu Grid */}
        <div className="flex-grow">
          
          {/* Horizontal Category Pills */}
          <div className="sticky top-24 z-30 bg-[#050505]/90 backdrop-blur-xl py-4 mb-8 border-b border-white/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((cat) => (
                <button 
                  key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`relative px-8 py-3 rounded-full text-sm font-medium tracking-widest uppercase transition-all whitespace-nowrap ${
                    selectedCategory === cat ? "text-black" : "text-zinc-500 hover:text-white border border-white/10"
                  }`}
                >
                  {selectedCategory === cat && (
                    <motion.div layoutId="activeCategory" className="absolute inset-0 bg-amber-500 rounded-full" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Editorial Image Cards */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div 
                  layout key={item.itemID}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}
                  className="group relative rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col hover:border-amber-500/30 transition-colors"
                >
                  {/* Large Cinematic Image */}
                  <div className="relative h-[300px] overflow-hidden">
                    <img src={item.imageUrl || FALLBACK_IMAGE} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="p-8 flex flex-col flex-grow relative -mt-16 z-10">
                    <div className="flex justify-between items-end mb-4">
                      <h3 className="text-2xl font-serif text-white">{item.name}</h3>
                      <span className="text-xl font-light text-amber-500">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">{item.description}</p>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-4 rounded-xl border border-white/10 hover:border-amber-500 text-zinc-300 hover:text-amber-500 hover:bg-amber-500/10 transition-all text-sm uppercase tracking-widest font-bold flex justify-center items-center gap-2"
                    >
                      <span>Add to Selection</span>
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-32 text-zinc-600 font-serif text-xl italic">
                No items currently available in this collection.
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT: Floating Glass Check */}
        <div className="w-full xl:w-[450px] flex-shrink-0">
          <div className="sticky top-32 p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl">
            
            <h2 className="text-2xl font-serif mb-8 flex items-center justify-between text-white border-b border-white/10 pb-4">
              <span>Your Check</span>
              <span className="text-sm font-sans tracking-widest uppercase text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">{cart.length} Items</span>
            </h2>
            
            <div className="min-h-[250px] max-h-[50vh] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[200px] text-zinc-600 text-sm">
                    <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 flex items-center justify-center mb-4 italic font-serif">Empty</div>
                    Awaiting your selections
                  </motion.div>
                )}
                {cart.map((item) => (
                  <motion.div 
                    layout key={item.cartId}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
                    className="group flex justify-between items-center p-3 rounded-2xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={item.imageUrl || FALLBACK_IMAGE} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" />
                      </div>
                      <div>
                        <p className="text-zinc-200 text-sm font-medium">{item.name}</p>
                        <p className="text-amber-500 text-xs">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Total</p>
                  <p className="text-zinc-400 text-xs">Taxes calculated at checkout</p>
                </div>
                <span className="text-4xl font-light text-white">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submitOrder} disabled={cart.length === 0}
              className="w-full py-5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold uppercase tracking-widest shadow-[0_0_30px_-10px_rgba(217,119,6,0.5)] transition-all flex justify-center items-center gap-3"
            >
              Confirm to Kitchen
            </motion.button>
          </div>
        </div>

      </section>
    </main>
  );
}