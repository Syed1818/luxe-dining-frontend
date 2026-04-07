"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://localhost:7170"; 
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";

// Custom Spring Animation Configuration for that "Elastic/Native" feel
const springConfig = { type: "spring", stiffness: 300, damping: 24, mass: 0.8 };

export default function ModernMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest", email: "" });
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const savedData = localStorage.getItem('sessionData');
    if (savedData) setSessionData(JSON.parse(savedData));

    fetch(`${API_BASE_URL}/api/Menu`)
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (sessionData.table === "Unknown") return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/orderHub`)
      .withAutomaticReconnect().build();

    connection.on("OrderReady", (data) => {
      if (data.tableID.toString() === sessionData.table.toString()) {
        toast.success(`Your order is ready, ${sessionData.name}!`, { icon: '✨' });
      }
    });

    connection.start();
    return () => connection.stop();
  }, [sessionData]);

  const categories = ["All", ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const addToCart = (item) => setCart([...cart, { ...item, cartId: Math.random() }]);
  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const submitOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty!");

    const orderPayload = {
      tableID: parseInt(sessionData.table),
      customerName: sessionData.name,
      customerEmail: sessionData.email,
      orderItems: cart.map(item => ({ itemID: item.itemID, quantity: 1 }))
    };

    const res = await fetch(`${API_BASE_URL}/api/Orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (res.ok) {
      toast.success("Order sent to the kitchen!", { duration: 5000 });
      setCart([]); 
    }
  };

  return (
    // The Deep Space Background with Animated Ambient Glows (Mesh Gradient)
    <main className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-amber-500/30">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-amber-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-900/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-12 lg:py-20 flex flex-col xl:flex-row gap-10">
        
        {/* LEFT COLUMN: Hero & Categories */}
        <div className="w-full xl:w-[350px] flex-shrink-0 flex flex-col gap-8">
          
          {/* Glassmorphic Hero Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig}
            className="p-8 rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, ...springConfig }} className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-2xl">🍽️</span>
            </motion.div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Luxe<span className="font-bold text-amber-500">Menu</span></h1>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Welcome back, <span className="text-white font-medium">{sessionData.name}</span>. You are seated at Table {sessionData.table}.
            </p>
          </motion.div>

          {/* Dynamic Pill Categories */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...springConfig }}
            className="flex flex-row xl:flex-col gap-2 overflow-x-auto xl:overflow-visible pb-4 xl:pb-0 scrollbar-hide"
          >
            {categories.map((cat) => (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)}
                className={`relative px-6 py-4 rounded-2xl text-left text-sm font-medium transition-all whitespace-nowrap overflow-hidden ${
                  selectedCategory === cat ? "text-amber-400" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-2xl" transition={springConfig} />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* MIDDLE COLUMN: Bento Grid Menu */}
        <div className="flex-grow">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div 
                  layout
                  key={item.itemID}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={springConfig}
                  className="group relative p-2 rounded-[2rem] bg-white/[0.02] backdrop-blur-xl border border-white/5 hover:bg-white/[0.04] transition-colors flex flex-col"
                >
                  <div className="relative h-56 rounded-[1.5rem] overflow-hidden mb-4">
                    <img src={item.imageUrl || FALLBACK_IMAGE} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-white/10">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-white/90 mb-2">{item.name}</h3>
                    <p className="text-white/40 text-sm leading-relaxed flex-grow line-clamp-2 mb-4">{item.description}</p>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(item)}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black transition-colors text-sm font-semibold flex items-center justify-center gap-2 border border-white/10 hover:border-transparent"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Floating Glass Cart */}
        <div className="w-full xl:w-[400px] flex-shrink-0">
          <div className="sticky top-8 p-6 rounded-[2rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Current Check
            </h2>
            
            <div className="min-h-[200px] max-h-[50vh] overflow-y-auto pr-2 space-y-3 mb-6 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[200px] text-white/30 text-sm">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4">🛒</div>
                    No items selected
                  </motion.div>
                )}
                {cart.map((item) => (
                  <motion.div 
                    layout
                    key={item.cartId}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -20, scale: 0.9 }} transition={springConfig}
                    className="group flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.imageUrl || FALLBACK_IMAGE} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="text-white/90 text-sm font-medium">{item.name}</p>
                        <p className="text-amber-500/80 text-xs">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6">
              <div className="flex justify-between items-center text-sm mb-2 text-white/60">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4 text-white/60">
                <span>Taxes & Fees</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <span className="text-white/80 font-medium">Total</span>
                <span className="text-3xl font-light tracking-tight">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={submitOrder} disabled={cart.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-white/10 disabled:to-white/5 disabled:text-white/30 text-black font-bold shadow-lg shadow-amber-500/25 transition-all flex justify-center items-center gap-2"
            >
              Confirm Order
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </motion.button>
          </div>
        </div>

      </div>
    </main>
  );
}