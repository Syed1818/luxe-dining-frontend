    "use client";

import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const API_BASE_URL = "https://localhost:7170";

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([]);
  const [menuDict, setMenuDict] = useState({});
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  
  // We use a ref to ensure we only build the connection once
  const connectionRef = useRef(null);

  useEffect(() => {
    // 1. Fetch Menu Dictionary
    fetch(`${API_BASE_URL}/api/Menu`)
      .then(res => res.json())
      .then(data => {
        const dict = {};
        data.forEach(item => { dict[item.itemID] = item.name; });
        setMenuDict(dict);
      })
      .catch(err => console.error("Error fetching menu dict:", err));

    // 2. Setup SignalR
    if (!connectionRef.current) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}/orderHub`)
        .withAutomaticReconnect()
        .build();

      connectionRef.current = newConnection;

      newConnection.on("ReceiveNewOrder", (newOrder) => {
        // Add the new order to the beginning of the list
        setOrders(prevOrders => [newOrder, ...prevOrders]);
      });

      newConnection.start()
        .then(() => setConnectionStatus("Connected"))
        .catch(err => setConnectionStatus("Connection Error"));
    }

    // Cleanup connection when component unmounts
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);

const completeOrder = async (orderId) => {
    try {
      // Tell the C# backend the order is ready
      const res = await fetch(`${API_BASE_URL}/api/Orders/${orderId}/ready`, {
        method: 'PUT'
      });
      
      if (res.ok) {
        // Remove from the kitchen screen
        setOrders(prevOrders => prevOrders.filter(o => o.orderID !== orderId));
      }
    } catch (err) {
      console.error("Error marking order ready:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 font-sans">
      <h1 className="text-4xl font-bold text-center mb-2 border-b border-gray-700 pb-4">
        👨‍🍳 Live Kitchen Display
      </h1>
      
      <div className={`text-center py-2 mb-8 font-bold rounded-md max-w-md mx-auto ${
        connectionStatus === "Connected" ? "bg-green-600" : "bg-red-600"
      }`}>
        {connectionStatus === "Connected" ? "Connected to Server - Waiting for Orders..." : "Waiting for connection..."}
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div key={order.orderID} className="bg-yellow-100 text-black p-5 rounded-lg shadow-xl font-mono relative">
            <h2 className="text-2xl font-bold border-b-2 border-dashed border-gray-400 pb-2 mb-3">
              Order #{order.orderID}
            </h2>
            <p className="font-bold text-lg">Table: {order.tableID}</p>
            <p className="text-gray-700 mb-4 text-sm">
              Time: {new Date(order.orderTime).toLocaleTimeString()}
            </p>
            
            <ul className="mb-6 space-y-2 border-t border-gray-300 pt-4">
              {order.orderItems.map((oi, idx) => (
                <li key={idx} className="text-lg">
                  <span className="font-bold text-blue-700 mr-2">{oi.quantity}x</span> 
                  {menuDict[oi.itemID] || "Unknown Item"}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => completeOrder(order.orderID)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
            >
              Mark as Ready
            </button>
          </div>
        ))}
      </div>
      
      {orders.length === 0 && connectionStatus === "Connected" && (
        <p className="text-center text-gray-500 text-xl mt-12">No active orders.</p>
      )}
    </div>
  );
}