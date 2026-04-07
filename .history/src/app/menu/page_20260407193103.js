"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// DYNAMIC URL: Uses your live API if on Vercel, or Localhost if on your PC
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7170"; 
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";

const fluidSpring = { type: "spring", bounce: 0.15, duration: 0.7 };
const smoothEase = [0.22, 1, 0.36, 1];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, ease: smoothEase } } };
const cardVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.2, duration: 0.8 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: smoothEase } } };

export default function CatalogMenu() {
  const router = useRouter();
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

    try {
      const res = await fetch(`${API_BASE_URL}/api/Orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const createdOrder = await res.json();
        const newOrderId = createdOrder.orderID || createdOrder.id; 
        
        localStorage.setItem('lastOrderReceipt', JSON.stringify({
          items: cart, total: cartTotal, date: new Date().toLocaleString()
        }));

        toast.success("Order sent to kitchen!");
        setCart([]); 
        router.push(`/track/${newOrderId}`);
      }
    } catch (err) {
      toast.error("Network error.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60 grayscale">
          <source src="/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/50 to-[#050505]/90 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 min-h-screen bg-transparent text-zinc-100 font-sans pt-32 pb-20">
        <div className="max-w-[1600px] mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smoothEase }}>
            <h1 className="text-4xl font-serif mb-2 tracking-tight drop-shadow-lg">The <span className="text-amber-500 italic font-bold">Catalog</span></h1>
            <p className="text-zinc-300 uppercase tracking-[0.3em] text-xs drop-shadow-md">Table {sessionData.table} • {sessionData.name}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }} className="mt-10 flex gap-3 overflow-x-auto pb-4 scrollbar-hide border-b border-white/10">
            {categories.map((cat) => (
              <button 
                key={cat} onClick={() => setSelectedCategory(cat)}
                className={`relative px-6 py-2 rounded-full text-xs tracking-widest uppercase transition-all whitespace-nowrap overflow-hidden ${
                  selectedCategory === cat ? "text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-black/20 border border-white/10 text-zinc-300 hover:bg-black/40 hover:text-white backdrop-blur-md"
                }`}
              >
                {selectedCategory === cat && <motion.div layoutId="activeCategoryBg" className="absolute inset-0 bg-amber-500 rounded-full z-0" transition={fluidSpring} />}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </motion.div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <motion.div layout variants={containerVariants} initial="hidden" animate="show" key={selectedCategory} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div layout variants={cardVariants} key={item.itemID} transition={fluidSpring} className="group flex bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-white/30 transition-colors duration-500 h-40 shadow-lg">
                    <div className="w-1/3 h-full overflow-hidden shrink-0 border-r border-white/10 relative">
                      <img src={item.imageUrl || FALLBACK_IMAGE} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                    </div>
                    <div className="flex-grow p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-serif text-white group-hover:text-amber-500 transition-colors duration-300 drop-shadow-md">{item.name}</h3>
                          <span className="text-amber-500 font-medium text-sm tracking-tighter drop-shadow-md">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-zinc-300 text-xs mt-1 line-clamp-2 leading-relaxed max-w-[280px] drop-shadow-md">{item.description}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToCart(item)} className="mt-auto self-start text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white flex items-center gap-2 transition-colors duration-300">
                        <span>Add to Check</span><span className="text-amber-500 text-base">+</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="w-full lg:w-[400px] flex-shrink-0">
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3, ease: smoothEase }} className="sticky top-32 p-8 rounded-[2rem] bg-black/30 backdrop-blur-2xl border border-white/10 shadow-2xl">
              <h2 className="text-xl font-serif mb-6 text-white flex justify-between items-center drop-shadow-md">
                <span>Your Check</span><span className="text-[10px] tracking-[0.2em] text-zinc-300 uppercase">{cart.length} Items</span>
              </h2>
              <div className="min-h-[100px] max-h-[40vh] overflow-y-auto pr-2 space-y-3 mb-6 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {cart.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-zinc-400 text-center py-10 italic text-sm drop-shadow-md">Select items from the catalog...</motion.p>}
                  {cart.map((item) => (
                    <motion.div layout key={item.cartId} initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, x: -20 }} transition={fluidSpring} className="flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/10">
                      <div className="text-sm drop-shadow-md">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-amber-500 text-xs">${item.price.toFixed(2)}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => removeFromCart(item.cartId)} className="text-zinc-400 hover:text-red-400 transition-colors w-8 h-8 flex items-center justify-center rounded-full">✕</motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="border-t border-white/20 pt-6 mb-8">
                <div className="flex justify-between items-end drop-shadow-md">
                  <span className="text-zinc-300 text-xs tracking-widest uppercase">Total Bill</span>
                  <span className="text-3xl font-light text-white">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02, backgroundColor: "#d97706" }} whileTap={{ scale: 0.97 }} onClick={submitOrder} disabled={cart.length === 0} className="w-full py-4 rounded-xl bg-amber-500 disabled:bg-zinc-800/50 disabled:text-zinc-500 text-black font-bold uppercase tracking-widest transition-all shadow-lg">
                Place Order
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}