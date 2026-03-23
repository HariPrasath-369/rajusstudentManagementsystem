import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

// Layout
import Layout from '../components/Layout/Layout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyOTP from '../pages/auth/VerifyOTP';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';
import PrincipalDashboard from '../pages/principal/PrincipalDashboard';
import HODDashboard from '../pages/hod/HODDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';

// Principal Pages
import Departments from '../pages/principal/Departments';
import HODManagement from '../pages/principal/HODManagement';
import Analytics from '../pages/principal/Analytics';
import Reports from '../pages/principal/Reports';

// HOD Pages
import Teachers from '../pages/hod/Teachers';
import Classes from '../pages/hod/Classes';
import Timetable from '../pages/hod/Timetable';
import SemesterApproval from '../pages/hod/SemesterApproval';
import DepartmentAnalytics from '../pages/hod/DepartmentAnalytics';

// Teacher Pages
import Attendance from '../pages/teacher/Attendance';
import Marks from '../pages/teacher/Marks';
import OEMBoard from '../pages/teacher/OEMBoard';
import Materials from '../pages/teacher/Materials';
import Leaves from '../pages/teacher/Leaves';

// Student Pages
import MyAttendance from '../pages/student/MyAttendance';
import MyMarks from '../pages/student/MyMarks';
import ApplyLeave from '../pages/student/ApplyLeave';
import MyTimetable from '../pages/student/MyTimetable';
import StudyMaterials from '../pages/student/Materials';
import Performance from '../pages/student/Performance';

// Profile Pages
import Profile from '../pages/profile/Profile';
import EditProfile from '../pages/profile/EditProfile';
import ChangePassword from '../pages/profile/ChangePassword';

// Notification Pages
import Notifications from '../pages/notifications/Notifications';

// Error Pages
import NotFound from '../pages/error/NotFound';
import Forbidden from '../pages/error/Forbidden';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case ROLES.PRINCIPAL:
      return <Navigate to="/principal/dashboard" replace />;
    case ROLES.HOD:
      return <Navigate to="/hod/dashboard" replace />;
    case ROLES.TEACHER:
    case ROLES.CA:
      return <Navigate to="/teacher/dashboard" replace />;
    case ROLES.STUDENT:
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

const AppRoutes = () => {
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
        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Profile Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        
        {/* Notification Routes */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        {/* Principal Routes */}
        <Route path="/principal/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
            <PrincipalDashboard />
          </ProtectedRoute>
        } />
        <Route path="/principal/departments" element={
          <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
            <Departments />
          </ProtectedRoute>
        } />
        <Route path="/principal/hod" element={
          <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
            <HODManagement />
          </ProtectedRoute>
        } />
        <Route path="/principal/analytics" element={
          <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/principal/reports" element={
          <ProtectedRoute allowedRoles={[ROLES.PRINCIPAL]}>
            <Reports />
          </ProtectedRoute>
        } />
        
        {/* HOD Routes */}
        <Route path="/hod/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <HODDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hod/teachers" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <Teachers />
          </ProtectedRoute>
        } />
        <Route path="/hod/classes" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <Classes />
          </ProtectedRoute>
        } />
        <Route path="/hod/timetable" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <Timetable />
          </ProtectedRoute>
        } />
        <Route path="/hod/semester-approval" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <SemesterApproval />
          </ProtectedRoute>
        } />
        <Route path="/hod/department-analytics" element={
          <ProtectedRoute allowedRoles={[ROLES.HOD]}>
            <DepartmentAnalytics />
          </ProtectedRoute>
        } />
        
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/attendance" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/teacher/attendance/mark" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/teacher/attendance/qr" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/teacher/attendance/reports" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/teacher/marks" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Marks />
          </ProtectedRoute>
        } />
        <Route path="/teacher/marks/upload" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Marks />
          </ProtectedRoute>
        } />
        <Route path="/teacher/marks/oem" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <OEMBoard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/marks/excel" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Marks />
          </ProtectedRoute>
        } />
        <Route path="/teacher/marks/publish" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Marks />
          </ProtectedRoute>
        } />
        <Route path="/teacher/oem-board" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <OEMBoard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/materials" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Materials />
          </ProtectedRoute>
        } />
        <Route path="/teacher/materials/upload" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Materials />
          </ProtectedRoute>
        } />
        <Route path="/teacher/leaves" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Leaves />
          </ProtectedRoute>
        } />
        <Route path="/teacher/classes" element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.CA]}>
            <Attendance /> {/* Or a separate MyClasses component if available */}
          </ProtectedRoute>
        } />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/attendance" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <MyAttendance />
          </ProtectedRoute>
        } />
        <Route path="/student/marks" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <MyMarks />
          </ProtectedRoute>
        } />
        <Route path="/student/leave" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <ApplyLeave />
          </ProtectedRoute>
        } />
        <Route path="/student/timetable" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <MyTimetable />
          </ProtectedRoute>
        } />
        <Route path="/student/materials" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudyMaterials />
          </ProtectedRoute>
        } />
        <Route path="/student/performance" element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Performance />
          </ProtectedRoute>
        } />
        
        {/* Error Routes */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;