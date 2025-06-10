
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-5xl py-6 px-4 md:px-0 text-center text-slate-500 text-sm">
      <p>&copy; {new Date().getFullYear()} AI Template Solutions. All rights reserved (not really, this is a demo!).</p>
      <p>Powered by Generative AI & React.</p>
    </footer>
  );
};

export default Footer;
