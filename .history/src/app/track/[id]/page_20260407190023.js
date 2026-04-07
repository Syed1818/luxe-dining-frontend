"use client";

import * as signalR from '@microsoft/signalr';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://localhost:7170";

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [orderStatus, setOrderStatus] = useState(0); 
  const [etaMinutes, setEtaMinutes] = useState(24);
  const [sessionData, setSessionData] = useState({ table: "Unknown", name: "Guest" });
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('sessionData');
    if (savedSession) setSessionData(JSON.parse(savedSession));

    const savedReceipt = localStorage.getItem('lastOrderReceipt');
    if (savedReceipt) setReceiptData(JSON.parse(savedReceipt));

    const savedStatus = localStorage.getItem(`orderStatus_${id}`);
    if (savedStatus) setOrderStatus(parseInt(savedStatus));

    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);

    return () => clearInterval(timer);
  }, [id]);

  useEffect(() => {
    // FIX: Gatekeeper to prevent SignalR negotiation failure
    if (sessionData.table === "Unknown") return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/orderHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("OrderPreparing", (data) => {
      if (data.orderID?.toString() === id.toString()) {
        setOrderStatus(1);
        localStorage.setItem(`orderStatus_${id}`, "1"); 
      }
    });

    connection.on("OrderReady", (data) => {
      if (data.orderID?.toString() === id.toString() || data.tableID?.toString() === sessionData.table.toString()) {
        setOrderStatus(2);
        setEtaMinutes(0);
        localStorage.setItem(`orderStatus_${id}`, "2"); 
      }
    });

    let isMounted = true;
    connection.start().catch(err => {
      if (isMounted) console.error("SignalR Connection Error: ", err);
    });

    return () => {
      isMounted = false;
      connection.stop();
    };
  }, [id, sessionData.table]); // Only depend on primitive values

  const handleDownloadReceipt = () => {
    window.print(); 
  };

  const steps = [
    { title: "Order Received", desc: "Sent to the kitchen", icon: "📝" },
    { title: "In Progress", desc: "Chef is preparing your meal", icon: "🔥" },
    { title: "Ready", desc: "Heading to your table", icon: "✨" }
  ];

  return (
    <>
      <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none print:hidden">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60 grayscale">
          <source src="/video1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]/95 backdrop-blur-[4px]" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-zinc-100 font-sans print:hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
          <div className="text-center mb-12">
            <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4">Table {sessionData.table} • Order #{id}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-white drop-shadow-md">
              {orderStatus === 2 ? "Your Order is Ready" : "Preparing Your Meal"}
            </h1>
          </div>

          <div className="flex justify-center mb-12">
            <div className={`relative flex flex-col items-center justify-center w-48 h-48 rounded-full border-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-colors duration-700 ${
                orderStatus === 2 ? "border-green-500 text-green-400 shadow-green-500/20 bg-green-500/10" : "border-amber-500 text-amber-500 shadow-amber-500/20 bg-amber-500/10"
              }`}
            >
              {orderStatus === 2 ? (
                <span className="text-6xl">✨</span>
              ) : (
                <>
                  <span className="text-6xl font-light tracking-tighter text-white">{etaMinutes}</span>
                  <span className="text-xs tracking-widest uppercase mt-1">Minutes</span>
                </>
              )}
            </div>
          </div>

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
                    isCurrent ? "bg-white/10 border-amber-500/50 shadow-lg" : "bg-white/[0.02] border-white/5"
                  }`}>
                    <h3 className={`text-lg font-serif ${isActive ? "text-white" : "text-zinc-500"}`}>{step.title}</h3>
                    <p className={`text-xs mt-1 ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            {receiptData && (
              <button onClick={handleDownloadReceipt} className="w-full md:w-auto px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Receipt
              </button>
            )}
            <button onClick={() => router.push('/menu')} className="text-xs tracking-widest uppercase text-zinc-500 hover:text-amber-500 transition-colors">
              ← Return to Menu
            </button>
          </div>
        </motion.div>
      </main>

      {/* HIDDEN RECEIPT (ONLY VISIBLE ON PDF EXPORT) */}
      {receiptData && (
        <div className="hidden print:block absolute inset-0 bg-white text-black p-10 z-50 font-sans">
          <div className="max-w-md mx-auto border-b-2 border-black pb-6 mb-6 text-center">
            <h1 className="text-3xl font-serif font-bold mb-2">Luxe Dining</h1>
            <p className="text-sm text-gray-600">123 Culinary Lane, Metropolis</p>
            <p className="text-sm text-gray-600">Order #{id} • Table {sessionData.table}</p>
            <p className="text-sm text-gray-600">{receiptData.date}</p>
          </div>
          
          <div className="max-w-md mx-auto space-y-4 mb-6">
            <p className="font-bold text-sm uppercase tracking-wider mb-2">Guest: {sessionData.name}</p>
            {receiptData.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>1x {item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto border-t-2 border-black pt-4 flex justify-between items-end">
            <span className="font-bold uppercase tracking-widest">Total</span>
            <span className="text-2xl font-bold">${receiptData.total.toFixed(2)}</span>
          </div>
          
          <div className="max-w-md mx-auto mt-12 text-center text-sm text-gray-500 italic font-serif">
            Thank you for dining with us.
          </div>
        </div>
      )}
    </>
  );
}