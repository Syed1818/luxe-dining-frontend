"use client"; // Tells Next.js this component uses browser features like useState
import * as signalR from '@microsoft/signalr';
import { useState, useEffect } from 'react';

const API_BASE_URL = "https://localhost:7170"; // Make sure this matches your .NET port
const TABLE_ID = 1;

export default function CustomerMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
// Listen for real-time Kitchen updates!
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/orderHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("OrderReady", (data) => {
      // Only alert if the ready order belongs to THIS table
      if (data.tableID === TABLE_ID) {
        alert(`🔔 DING! Your Order #${data.orderID} is ready for collection!`);
      }
    });

    connection.start().catch(err => console.error("SignalR Customer Error: ", err));

    return () => connection.stop(); // Cleanup on unmount
  }, []);
  // 1. Fetch Menu on Load
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/Menu`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu");
        return res.json();
      })
      .then((data) => setMenuItems(data))
      .catch((err) => setError("Could not connect to API. Is Visual Studio running?"));
  }, []);

  // 2. Cart Logic
  const addToCart = (item) => {
    setCart([...cart, { itemID: item.itemID, name: item.name, price: item.price, quantity: 1 }]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // 3. Submit Order
  const submitOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const orderPayload = {
      tableID: TABLE_ID,
      orderItems: cart.map(item => ({ itemID: item.itemID, quantity: item.quantity }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/Orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        alert("Order placed successfully!");
        setCart([]); // Clear cart
      } else {
        alert("Error placing order.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 border-b pb-4">Our Menu</h1>
        
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        {menuItems.length === 0 && !error && <p className="text-center">Loading menu...</p>}

        {/* Menu List */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.itemID} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
              <div>
                <h3 className="text-xl font-semibold text-blue-600">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-bold transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* Cart Section */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Your Cart (Table {TABLE_ID})</h2>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            {cart.map((item, index) => (
              <li key={index} className="text-lg">
                {item.name} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <h3 className="text-xl font-bold">Total:</h3>
            <h3 className="text-xl font-bold">${cartTotal.toFixed(2)}</h3>
          </div>
          <button 
            onClick={submitOrder}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 rounded-md transition"
          >
            Place Order to Kitchen
          </button>
        </div>
      </div>
    </main>
  );
}