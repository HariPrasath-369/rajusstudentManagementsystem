import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import HODDashboard from './pages/hod/HODDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';

// Error Pages
import NotFound from './pages/error/NotFound';
import Forbidden from './pages/error/Forbidden';

// Profile Pages
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import ChangePassword from './pages/profile/ChangePassword';

// Notification Pages
import Notifications from './pages/notifications/Notifications';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const getDashboardByRole = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch(user.role) {
      case 'ROLE_PRINCIPAL':
        return <PrincipalDashboard />;
      case 'ROLE_HOD':
        return <HODDashboard />;
      case 'ROLE_TEACHER':
      case 'ROLE_CA':
        return <TeacherDashboard />;
      case 'ROLE_STUDENT':
        return <StudentDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      
      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={getDashboardByRole()} />
        <Route path="/dashboard" element={getDashboardByRole()} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        
        {/* Notification Routes */}
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Role-based Routes */}
        <Route path="/principal/*" element={<PrincipalDashboard />} />
        <Route path="/hod/*" element={<HODDashboard />} />
        <Route path="/teacher/*" element={<TeacherDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        
        {/* Error Routes */}
        <Route path="/forbidden" element={<Forbidden />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;