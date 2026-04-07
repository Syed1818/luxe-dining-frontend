"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
const API_BASE_URL = "https://localhost:7170"; // Change to your port!

export default function CustomerMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest", email: "" });

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
        toast.success(`${sessionData.name}, your order is ready!`, { icon: '🛎️', duration: 8000 });
      }
    });

    connection.start();
    return () => connection.stop();
  }, [sessionData]);

  const addToCart = (item) => setCart([...cart, { ...item, quantity: 1 }]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const submitOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const orderPayload = {
      tableID: parseInt(sessionData.table),
      customerName: sessionData.name,
      customerEmail: sessionData.email, // Passing the email to the backend!
      orderItems: cart.map(item => ({ itemID: item.itemID, quantity: item.quantity }))
    };

    const res = await fetch(`${API_BASE_URL}/api/Orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (res.ok) {
      alert("Order placed! Your receipt has been emailed to you.");
      setCart([]); 
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 font-sans selection:bg-amber-500/30 pb-32 md:pb-8">
      
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-12 text-center px-4"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-amber-500 tracking-wide mb-2">Luxe Dining</h1>
        <p className="text-zinc-400 font-light tracking-widest uppercase text-sm">
          Welcome, {sessionData.name} &nbsp;•&nbsp; Table {sessionData.table}
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* MENU GRID */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif border-b border-zinc-800 pb-2 text-zinc-300">Menu Selections</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <motion.div 
                key={item.itemID}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }} // Staggered fade in
                className="bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 hover:border-amber-500/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-zinc-100">{item.name}</h3>
                  <span className="text-amber-500 font-semibold">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-4 min-h-[40px]">{item.description}</p>
                
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="w-full py-2 rounded-lg bg-zinc-700/50 text-zinc-300 hover:bg-amber-600 hover:text-white transition-all text-sm uppercase tracking-wider font-semibold"
                >
                  Add to Order
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* STICKY CART DESKTOP / FLOATING MOBILE */}
        <div className="md:col-span-1 relative">
          <div className="sticky top-8 bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-2xl">
            <h2 className="text-xl font-serif mb-6 text-zinc-200">Your Check</h2>
            
            <div className="min-h-[150px] max-h-[40vh] overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
              <AnimatePresence>
                {cart.length === 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 text-center italic mt-10">
                    Awaiting selections...
                  </motion.p>
                )}
                {cart.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg"
                  >
                    <div>
                      <p className="text-zinc-200 text-sm">{item.name}</p>
                      <p className="text-amber-500/80 text-xs">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-zinc-500 hover:text-red-400 text-xl leading-none">&times;</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="border-t border-zinc-700 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="text-zinc-400">Subtotal</span>
                <span className="font-serif text-white">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitOrder}
              disabled={cart.length === 0}
              className="w-full bg-amber-600 disabled:bg-zinc-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-amber-900/20 transition-all"
            >
              Send to Kitchen
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}