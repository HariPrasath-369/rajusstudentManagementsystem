import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
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
  icon = null,
  iconPosition = 'left',
  helperText,
  size = 'md',
  fullWidth = true,
  className = '',
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  autoComplete = 'off',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const hasError = error && touched;
  const isSuccess = !hasError && value && touched && !error;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const hasRightIcon = icon && iconPosition === 'right' && type !== 'password';
  const hasValidationIcon = isSuccess || hasError;
  const hasPasswordToggle = type === 'password';

  let rightPaddingClass = '';
  if (hasPasswordToggle && hasValidationIcon) rightPaddingClass = 'pr-20';
  else if (hasPasswordToggle || hasValidationIcon || hasRightIcon) rightPaddingClass = 'pr-12';

  const inputClasses = `
    w-full rounded-xl border transition-all duration-200 outline-none
    ${sizes[size]}
    ${hasError 
      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900' 
      : isSuccess 
        ? 'border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
        : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
    }
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : 'bg-white dark:bg-gray-800'}
    ${readOnly ? 'bg-gray-50 dark:bg-gray-900 cursor-default' : ''}
    ${icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${rightPaddingClass}
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
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          className={inputClasses}
          {...props}
        />
        
        {/* Password Toggle */}
        {hasPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        
        {/* Right Icon */}
        {hasRightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {/* Success Icon */}
        {isSuccess && !hasRightIcon && (
          <div className={`absolute ${hasPasswordToggle ? 'right-12' : 'right-4'} top-1/2 transform -translate-y-1/2 text-green-500`}>
            <CheckCircle size={18} />
          </div>
        )}
        
        {/* Error Icon */}
        {hasError && !hasRightIcon && (
          <div className={`absolute ${hasPasswordToggle ? 'right-12' : 'right-4'} top-1/2 transform -translate-y-1/2 text-red-500`}>
            <AlertCircle size={18} />
          </div>
        )}
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
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;