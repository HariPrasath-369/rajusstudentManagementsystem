// import React, { useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
//   const types = {
//     success: {
//       icon: CheckCircle,
//       bgColor: 'bg-green-50 dark:bg-green-900/30',
//       textColor: 'text-green-800 dark:text-green-300',
//       borderColor: 'border-green-200 dark:border-green-800',
//     },
//     error: {
//       icon: XCircle,
//       bgColor: 'bg-red-50 dark:bg-red-900/30',
//       textColor: 'text-red-800 dark:text-red-300',
//       borderColor: 'border-red-200 dark:border-red-800',
//     },
//     warning: {
//       icon: AlertCircle,
//       bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
//       textColor: 'text-yellow-800 dark:text-yellow-300',
//       borderColor: 'border-yellow-200 dark:border-yellow-800',
//     },
//     info: {
//       icon: Info,
//       bgColor: 'bg-blue-50 dark:bg-blue-900/30',
//       textColor: 'text-blue-800 dark:text-blue-300',
//       borderColor: 'border-blue-200 dark:border-blue-800',
//     },
//   };

//   const { icon: Icon, bgColor, textColor, borderColor } = types[type];

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, duration);
//     return () => clearTimeout(timer);
//   }, [duration, onClose]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 100 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 100 }}
//       className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${bgColor} ${borderColor} min-w-[300px] max-w-md`}
//     >
//       <Icon className={`${textColor} flex-shrink-0`} size={20} />
//       <p className={`flex-1 text-sm font-medium ${textColor}`}>{message}</p>
//       <button
//         onClick={onClose}
//         className={`p-1 rounded-lg hover:bg-black/10 transition-colors ${textColor}`}
//       >
//         <X size={16} />
//       </button>
//     </motion.div>
//   );
// };

// export default Toast;