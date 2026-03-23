import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  touched,
  required = false,
  disabled = false,
  searchable = false,
  multiple = false,
  clearable = false,
  size = 'md',
  fullWidth = true,
  className = '',
  helperText,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const hasError = error && touched;
  const selectedValue = multiple ? value || [] : value;
  const selectedOptions = multiple 
    ? options.filter(opt => selectedValue.includes(opt.value))
    : options.find(opt => opt.value === selectedValue);

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = selectedValue.includes(optionValue)
        ? selectedValue.filter(v => v !== optionValue)
        : [...selectedValue, optionValue];
      onChange({ target: { name, value: newValue } });
    } else {
      onChange({ target: { name, value: optionValue } });
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (multiple) {
      onChange({ target: { name, value: [] } });
    } else {
      onChange({ target: { name, value: '' } });
    }
  };

  const filteredOptions = searchable && searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const displayValue = () => {
    if (multiple && selectedValue.length > 0) {
      return `${selectedValue.length} item(s) selected`;
    }
    if (selectedOptions) {
      return selectedOptions.label;
    }
    return placeholder;
  };

  const inputClasses = `
    w-full rounded-xl border transition-all duration-200 cursor-pointer
    flex items-center justify-between bg-white dark:bg-gray-800
    ${sizes[size]}
    ${hasError 
      ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
    }
    ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} mb-4`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={inputClasses}
          disabled={disabled}
        >
          <span className={`truncate ${!selectedValue ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {displayValue()}
          </span>
          <div className="flex items-center gap-1">
            {clearable && selectedValue && (multiple ? selectedValue.length > 0 : selectedValue) && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
            <ChevronDown 
              size={18} 
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}
              
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No options available
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = multiple 
                      ? selectedValue.includes(option.value)
                      : selectedValue === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group
                          ${isSelected ? 'bg-primary-50 dark:bg-primary-900/30' : ''}
                        `}
                      >
                        <span className={`text-sm ${isSelected ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {option.label}
                        </span>
                        {isSelected && <Check size={16} className="text-primary-600 dark:text-primary-400" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : helperText && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;