import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, School, ChevronRight } from 'lucide-react';
import Input from '../../components/Forms/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      toast.success('Login successful! Redirecting...', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      if (response.role === 'ROLE_PRINCIPAL') {
        navigate('/principal/dashboard');
      } else if (response.role === 'ROLE_HOD') {
        navigate('/hod/dashboard');
      } else if (response.role === 'ROLE_TEACHER' || response.role === 'ROLE_CA') {
        navigate('/teacher/dashboard');
      } else if (response.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.', {
        style: {
          borderRadius: '10px',
          background: '#fef2f2',
          color: '#991b1b',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-white bg-slate-50 dark:bg-[#0b1120] font-['Inter'] overflow-hidden selection:bg-blue-500/30">
      
      {/* Dynamic Background Elements - refined for a professional look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 w-full lg:w-1/2">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: "easeOut" }}
           className="mx-auto w-full max-w-sm lg:w-[400px]"
        >
          <div className="text-center lg:text-left mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 mb-6"
            >
              <School className="h-8 w-8 text-white" />
            </motion.div>
            
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 font-['Outfit']">
              Sign In
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Enter your credentials to access the academic portal.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <Input
                  label={<span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Email Address</span>}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  touched={true}
                  placeholder="Enter your email"
                  required
                  icon={<Mail size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
                  className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300"
                />
              </div>

              <div className="group">
                <Input
                  label={<span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Password</span>}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  touched={true}
                  placeholder="Enter your password"
                  required
                  icon={<Lock size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
                  className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded box-border peer-checked:bg-blue-600 peer-checked:border-blue-600 dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500 transition-all duration-200"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                    Remember me
                  </span>
                </label>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center tracking-wide">
                    Login to Portal
                    <ChevronRight size={18} className="ml-1" />
                  </span>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Right side Showcase - strictly enterprise and clean */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-8 z-10">
         <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="w-full max-w-2xl relative"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-[3rem] transform rotate-3 scale-105" />
            
            <div className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/50 dark:border-slate-700/50 shadow-2xl overflow-hidden">
               {/* Abstract inner glow */}
               <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
               <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

               <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <School className="text-white w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">University Portal</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 font-medium">Secure academic management system.</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mt-4">
                     {['Streamlined Administration', 'Real-time Analytics', 'Secure Access Control', 'Unified Platform'].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                           <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                           </div>
                           <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{feature}</span>
                        </div>
                     ))}
                  </div>

                  <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-500/20 mt-4 relative">
                     <div className="absolute -top-4 -left-2 text-6xl text-blue-200 dark:text-blue-500/20 font-serif leading-none">"</div>
                     <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed relative z-10 text-lg">
                        Empowering institutions with a modern, reliable, and beautifully crafted ecosystem designed for the future of education.
                     </p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default Login;