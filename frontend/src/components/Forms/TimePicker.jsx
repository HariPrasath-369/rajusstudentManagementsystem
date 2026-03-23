import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const TimePicker = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  size = 'md',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const hasError = error && touched;

  const inputClasses = `
    w-full rounded-xl border transition-all duration-200 outline-none
    ${sizes[size]}
    ${hasError 
      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500'
    }
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-800'}
    pl-11
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} mb-4`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Clock size={18} />
        </div>
        
        <input
          type="time"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default TimePicker;
