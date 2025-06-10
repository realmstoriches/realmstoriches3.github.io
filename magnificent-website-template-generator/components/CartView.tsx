
import React from 'react';
import { GeneratedTemplate } from '../types';
import Button from './Button';
import Card from './Card';
import { BackArrowIcon } from './icons/BackArrowIcon';
import { CheckoutIcon } from './icons/CheckoutIcon';

interface CartViewProps {
  item: GeneratedTemplate;
  onCheckout: () => void;
  onBack: () => void;
}

const CartView: React.FC<CartViewProps> = ({ item, onCheckout, onBack }) => {
  return (
    <Card title="Your Cart" titleIcon={<CheckoutIcon className="w-7 h-7" />}>
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
        <h3 className="text-xl font-semibold text-sky-300">{item.name}</h3>
        <p className="text-sm text-slate-400 mt-1 line-clamp-2">Original prompt: {item.description}</p>
        <p className="text-lg font-bold text-green-400 mt-3">Price: Free (Demo)</p>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button onClick={onBack} variant="outline" size="md" leftIcon={<BackArrowIcon className="w-5 h-5" />}>
          Back to Preview
        </Button>
        <Button onClick={onCheckout} variant="primary" size="lg" leftIcon={<CheckoutIcon className="w-5 h-5" />}>
          Proceed to Checkout
        </Button>
      </div>
    </Card>
  );
};

export default CartView;
