import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import Input from '../../components/Forms/Input';
import Button from '../../components/Common/Button';
import authService from '../../services/authService';
import { useNotification } from '../../context/NotificationContext';
import Card from '../../components/Common/Card'; // Keeping Card as it's used in the JSX
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // Initialize useNotification

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast.success('OTP verified successfully');
        navigate('/reset-password');
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Invalid OTP');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">Enter the verification code sent to your email</p>
        </div>

        <Card className="p-8 shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="OTP Code"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Verify
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
