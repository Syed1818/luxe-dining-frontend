"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const API_BASE_URL = "https://localhost:7170"; // Change to your exact port!

// A beautiful fallback image if the database doesn't have one yet
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";

export default function LandingAndMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest", email: "" });
  
  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("none"); // 'none', 'asc', 'desc'

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

  // Derived State for Categories and Filtering
  const categories = ["All", ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  const filteredAndSortedItems = useMemo(() => {
    let items = [...menuItems];
    
    if (selectedCategory !== "All") {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);
    
    return items;
  }, [menuItems, selectedCategory, sortOrder]);

  const addToCart = (item) => setCart([...cart, { ...item, quantity: 1 }]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const submitOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty!");

    const orderPayload = {
      tableID: parseInt(sessionData.table),
      customerName: sessionData.name,
      customerEmail: sessionData.email,
      orderItems: cart.map(item => ({ itemID: item.itemID, quantity: item.quantity }))
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/Orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        toast.success("Order placed! Your receipt has been emailed.", { duration: 5000 });
        setCart([]); 
      } else {
        toast.error("Error placing order.");
      }
    } catch (err) {
      toast.error("Network error.");
    }
  };

  const scrollToMenu = () => {
    document.getElementById("menu-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500/30">
      
      {/* 1. THE LANDING HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Restaurant" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <p className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-sm mb-4">
            Welcome to
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl">
            Luxe Dining
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl font-light mb-10 max-w-lg mx-auto">
            A culinary journey crafted for <span className="text-white font-semibold">{sessionData.name}</span> at Table {sessionData.table}.
          </p>
          
          <button 
            onClick={scrollToMenu}
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(217,119,6,0.5)]"
          >
            Explore The Menu
          </button>
        </motion.div>
      </section>

      {/* 2. THE MENU SECTION */}
      <section id="menu-section" className="max-w-[1400px] mx-auto px-4 py-20 min-h-screen">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR: Categories & Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-xl font-serif text-amber-500 mb-6 border-b border-zinc-800 pb-2">Categories</h3>
              <ul className="space-y-2 mb-8">
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat 
                          ? "bg-amber-600/20 text-amber-500 font-bold border border-amber-600/30" 
                          : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-serif text-amber-500 mb-6 border-b border-zinc-800 pb-2">Sort By</h3>
              <select 
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 p-3 rounded-lg focus:outline-none focus:border-amber-500"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="none">Recommended</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* MAIN GRID: Image Cards */}
          <div className="flex-grow">
            <div className="mb-6 flex justify-between items-end">
              <h2 className="text-3xl font-serif text-white">{selectedCategory} Selections</h2>
              <p className="text-zinc-500">{filteredAndSortedItems.length} Items</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredAndSortedItems.map((item, index) => (
                  <motion.div 
                    key={item.itemID}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col"
                  >
                    {/* Item Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={item.imageUrl || FALLBACK_IMAGE} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-700">
                        <span className="text-amber-500 font-bold">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-zinc-100 mb-2">{item.name}</h3>
                      <p className="text-zinc-400 text-sm mb-6 flex-grow">{item.description}</p>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-zinc-800 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors uppercase tracking-widest text-sm"
                      >
                        Add to Order
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredAndSortedItems.length === 0 && (
                <div className="col-span-full text-center py-20 text-zinc-500">
                  <p className="text-xl font-serif">No items found in this category.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: The Cart */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-8 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-serif mb-6 text-white border-b border-zinc-800 pb-2">Your Check</h2>
              
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
                      className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-800/50"
                    >
                      <div>
                        <p className="text-zinc-200 font-medium text-sm">{item.name}</p>
                        <p className="text-amber-500 text-xs font-bold">${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-zinc-500 hover:text-red-400 text-xl leading-none">&times;</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="border-t border-zinc-800 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-zinc-400">Total</span>
                  <span className="font-serif text-amber-500 font-bold text-2xl">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitOrder}
                disabled={cart.length === 0}
                className="w-full bg-amber-600 disabled:bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-amber-900/20 transition-all"
              >
                Send to Kitchen
              </motion.button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}