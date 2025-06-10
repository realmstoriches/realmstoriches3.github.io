
import React from 'react';
import { GeneratedTemplate } from '../types';
import Button from './Button';
import Card from './Card';
import { BackArrowIcon } from './icons/BackArrowIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface CheckoutPageProps {
  item: GeneratedTemplate;
  onConfirm: () => void;
  onBack: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ item, onConfirm, onBack }) => {
  return (
    <Card title="Checkout Confirmation" titleIcon={<DownloadIcon className="w-7 h-7" />}>
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
        <h3 className="text-xl font-semibold text-sky-300">You're about to "purchase":</h3>
        <p className="text-2xl font-bold text-slate-100 mt-2">{item.name}</p>
        <p className="text-lg font-semibold text-green-400 mt-3">Total: $0.00 (This is a demo)</p>
      </div>
      
      <p className="text-slate-300 mb-8">
        By clicking "Confirm Purchase", you'll get access to download the template files.
        No actual payment is required for this demonstration.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button onClick={onBack} variant="outline" size="md" leftIcon={<BackArrowIcon className="w-5 h-5" />}>
          Back to Cart
        </Button>
        <Button onClick={onConfirm} variant="primary" size="lg" leftIcon={<DownloadIcon className="w-5 h-5" />}>
          Confirm Purchase & Download
        </Button>
      </div>
    </Card>
  );
};

export default CheckoutPage;
