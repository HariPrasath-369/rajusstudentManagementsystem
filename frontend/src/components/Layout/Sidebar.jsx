import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Award,
  FileText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  UserCog,
  GraduationCap,
  ClipboardList,
  BarChart3,
  FolderOpen,
  Mail,
  ChevronDown,
  ChevronRight,
  QrCode,
  Download,
  Upload,
  TrendingUp,
  School,
  UserPlus,
  BookMarked,
  MessageSquare,
  CalendarDays
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ sidebarOpen, mobileMenuOpen, toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
        roles: ['ROLE_PRINCIPAL', 'ROLE_HOD', 'ROLE_TEACHER', 'ROLE_CA', 'ROLE_STUDENT']
      }
    ];

    const roleBasedItems = {
      ROLE_PRINCIPAL: [
        {
          key: 'departments',
          label: 'Departments',
          icon: Building2,
          path: '/principal/departments',
          roles: ['ROLE_PRINCIPAL']
        },
        {
          key: 'hod',
          label: 'HOD Management',
          icon: UserCog,
          path: '/principal/hod',
          roles: ['ROLE_PRINCIPAL']
        },
        {
          key: 'analytics',
          label: 'Analytics',
          icon: TrendingUp,
          roles: ['ROLE_PRINCIPAL'],
          submenu: [
            { label: 'Performance', path: '/principal/analytics/performance', icon: BarChart3 },
            { label: 'Teacher Ranking', path: '/principal/analytics/teacher-ranking', icon: Award },
            { label: 'Department Comparison', path: '/principal/analytics/department-comparison', icon: Building2 },
            { label: 'AI Predictions', path: '/principal/analytics/predictions', icon: TrendingUp }
          ]
        },
        {
          key: 'reports',
          label: 'Reports',
          icon: FileText,
          roles: ['ROLE_PRINCIPAL'],
          submenu: [
            { label: 'Institution Report', path: '/principal/reports/institution', icon: BarChart3 },
            { label: 'Export Data', path: '/principal/reports/export', icon: Download }
          ]
        }
      ],
      ROLE_HOD: [
        {
          key: 'teachers',
          label: 'Teachers',
          icon: Users,
          path: '/hod/teachers',
          roles: ['ROLE_HOD']
        },
        {
          key: 'classes',
          label: 'Classes',
          icon: GraduationCap,
          roles: ['ROLE_HOD'],
          submenu: [
            { label: 'All Classes', path: '/hod/classes', icon: School },
            { label: 'Create Class', path: '/hod/classes/create', icon: UserPlus },
            { label: 'Assign Subjects', path: '/hod/classes/assign-subjects', icon: BookMarked }
          ]
        },
        {
          key: 'timetable',
          label: 'Timetable',
          icon: Calendar,
          roles: ['ROLE_HOD'],
          submenu: [
            { label: 'View Timetable', path: '/hod/timetable', icon: CalendarDays },
            { label: 'Generate Auto Timetable', path: '/hod/timetable/generate', icon: Calendar },
            { label: 'Conflict Detection', path: '/hod/timetable/conflicts', icon: ClipboardList }
          ]
        },
        {
          key: 'semester',
          label: 'Semester',
          icon: Clock,
          path: '/hod/semester',
          roles: ['ROLE_HOD']
        },
        {
          key: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
          roles: ['ROLE_HOD'],
          submenu: [
            { label: 'Department Performance', path: '/hod/analytics/department', icon: TrendingUp },
            { label: 'Teacher Workload', path: '/hod/analytics/workload', icon: Users }
          ]
        }
      ],
      ROLE_TEACHER: [
        {
          key: 'attendance',
          label: 'Attendance',
          icon: Clock,
          roles: ['ROLE_TEACHER', 'ROLE_CA'],
          submenu: [
            { label: 'Mark Attendance', path: '/teacher/attendance/mark', icon: ClipboardList },
            { label: 'QR Attendance', path: '/teacher/attendance/qr', icon: QrCode },
            { label: 'Attendance Reports', path: '/teacher/attendance/reports', icon: FileText }
          ]
        },
        {
          key: 'marks',
          label: 'Marks',
          icon: Award,
          roles: ['ROLE_TEACHER', 'ROLE_CA'],
          submenu: [
            { label: 'Upload Marks', path: '/teacher/marks/upload', icon: Upload },
            { label: 'OEM Board', path: '/teacher/marks/oem', icon: ClipboardList },
            { label: 'Excel Import', path: '/teacher/marks/excel', icon: Download },
            { label: 'Publish Marks', path: '/teacher/marks/publish', icon: Award }
          ]
        },
        {
          key: 'materials',
          label: 'Materials',
          icon: FolderOpen,
          roles: ['ROLE_TEACHER', 'ROLE_CA'],
          submenu: [
            { label: 'Upload Materials', path: '/teacher/materials/upload', icon: Upload },
            { label: 'Manage Materials', path: '/teacher/materials', icon: FolderOpen }
          ]
        },
        {
          key: 'leaves',
          label: 'Leave Requests',
          icon: Mail,
          path: '/teacher/leaves',
          roles: ['ROLE_TEACHER', 'ROLE_CA']
        },
        {
          key: 'classes',
          label: 'My Classes',
          icon: School,
          path: '/teacher/classes',
          roles: ['ROLE_TEACHER', 'ROLE_CA']
        }
      ],
      ROLE_STUDENT: [
        {
          key: 'attendance',
          label: 'Attendance',
          icon: Clock,
          roles: ['ROLE_STUDENT'],
          submenu: [
            { label: 'View Attendance', path: '/student/attendance', icon: ClipboardList },
            { label: 'QR Scan', path: '/student/attendance/scan', icon: QrCode }
          ]
        },
        {
          key: 'marks',
          label: 'Marks',
          icon: Award,
          roles: ['ROLE_STUDENT'],
          submenu: [
            { label: 'View Marks', path: '/student/marks', icon: BarChart3 },
            { label: 'Download Marksheet', path: '/student/marks/download', icon: Download },
            { label: 'Performance Graph', path: '/student/marks/performance', icon: TrendingUp }
          ]
        },
        {
          key: 'timetable',
          label: 'Timetable',
          icon: Calendar,
          path: '/student/timetable',
          roles: ['ROLE_STUDENT']
        },
        {
          key: 'leave',
          label: 'Leave Application',
          icon: Mail,
          path: '/student/leave',
          roles: ['ROLE_STUDENT']
        },
        {
          key: 'materials',
          label: 'Study Materials',
          icon: BookOpen,
          path: '/student/materials',
          roles: ['ROLE_STUDENT']
        }
      ]
    };

    const commonItems = [
      {
        key: 'notifications',
        label: 'Notifications',
        icon: Bell,
        path: '/notifications',
        roles: ['ROLE_PRINCIPAL', 'ROLE_HOD', 'ROLE_TEACHER', 'ROLE_CA', 'ROLE_STUDENT']
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/profile/settings',
        roles: ['ROLE_PRINCIPAL', 'ROLE_HOD', 'ROLE_TEACHER', 'ROLE_CA', 'ROLE_STUDENT']
      }
    ];

    const userItems = roleBasedItems[user?.role] || [];
    return [...baseItems, ...userItems, ...commonItems];
  };

  const navigationItems = getNavigationItems();

  const renderNavItem = (item) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.key];
    const isActive = !hasSubmenu && location.pathname === item.path;
    const isSubmenuActive = hasSubmenu && item.submenu.some(sub => location.pathname === sub.path);

    return (
      <div key={item.key} className="mb-1">
        {hasSubmenu ? (
          <div>
            <button
              onClick={() => toggleSubmenu(item.key)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                isSubmenuActive 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className={`${!sidebarOpen && 'hidden'} transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis`}>
                  {item.label}
                </span>
              </div>
              {sidebarOpen && (
                <div className="transition-transform duration-200">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              )}
            </button>
            
            <AnimatePresence>
              {sidebarOpen && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-8 mt-1 space-y-1 overflow-hidden"
                >
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => toggleMobileMenu && toggleMobileMenu()}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <subItem.icon size={16} />
                      <span className="text-sm">{subItem.label}</span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink
            to={item.path}
            onClick={() => toggleMobileMenu && toggleMobileMenu()}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <item.icon size={20} />
            <span className={`${!sidebarOpen && 'hidden'} transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis`}>
              {item.label}
            </span>
          </NavLink>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <aside className={`
      fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-20 transition-all duration-300
      ${sidebarOpen ? 'w-64' : 'w-20'}
      ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              SMS
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
        {navigationItems.map(renderNavItem)}
      </nav>

      {/* Footer in Sidebar */}
      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;