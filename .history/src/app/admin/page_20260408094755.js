"use client";
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

// API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7170";

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Mains', isAvailable: true });
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  // 1. Detect the current URL (Local vs Vercel)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    fetch(`${API_BASE_URL}/api/Menu/all`)
      .then(res => {
        if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);
        return res.text(); 
      })
      .then(text => {
        if (text) {
          setMenuItems(JSON.parse(text));
        }
      })
      .catch(err => console.error("Failed to fetch menu:", err));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/Menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newItem, price: parseFloat(newItem.price) })
    });
    setNewItem({ name: '', description: '', price: '', category: 'Mains', isAvailable: true });
    fetchMenu();
  };

  const toggleAvailability = async (item) => {
    const updatedItem = { ...item, isAvailable: !item.isAvailable };
    await fetch(`${API_BASE_URL}/api/Menu/${item.itemID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });
    fetchMenu();
  };

  const deleteItem = async (id) => {
    if(confirm("Are you sure you want to delete this item?")) {
        await fetch(`${API_BASE_URL}/api/Menu/${id}`, { method: 'DELETE' });
        fetchMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center border-b-4 border-blue-600 pb-2">⚙️ Restaurant Admin Dashboard</h1>
        
        {/* ADD ITEM FORM */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
          <form onSubmit={handleAddItem} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold mb-1">Name</label>
              <input required type="text" className="w-full p-2 border rounded" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-bold mb-1">Price ($)</label>
              <input required type="number" step="0.01" className="w-full p-2 border rounded" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
            </div>
            <div className="flex-2 min-w-[300px]">
              <label className="block text-sm font-bold mb-1">Description</label>
              <input type="text" className="w-full p-2 border rounded" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            </div>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 h-[42px]">
              Add Item
            </button>
          </form>
        </div>

        {/* MENU MANAGEMENT GRID */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Manage Current Menu</h2>
          <div className="grid gap-4">
            {menuItems.map(item => (
              <div key={item.itemID} className={`flex justify-between items-center p-4 border rounded ${item.isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                <div>
                  <h3 className="text-xl font-bold">{item.name} <span className="text-sm font-normal text-gray-500">(${item.price.toFixed(2)})</span></h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs font-bold mt-1 text-gray-500">Status: {item.isAvailable ? "In Stock" : "Out of Stock"}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleAvailability(item)} 
                    className={`px-4 py-2 text-sm font-bold text-white rounded ${item.isAvailable ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {item.isAvailable ? "Mark Out of Stock" : "Restock"}
                  </button>
                  <button onClick={() => deleteItem(item.itemID)} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR CODE GENERATOR */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
          <h2 className="text-2xl font-bold mb-4">Table QR Codes</h2>
          <p className="text-gray-600 mb-2">Print these and place them on the physical tables.</p>
          <p className="text-xs text-blue-600 font-mono mb-6 uppercase tracking-widest">Base URL: {baseUrl}</p>
          
          <div className="flex gap-8 flex-wrap">
            {[1, 2, 3, 4].map(tableNum => (
              <div key={tableNum} className="text-center p-4 border rounded-lg bg-gray-50 flex flex-col items-center">
                <h3 className="font-bold text-lg mb-2">Table {tableNum}</h3>
                <div className="bg-white p-2 rounded shadow-sm">
                  {/* Dynamic URL: Uses Vercel URL when live, Localhost when dev */}
                  <QRCodeSVG value={`${baseUrl}/welcome?table=${tableNum}`} size={150} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 font-mono">/welcome?table={tableNum}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}