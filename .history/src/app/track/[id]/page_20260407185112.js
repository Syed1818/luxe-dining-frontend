"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://localhost:7170";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // 0: Placed, 1: Preparing, 2: Ready
  const [orderStatus, setOrderStatus] = useState(0); 
  const [etaMinutes, setEtaMinutes] = useState(24); // Simulated initial ETA
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest" });

  useEffect(() => {
    const savedData = localStorage.getItem('sessionData');
    if (savedData) setSessionData(JSON.parse(savedData));

    // Simulated countdown timer for UX
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000); // Ticks every 1 minute

    return () => clearInterval(timer);
  }, []);

  // Real-time SignalR Connection to listen for kitchen updates
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/orderHub`)
      .withAutomaticReconnect()
      .build();

    // Listen for when the Chef marks it as Preparing (if your backend supports this)
    connection.on("OrderPreparing", (data) => {
      if (data.orderID.toString() === id.toString()) setOrderStatus(1);
    });

    // Listen for when the Chef marks it as Ready
    connection.on("OrderReady", (data) => {
      if (data.orderID?.toString() === id.toString() || data.tableID?.toString() === sessionData.table.toString()) {
        setOrderStatus(2);
        setEtaMinutes(0);
      }
    });

    connection.start().catch(err => console.error("SignalR Connection Error: ", err));
    return () => connection.stop();
  }, [id, sessionData]);

  // Visual Stepper Configuration
  const steps = [
    { title: "Order Received", desc: "Sent to the kitchen", icon: "📝" },
    { title: "In Progress", desc: "Chef is preparing your meal", icon: "🔥" },
    { title: "Ready", desc: "Heading to your table", icon: "✨" }
  ];

  return (
    <>
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60 grayscale">
          <source src="/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]/95 backdrop-blur-[4px]" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-zinc-100 font-sans">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4">Table {sessionData.table} • Order #{id}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-md">
              {orderStatus === 2 ? "Your Order is Ready" : "Preparing Your Meal"}
            </h1>
          </div>

          {/* Dynamic ETA Circle */}
          <div className="flex justify-center mb-12">
            <motion.div 
              layout
              className={`relative flex flex-col items-center justify-center w-48 h-48 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
                orderStatus === 2 ? "border-green-500 text-green-400 shadow-green-500/20 bg-green-500/10" 
                : "border-amber-500 text-amber-500 shadow-amber-500/20 bg-amber-500/10"
              }`}
            >
              {orderStatus === 2 ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl">✨</motion.span>
              ) : (
                <>
                  <span className="text-6xl font-light tracking-tighter text-white">{etaMinutes}</span>
                  <span className="text-xs tracking-widest uppercase mt-1">Minutes</span>
                </>
              )}
            </motion.div>
          </div>

          {/* Vertical Progress Stepper */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-white/10 before:to-transparent">
            {steps.map((step, index) => {
              const isActive = index <= orderStatus;
              const isCurrent = index === orderStatus;
              
              return (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a0a0a] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 transition-colors duration-500 ${
                    isActive ? "bg-amber-500" : "bg-zinc-800 border-zinc-900"
                  }`}>
                    <span className={isActive ? "opacity-100" : "opacity-30 grayscale"}>{step.icon}</span>
                  </div>
                  
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-2xl border transition-all duration-500 ${
                    isCurrent ? "bg-white/10 border-amber-500/50" : "bg-white/[0.02] border-white/5"
                  }`}>
                    <h3 className={`text-lg font-serif ${isActive ? "text-white" : "text-zinc-500"}`}>{step.title}</h3>
                    <p className={`text-xs mt-1 ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="mt-12 text-center">
            <button onClick={() => router.push('/menu')} className="text-sm tracking-widest uppercase text-zinc-500 hover:text-amber-500 transition-colors">
              ← Return to Menu
            </button>
          </div>

        </motion.div>
      </main>
    </>
  );
}