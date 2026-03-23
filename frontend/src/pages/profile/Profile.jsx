import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Edit,
  Camera,
  Shield,
  Clock,
  Users,
  School,
  Building2,
  Mail as MailIcon,
  PhoneCall,
  CalendarDays,
  ChevronRight,
  Printer
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    rollNumber: '',
    registrationNumber: '',
    dateOfBirth: '',
    admissionYear: '',
    address: '',
    fatherName: '',
    motherName: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    joiningDate: '',
    officeRoom: '',
    createdAt: '',
    lastLogin: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
      setProfileData(getMockProfileData());
    } finally {
      setLoading(false);
    }
  };

  const getMockProfileData = () => ({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 234 567 8900',
    role: 'STUDENT',
    department: 'Computer Science Engineering',
    rollNumber: 'CS2021001',
    registrationNumber: '2021CS101',
    dateOfBirth: '2000-01-15',
    admissionYear: '2021',
    address: '123 University Campus, City, State 12345',
    fatherName: 'Robert Doe',
    motherName: 'Sarah Doe',
    employeeId: '',
    qualification: '',
    specialization: '',
    joiningDate: '',
    officeRoom: '',
    createdAt: '2021-08-01',
    lastLogin: '2024-03-15 10:30:00'
  });

  const getRoleBadge = (role) => {
    const badges = {
      ROLE_PRINCIPAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      ROLE_HOD: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      ROLE_TEACHER: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      ROLE_CA: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      ROLE_STUDENT: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleName = (role) => {
    const names = {
      ROLE_PRINCIPAL: 'Principal',
      ROLE_HOD: 'Head of Department',
      ROLE_TEACHER: 'Teacher',
      ROLE_CA: 'Class Advisor',
      ROLE_STUDENT: 'Student'
    };
    return names[role] || role;
  };

  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}>
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
        <Icon size={18} className="text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your personal information
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/profile/edit')}>
          <Edit size={18} className="mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
              <Camera size={14} className="text-primary-600" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{profileData.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
              <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadge(profileData.role)}`}>
                {getRoleName(profileData.role)}
              </span>
              <span className="text-primary-100">•</span>
              <span className="text-sm text-primary-100">{profileData.department}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-primary-100">
              <MailIcon size={14} />
              <span>{profileData.email}</span>
              <span className="mx-1">•</span>
              <PhoneCall size={14} />
              <span>{profileData.phone}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Section title="Personal Information" icon={User}>
          <div className="space-y-2">
            <InfoRow icon={User} label="Full Name" value={profileData.name} />
            <InfoRow icon={Mail} label="Email Address" value={profileData.email} />
            <InfoRow icon={Phone} label="Phone Number" value={profileData.phone} />
            <InfoRow icon={Calendar} label="Date of Birth" value={profileData.dateOfBirth} />
            <InfoRow icon={MapPin} label="Address" value={profileData.address} />
          </div>
        </Section>

        {/* Academic Information */}
        {profileData.role === 'ROLE_STUDENT' && (
          <Section title="Academic Information" icon={GraduationCap}>
            <div className="space-y-2">
              <InfoRow icon={BookOpen} label="Roll Number" value={profileData.rollNumber} />
              <InfoRow icon={Award} label="Registration Number" value={profileData.registrationNumber} />
              <InfoRow icon={CalendarDays} label="Admission Year" value={profileData.admissionYear} />
              <InfoRow icon={Users} label="Department" value={profileData.department} />
              <InfoRow icon={User} label="Father's Name" value={profileData.fatherName} />
              <InfoRow icon={User} label="Mother's Name" value={profileData.motherName} />
            </div>
          </Section>
        )}

        {/* Faculty Information */}
        {(profileData.role === 'ROLE_TEACHER' || profileData.role === 'ROLE_CA' || profileData.role === 'ROLE_HOD') && (
          <Section title="Faculty Information" icon={School}>
            <div className="space-y-2">
              <InfoRow icon={Award} label="Employee ID" value={profileData.employeeId} />
              <InfoRow icon={BookOpen} label="Qualification" value={profileData.qualification} />
              <InfoRow icon={Award} label="Specialization" value={profileData.specialization} />
              <InfoRow icon={Calendar} label="Joining Date" value={profileData.joiningDate} />
              {profileData.role === 'ROLE_HOD' && (
                <InfoRow icon={Building2} label="Office Room" value={profileData.officeRoom} />
              )}
            </div>
          </Section>
        )}

        {/* HOD Information */}
        {profileData.role === 'ROLE_HOD' && (
          <Section title="HOD Information" icon={Building2}>
            <div className="space-y-2">
              <InfoRow icon={Building2} label="Department" value={profileData.department} />
              <InfoRow icon={Calendar} label="Appointment Date" value={profileData.joiningDate} />
              <InfoRow icon={MapPin} label="Office Room" value={profileData.officeRoom} />
            </div>
          </Section>
        )}
      </div>

      {/* Account Information */}
      <Section title="Account Information" icon={Shield}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={Clock} label="Account Created" value={profileData.createdAt} />
          <InfoRow icon={Clock} label="Last Login" value={profileData.lastLogin} />
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => navigate('/profile/change-password')}>
            <Shield size={18} className="mr-2" />
            Change Password
          </Button>
        </div>
      </Section>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/profile/edit')}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <Edit size={18} className="text-primary-600" />
            </div>
            <span className="font-medium">Edit Profile</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => navigate('/profile/change-password')}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <Shield size={18} className="text-primary-600" />
            </div>
            <span className="font-medium">Change Password</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30">
              <Printer size={18} className="text-primary-600" />
            </div>
            <span className="font-medium">Print Profile</span>
          </div>
          <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Profile;