import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
  maxLength,
  minLength,
  resize = true,
  size = 'md',
  fullWidth = true,
  className = '',
  helperText,
  autoFocus = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const hasError = error && touched;
  const isSuccess = !hasError && value && touched && !error;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const textareaClasses = `
    w-full rounded-xl border transition-all duration-200 outline-none
    ${sizes[size]}
    ${!resize ? 'resize-none' : 'resize-y'}
    ${hasError 
      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900' 
      : isSuccess 
        ? 'border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
    }
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-800'}
    ${readOnly ? 'bg-gray-50 dark:bg-gray-900 cursor-default' : ''}
    ${(hasError || isSuccess) ? 'pr-12' : ''}
    ${className}
  `;

  // Auto-resize functionality
  const handleInput = (e) => {
    if (resize) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

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
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          autoFocus={autoFocus}
          className={textareaClasses}
          {...props}
        />
        
        {/* Success/Error Icons */}
        <div className="absolute right-4 top-3.5">
          {isSuccess && <CheckCircle size={18} className="text-green-500" />}
          {hasError && <AlertCircle size={18} className="text-red-500" />}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(helperText || hasError) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1"
          >
            {hasError ? (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </p>
            ) : helperText && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Character Counter */}
      {maxLength && value && (
        <div className="mt-1 text-right">
          <span className={`text-xs ${value.length > maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value.length}/{maxLength} characters
          </span>
        </div>
      )}
      
      {/* Word Counter (optional) */}
      {props.showWordCount && value && (
        <div className="mt-1 text-right">
          <span className="text-xs text-gray-400">
            {value.trim().split(/\s+/).filter(word => word.length > 0).length} words
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;