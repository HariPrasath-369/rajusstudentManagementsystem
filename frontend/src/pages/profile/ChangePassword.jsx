import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Shield,
  Key
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Forms/Input';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await userService.changePassword(formData);
      toast.success('Password changed successfully! Please login again.');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      if (error.response?.data?.message?.includes('current password')) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'No password', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    
    const strengths = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500', width: '20%' },
      { score: 1, label: 'Weak', color: 'bg-orange-500', width: '40%' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500', width: '60%' },
      { score: 3, label: 'Good', color: 'bg-blue-500', width: '80%' },
      { score: 4, label: 'Strong', color: 'bg-green-500', width: '100%' }
    ];
    
    return strengths[score] || strengths[0];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Change Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-primary-600" />
                Verify Identity
              </h3>
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                required
                placeholder="Enter your current password"
                icon={<Lock size={18} />}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* New Password */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Key size={20} className="text-primary-600" />
                New Password
              </h3>
              <div className="space-y-4">
                <Input
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  required
                  placeholder="Enter new password"
                  icon={<Lock size={18} />}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Password Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.score === 0 ? 'text-red-500' :
                        passwordStrength.score === 1 ? 'text-orange-500' :
                        passwordStrength.score === 2 ? 'text-yellow-500' :
                        passwordStrength.score === 3 ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`${passwordStrength.color} h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>
                )}
                
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  placeholder="Confirm new password"
                  icon={<Lock size={18} />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Password Requirements:
              </h4>
              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-center gap-2">
                  {formData.newPassword.length >= 6 ? <CheckCircle size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-blue-500"></div>}
                  <span>At least 6 characters long</span>
                </li>
                <li className="flex items-center gap-2">
                  {/[A-Z]/.test(formData.newPassword) ? <CheckCircle size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-blue-500"></div>}
                  <span>Contains at least one uppercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  {/[a-z]/.test(formData.newPassword) ? <CheckCircle size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-blue-500"></div>}
                  <span>Contains at least one lowercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  {/[0-9]/.test(formData.newPassword) ? <CheckCircle size={12} className="text-green-500" /> : <div className="w-3 h-3 rounded-full border border-blue-500"></div>}
                  <span>Contains at least one number</span>
                </li>
              </ul>
            </div>

            {/* Security Tips */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Security Tips:
              </h4>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside">
                <li>Never share your password with anyone</li>
                <li>Use a unique password for this account</li>
                <li>Consider using a password manager</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>

            {/* Info Banner */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-red-500 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Important:</strong> After changing your password, you will be logged out and will need to log in again with your new password.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<Save size={18} />}
              >
                Change Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                icon={<X size={18} />}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Password History Note */}
      <Card className="bg-gray-50 dark:bg-gray-700">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-primary-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Password History</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your password cannot be the same as your last 3 passwords for security reasons.
              This helps protect your account from unauthorized access.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChangePassword;