
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleIcon }) => {
  return (
    <div className={`bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8 ${className}`}>
      {title && (
        <div className="flex items-center mb-6">
          {titleIcon && <span className="mr-3 text-sky-400">{titleIcon}</span>}
          <h2 className="text-2xl font-semibold text-sky-400">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
