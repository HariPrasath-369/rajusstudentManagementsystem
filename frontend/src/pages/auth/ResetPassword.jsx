import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import Input from '../../components/Forms/Input';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
      if (error.response?.data?.message.includes('OTP')) {
        setErrors({ otp: 'Invalid or expired OTP' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.forgotPassword(email);
      toast.success('New OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter the OTP sent to <strong>{email}</strong> and your new password
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="OTP Code"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={errors.otp}
              touched={true}
              placeholder="Enter 6-digit OTP"
              required
              maxLength={6}
              icon={<KeyRound size={18} />}
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              touched={true}
              placeholder="Enter new password"
              required
              icon={<Lock size={18} />}
              helperText="Must contain uppercase, lowercase and number"
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              touched={true}
              placeholder="Confirm new password"
              required
              icon={<Lock size={18} />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Reset Password
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Didn't receive OTP? Resend
              </button>
              
              <div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Password Security Tips:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use at least 8 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include numbers and special characters</li>
              <li>Avoid using personal information</li>
              <li>Don't reuse passwords from other accounts</li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;