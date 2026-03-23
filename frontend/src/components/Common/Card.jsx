import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  actions,
  hoverable = true,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
    transition-all duration-300 overflow-hidden
    ${hoverable ? 'hover:shadow-md hover:translate-y-[-2px]' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (loading) {
    return (
      <div className={baseClasses}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {(title || subtitle || icon || actions) && (
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary-600 dark:text-primary-400">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className={title || subtitle || icon ? 'p-6 pt-4' : 'p-6'}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;