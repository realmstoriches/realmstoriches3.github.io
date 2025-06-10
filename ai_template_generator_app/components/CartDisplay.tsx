
import React from 'react';
import { type GeneratedTemplate } from '../types';

interface CartDisplayProps {
  cart: GeneratedTemplate[];
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDisplay: React.FC<CartDisplayProps> = ({ cart, onProceedToCheckout, onContinueShopping }) => {
  if (cart.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-sky-400 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-300 mb-6">Looks like you haven't added any website templates yet.</p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Generate a Template
        </button>
      </div>
    );
  }

  const totalAmount = cart.length * 49.99; // Example fixed price

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Your Shopping Cart</h2>
      
      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="p-4 bg-slate-700 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-slate-100">{item.name}</h3>
              <p className="text-sm text-slate-400">Custom Generated Template</p>
            </div>
            <p className="text-lg font-semibold text-sky-400">$49.99</p> {/* Example fixed price */}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-6">
        <div className="flex justify-between items-center text-xl font-semibold mb-6">
          <span className="text-slate-300">Total:</span>
          <span className="text-green-400">${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Generate Another
          </button>
          <button
            onClick={onProceedToCheckout}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
