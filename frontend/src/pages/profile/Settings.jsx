import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  User, 
  Smartphone,
  Globe,
  Palette
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Switch from '../../components/Forms/Switch';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    publicProfile: true,
    twoFactorAuth: false,
    language: 'en'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary-600" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and application settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Tabs (Simulated) */}
        <div className="space-y-1">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon },
            { id: 'profile', label: 'Profile Privacy', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'appearance', label: 'Appearance', icon: Palette }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tab.id === 'general' 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          <Card title="General Preferences" icon={<Globe size={18} className="text-primary-600" />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                    {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Enable dark theme for the application</p>
                  </div>
                </div>
                <Switch checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Language</h4>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                  </div>
                </div>
                <select 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Notifications" icon={<Bell size={18} className="text-primary-600" />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive system updates via email</p>
                </div>
                <Switch checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive alerts on your device</p>
                </div>
                <Switch checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
              </div>
            </div>
          </Card>

          <Card title="Security" icon={<Shield size={18} className="text-primary-600" />}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch checked={settings.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  Deactivate Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
