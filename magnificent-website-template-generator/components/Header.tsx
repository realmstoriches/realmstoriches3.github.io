
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon'; // Assuming you create this icon

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl py-6 px-4 md:px-0 text-center">
      <div className="flex items-center justify-center space-x-3">
        <SparklesIcon className="w-10 h-10 text-sky-400" />
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
          Magnificent Template Generator
        </h1>
      </div>
      <p className="mt-2 text-slate-400 text-sm sm:text-base">AI-Powered Website Templates at Your Fingertips</p>
    </header>
  );
};

export default Header;
