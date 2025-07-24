import React from 'react';
import { ButtonProps } from '../../types/component.types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const getButtonClasses = () => {
    const baseClasses = `
  font-medium rounded-lg transition-all duration-200 
  focus:outline-none focus:ring-2 focus:ring-offset-2 
  disabled:opacity-50 disabled:cursor-not-allowed 
  shadow-lg hover:shadow-xl cursor-pointer
`;

    
    const variantClasses = {
      primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500',
      secondary: 'bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500',
      outline: 'bg-transparent border-2 border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg w-full'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {children}
    </button>
  );
};

export default Button;