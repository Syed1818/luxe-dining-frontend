"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://localhost:7170"; 
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";

const springConfig = { type: "spring", stiffness: 400, damping: 30 };

export default function CatalogMenu() {
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
      toast.success("Order sent! Check your email for the receipt.");
      setCart([]); 
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-zinc-100 font-sans selection:bg-amber-500/30 pt-32 pb-20">
      
      {/* 1. Header & Navigation */}
      <div className="max-w-[1600px] mx-auto px-6 mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-serif mb-2 tracking-tight">The <span className="text-amber-500 italic font-bold">Catalog</span></h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">Table {sessionData.table} • {sessionData.name}</p>
        </motion.div>

        {/* Scrollable Category Bar */}
        <div className="mt-10 flex gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-white/5">
          {categories.map((cat) => (
            <button 
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs tracking-widest uppercase transition-all whitespace-nowrap border ${
                selectedCategory === cat 
                ? "bg-amber-500 border-amber-500 text-black font-bold" 
                : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        {/* 2. Main Catalog Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div 
                  layout key={item.itemID}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:bg-[#161616] transition-colors h-40"
                >
                  {/* Slim Side Image */}
                  <div className="w-1/3 h-full overflow-hidden shrink-0 border-r border-white/5">
                    <img 
                      src={item.imageUrl || FALLBACK_IMAGE} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={item.name} 
                    />
                  </div>

                  {/* Content Area */}
                  <div className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-serif text-white group-hover:text-amber-500 transition-colors">{item.name}</h3>
                        <span className="text-amber-500 font-medium text-sm tracking-tighter">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed max-w-[280px]">
                        {item.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => addToCart(item)}
                      className="mt-auto self-start text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <span>Add to Check</span>
                      <span className="text-amber-500 text-base">+</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Floating Sidebar Check */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-32 p-8 rounded-[2rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-serif mb-6 text-white flex justify-between items-center">
              <span>Your Check</span>
              <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">{cart.length} Items</span>
            </h2>
            
            <div className="min-h-[100px] max-h-[40vh] overflow-y-auto pr-2 space-y-3 mb-6 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {cart.length === 0 && (
                  <p className="text-zinc-600 text-center py-10 italic text-sm">Select items from the catalog...</p>
                )}
                {cart.map((item) => (
                  <motion.div 
                    layout key={item.cartId}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5"
                  >
                    <div className="text-sm">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-amber-500 text-xs">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-zinc-500 hover:text-red-400">✕</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-zinc-500 text-xs tracking-widest uppercase">Total Bill</span>
                <span className="text-3xl font-light text-white">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={submitOrder} disabled={cart.length === 0}
              className="w-full py-4 rounded-xl bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold uppercase tracking-widest transition-all"
            >
              Place Order
            </motion.button>
          </div>
        </div>

      </div>
    </main>
  );
}