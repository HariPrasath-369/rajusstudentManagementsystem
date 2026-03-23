import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';

const DatePicker = ({
  label,
  name,
  value,
  onChange,
  error,
  touched,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  minDate,
  maxDate,
  size = 'md',
  fullWidth = true,
  className = '',
  helperText,
  format: dateFormat = 'yyyy-MM-dd',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const pickerRef = useRef(null);
  
  const hasError = error && touched;
  const selectedDate = value ? parseISO(value) : null;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date) => {
    if (minDate && date < new Date(minDate)) return;
    if (maxDate && date > new Date(maxDate)) return;
    
    const formattedDate = format(date, dateFormat);
    onChange({ target: { name, value: formattedDate } });
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } });
  };

  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = start.getDay();
    const blanks = Array(firstDayOfMonth).fill(null);
    
    return [...blanks, ...days];
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} mb-4`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={inputClasses}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <span className={!selectedDate ? 'text-gray-400' : 'text-gray-900 dark:text-white'}>
              {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : placeholder}
            </span>
          </div>
          {selectedDate && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </button>
        
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`blank-${index}`} className="h-9" />;
                  }
                  
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayDate = isToday(day);
                  const isDisabled = isDateDisabled(day);
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`
                        h-9 rounded-lg text-sm transition-all duration-200
                        ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                        ${isSelected 
                          ? 'bg-primary-600 text-white hover:bg-primary-700' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                        ${isTodayDate && !isSelected ? 'border border-primary-500' : ''}
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
              
              {/* Today Button */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleDateSelect(new Date())}
                  className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Today
                </button>
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

export default DatePicker;