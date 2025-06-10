
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI Website Template Generator. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Gemini API & React</p>
      </div>
    </footer>
  );
};
