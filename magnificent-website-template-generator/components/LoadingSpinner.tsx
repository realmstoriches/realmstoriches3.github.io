
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center h-full">
      <SparklesIcon className="w-16 h-16 text-sky-500 animate-pulse-fast mb-6" />
      <p className="text-xl font-semibold text-slate-300">{message}</p>
      <p className="text-sm text-slate-400 mt-2">Please wait while we work our magic!</p>
    </div>
  );
};

export default LoadingSpinner;
