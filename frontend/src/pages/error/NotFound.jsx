import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass, AlertCircle } from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';

const NotFound = () => {
  const navigate = useNavigate();

  const suggestions = [
    { path: '/dashboard', label: 'Go to Dashboard', icon: Home },
    { path: '/', label: 'Back to Home', icon: ArrowLeft },
    { path: '/profile', label: 'View Profile', icon: Compass },
    { path: '/notifications', label: 'Check Notifications', icon: Search }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center p-8 md:p-12">
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-gray-300 dark:text-gray-700 select-none">
              404
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <AlertCircle size={80} className="text-primary-500 opacity-50" />
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.path}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(suggestion.path)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
              >
                <suggestion.icon size={18} className="text-gray-500 group-hover:text-primary-500 transition-colors" />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {suggestion.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Search Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Can't find what you're looking for?
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search for pages..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                Search
              </Button>
            </div>
          </motion.div>

          {/* Fun Illustration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400">
              Lost? Don't worry, even the best explorers get lost sometimes.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;