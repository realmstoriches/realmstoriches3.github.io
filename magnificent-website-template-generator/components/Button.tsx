
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-sm transform active:scale-[0.98]';
  
  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-500 border border-sky-600',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-slate-100 focus:ring-slate-500 border border-slate-600',
    danger: 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 border border-red-600',
    outline: 'bg-transparent hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-slate-500 focus:ring-sky-500',
    ghost: 'bg-transparent hover:bg-slate-700 text-sky-400 hover:text-sky-300 focus:ring-sky-500 border border-transparent',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  const iconSpacing = size === 'sm' ? 'mr-1.5 ml-1.5' : 'mr-2 ml-2';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {leftIcon && <span className={children ? iconSpacing.replace('ml-1.5', '').replace('ml-2', '') : ''}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={children ? iconSpacing.replace('mr-1.5', '').replace('mr-2', '') : ''}>{rightIcon}</span>}
    </button>
  );
};

export default Button;
