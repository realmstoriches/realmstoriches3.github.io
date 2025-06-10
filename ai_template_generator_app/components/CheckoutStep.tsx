
import React, { useState } from 'react';
import { type GeneratedTemplate } from '../types';

interface CheckoutStepProps {
  cart: GeneratedTemplate[];
  onConfirmPurchase: () => void;
  onGoBack: () => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({ cart, onConfirmPurchase, onGoBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Simplified: No actual card details processing

  const totalAmount = cart.length * 49.99; // Example fixed price

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Please fill in your name and email.");
      return;
    }
    // Simulate validation
    if (!email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }
    onConfirmPurchase();
  };
  
  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100 placeholder-slate-400";
  const commonLabelClass = "block text-sm font-medium text-sky-300";


  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Checkout</h2>
      
      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-lg font-medium text-slate-100 mb-2">Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm text-slate-300 py-1">
            <span>{item.name}</span>
            <span>$49.99</span>
          </div>
        ))}
        <div className="flex justify-between text-lg font-semibold text-slate-100 border-t border-slate-600 mt-2 pt-2">
          <span>Total</span>
          <span className="text-green-400">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={commonLabelClass}>Full Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={commonInputClass} required />
        </div>
        <div>
          <label htmlFor="email" className={commonLabelClass}>Email Address</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClass} required />
        </div>
        
        <div className="pt-2 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-4">This is a simulated checkout. No real payment will be processed.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={onGoBack}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out w-full sm:w-auto"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out w-full sm:w-auto"
          >
            Confirm & Complete Purchase (Simulated)
          </button>
        </div>
      </form>
    </div>
  );
};
