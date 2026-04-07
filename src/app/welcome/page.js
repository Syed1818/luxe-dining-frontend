"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WelcomeCheckIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tableNumber, setTableNumber] = useState("Unknown");

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Extract the table number from the URL (e.g., ?table=5)
  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);
  }, [searchParams]);

  const handleStartOrdering = (e) => {
    e.preventDefault();
    
    // Save the customer data and table number to the browser's local storage
    localStorage.setItem('sessionData', JSON.stringify({
      ...customer,
      table: tableNumber
    }));

    // Send them to the main Menu page
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome! 🍽️</h1>
          <p className="text-gray-600 font-semibold text-lg">You are seated at Table {tableNumber}</p>
          <p className="text-sm text-gray-500 mt-2">Please check in to view the menu.</p>
        </div>

        <form onSubmit={handleStartOrdering} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
            <input 
              required 
              type="text" 
              className="w-full p-3 border rounded bg-gray-50 text-black" 
              placeholder="John Doe"
              value={customer.name} 
              onChange={e => setCustomer({...customer, name: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
            <input 
              required 
              type="tel" 
              className="w-full p-3 border rounded bg-gray-50 text-black" 
              placeholder="(555) 000-0000"
              value={customer.phone} 
              onChange={e => setCustomer({...customer, phone: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border rounded bg-gray-50 text-black" 
              placeholder="john@example.com"
              value={customer.email} 
              onChange={e => setCustomer({...customer, email: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 transition duration-200"
          >
            Open Menu
          </button>
        </form>
      </div>
    </div>
  );
}