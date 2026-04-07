"use client";

import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast'; 

// DYNAMIC URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7170"; 

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [menuDict, setMenuDict] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Menu`)
      .then(res => res.json())
      .then(data => {
        const dict = {};
        data.forEach(item => { dict[item.itemID] = item.name; });
        setMenuDict(dict);
      });

    fetch(`${API_BASE_URL}/api/Orders/active`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch active orders:", err));

    if (!connectionRef.current) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/orderHub`)
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;

      newConnection.on("ReceiveNewOrder", (newOrder) => {
        setOrders(prev => [...prev, newOrder]); 
        toast.success(`New order received for Table ${newOrder.tableID}!`, { icon: '🔔' });
      });

      newConnection.start()
        .then(() => setConnectionStatus("Connected"))
        .catch(() => setConnectionStatus("Disconnected"));
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoadingOrderId(orderId); 
    try {
      const res = await fetch(`${API_BASE_URL}/api/Orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });
      
      if (res.ok) {
        if (newStatus === 2) {
          setOrders(prevOrders => prevOrders.filter(o => o.orderID !== orderId));
          toast.success(`Order #${orderId} marked as ready.`);
        } else {
          setOrders(prevOrders => prevOrders.map(o => o.orderID === orderId ? { ...o, status: 1 } : o));
          toast(`Order #${orderId} is cooking!`, { icon: '🔥' });
        }
      } else {
        toast.error(`Failed to update order. Server returned: ${res.status}`);
      }
    } catch (err) {
      toast.error("Network error. Is the backend running?");
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans selection:bg-amber-500/30">
      <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-amber-500 tracking-wide mb-1">Chef's Dashboard</h1>
          <p className="text-zinc-400 text-sm tracking-widest uppercase">Live Kitchen Display</p>
        </div>
        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full border text-sm font-bold tracking-wider ${connectionStatus === "Connected" ? "bg-green-900/20 border-green-500/50 text-green-400" : "bg-red-900/20 border-red-500/50 text-red-400"}`}>
          <span className="mr-2">●</span> {connectionStatus}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div key={order.orderID} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }} transition={{ duration: 0.3 }} className={`bg-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col border-t-4 ${order.status === 1 ? 'border-red-500' : 'border-amber-500'}`}>
              <div className="bg-zinc-900/50 p-5 border-b border-zinc-700/50 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Order #{order.orderID}</h2>
                  <p className="text-amber-500 font-semibold text-lg">Table {order.tableID}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-400 text-sm">{new Date(order.orderTime || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-zinc-500 text-xs mt-1">{order.customerName}</p>
                </div>
              </div>

              <div className="p-5 flex-grow">
                <ul className="space-y-3">
                  {order.orderItems.map((oi, idx) => (
                    <li key={idx} className="flex items-center text-lg text-zinc-200 bg-zinc-900/30 p-2 rounded">
                      <span className="bg-zinc-700 text-white font-bold w-8 h-8 rounded flex items-center justify-center mr-4 shrink-0">{oi.quantity}</span> 
                      {menuDict[oi.itemID] || "Loading..."}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-zinc-900/50 border-t border-zinc-700/50">
                {order.status === 1 ? (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => updateOrderStatus(order.orderID, 2)} disabled={loadingOrderId === order.orderID} className="w-full bg-green-600 disabled:bg-zinc-600 hover:bg-green-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-colors shadow-lg">
                    {loadingOrderId === order.orderID ? "Processing..." : "Mark as Ready"}
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => updateOrderStatus(order.orderID, 1)} disabled={loadingOrderId === order.orderID} className="w-full bg-amber-600 disabled:bg-zinc-600 hover:bg-amber-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-colors shadow-lg">
                    {loadingOrderId === order.orderID ? "Processing..." : "Start Cooking"}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && connectionStatus === "Connected" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-20">
          <p className="text-zinc-500 text-2xl font-serif italic">The kitchen is clear. Waiting for orders...</p>
        </motion.div>
      )}
    </main>
  );
}