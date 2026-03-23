import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../../components/Forms/Input';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setEmailSent(true);
      toast.success('Password reset OTP sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
      setError(error.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>

        <Card className="p-8">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                touched={true}
                placeholder="Enter your registered email"
                required
                icon={<Mail size={18} />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={<Send size={18} />}
              >
                Send Reset OTP
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
              >
                <Send className="h-8 w-8 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Check Your Email
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We've sent a password reset OTP to <strong>{email}</strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  The OTP is valid for 10 minutes
                </p>
              </div>

              <Button
                onClick={() => navigate('/reset-password', { state: { email } })}
                variant="primary"
                size="lg"
                fullWidth
              >
                Proceed to Reset Password
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;