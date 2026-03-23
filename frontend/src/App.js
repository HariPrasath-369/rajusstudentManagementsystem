import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import Departments from './pages/principal/Departments';
import HODManagement from './pages/principal/HODManagement';
import Analytics from './pages/principal/Analytics';
import Reports from './pages/principal/Reports';
import HODDashboard from './pages/hod/HODDashboard';
import Teachers from './pages/hod/Teachers';
import Classes from './pages/hod/Classes';
import Timetable from './pages/hod/Timetable';
import DepartmentAnalytics from './pages/hod/DepartmentAnalytics';
import SemesterApproval from './pages/hod/SemesterApproval';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Attendance from './pages/teacher/Attendance';
import Marks from './pages/teacher/Marks';
import Materials from './pages/teacher/Materials';
import Leaves from './pages/teacher/Leaves';
import OEMBoard from './pages/teacher/OEMBoard';

import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import MyMarks from './pages/student/MyMarks';
import MyTimetable from './pages/student/MyTimetable';
import Performance from './pages/student/Performance';
import StudentMaterials from './pages/student/Materials';
import ApplyLeave from './pages/student/ApplyLeave';

// Error Pages
import NotFound from './pages/error/NotFound';
import Forbidden from './pages/error/Forbidden';

// Profile Pages
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import ChangePassword from './pages/profile/ChangePassword';
import Settings from './pages/profile/Settings';

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
      <Route path="/register" element={<Register />} />
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
        <Route path="/profile/settings" element={<Settings />} />
        
        {/* Notification Routes */}
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Role-based Routes */}
        <Route path="/principal">
          <Route index element={<PrincipalDashboard />} />
          <Route path="dashboard" element={<PrincipalDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="hod" element={<HODManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/*" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/*" element={<Reports />} />
        </Route>

        <Route path="/hod">
          <Route index element={<HODDashboard />} />
          <Route path="dashboard" element={<HODDashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="classes/create" element={<Classes />} />
          <Route path="classes/assign-subjects" element={<Classes />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="timetable/generate" element={<Timetable />} />
          <Route path="timetable/conflicts" element={<Timetable />} />
          <Route path="department-analytics" element={<DepartmentAnalytics />} />
          <Route path="analytics/department" element={<DepartmentAnalytics />} />
          <Route path="analytics/workload" element={<DepartmentAnalytics />} />
          <Route path="semester" element={<SemesterApproval />} />
          <Route path="semester-approval" element={<SemesterApproval />} />
        </Route>

        <Route path="/teacher">
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance/mark" element={<Attendance />} />
          <Route path="attendance/qr" element={<Attendance />} />
          <Route path="attendance/reports" element={<Attendance />} />
          <Route path="marks" element={<Marks />} />
          <Route path="marks/upload" element={<Marks />} />
          <Route path="marks/oem" element={<OEMBoard />} />
          <Route path="marks/excel" element={<Marks />} />
          <Route path="marks/publish" element={<Marks />} />
          <Route path="materials" element={<Materials />} />
          <Route path="materials/upload" element={<Materials />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="oem-board" element={<OEMBoard />} />
          <Route path="classes" element={<TeacherDashboard />} />
        </Route>

        <Route path="/student">
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="attendance/scan" element={<MyAttendance />} />
          <Route path="marks" element={<MyMarks />} />
          <Route path="marks/download" element={<MyMarks />} />
          <Route path="marks/performance" element={<Performance />} />
          <Route path="timetable" element={<MyTimetable />} />
          <Route path="performance" element={<Performance />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="leave" element={<ApplyLeave />} />
          <Route path="leaves" element={<ApplyLeave />} />
        </Route>
        
        {/* Error Routes */}
        <Route path="/forbidden" element={<Forbidden />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;