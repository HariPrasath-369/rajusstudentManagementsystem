import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Shield, AlertTriangle, Lock, Key, UserX, Mail, Phone } from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';

const Forbidden = () => {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@university.edu?subject=Access%20Denied%20Issue';
  };

  const commonReasons = [
    { icon: UserX, text: 'Your role does not have permission to access this page' },
    { icon: Lock, text: 'The page requires higher privileges' },
    { icon: Key, text: 'Your session may have expired' },
    { icon: Shield, text: 'Security restrictions in place' }
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
          {/* 403 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-gray-300 dark:text-gray-700 select-none">
              403
            </div>
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Shield size={80} className="text-red-500 opacity-50" />
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock size={24} className="text-red-500" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Access Denied
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
            </p>
          </motion.div>

          {/* Common Reasons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-2">
              <AlertTriangle size={16} />
              Common Reasons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonReasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <reason.icon size={16} className="text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{reason.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            <Button variant="primary" onClick={() => navigate(-1)} icon={<ArrowLeft size={18} />}>
              Go Back
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} icon={<Home size={18} />}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleContactSupport} icon={<Mail size={18} />}>
              Contact Support
            </Button>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary-600" />
                <a href="mailto:support@university.edu" className="text-primary-600 hover:underline">
                  support@university.edu
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary-600" />
                <a href="tel:+1234567890" className="text-primary-600 hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </motion.div>

          {/* Fun Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-400">
              Tip: Make sure you're logged in with the correct account. Different roles have different access levels.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Forbidden;