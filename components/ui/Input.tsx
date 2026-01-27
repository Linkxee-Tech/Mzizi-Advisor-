import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input 
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-400 bg-white dark:bg-gray-800 dark:text-white ${error ? 'border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;