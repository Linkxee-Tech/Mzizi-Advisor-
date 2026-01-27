import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-800 text-white hover:bg-green-900 shadow-lg shadow-green-200",
    secondary: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-lg shadow-yellow-200",
    outline: "bg-white text-green-800 border-2 border-green-100 hover:bg-green-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
};

export default Button;