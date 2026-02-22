import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import { User, Lock, Settings as SettingsIcon, Bell, Save, Shield, Mail, Phone } from 'lucide-react';
import { platformSettingsAPI, adminSettingsAPI } from '../../services/api';
import PageHeader from '../../components/PageHeader';

const AdminSettings = ({ defaultTab = 'profile', onBack }) => {
  const { t } = useTranslation();
  const { currentUser, darkMode, handleUpdateProfile } = useApp();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    role: currentUser?.role || 'admin'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    autoApproval: false,
    maxFileSize: '5',
    sessionTimeout: '24'
  });

  // Platform support settings state
  const [platformSupport, setPlatformSupport] = useState({
    enabled: true,
    phoneNumber: '+1-800-555-0123',
    is24x7: true,
    supportEmail: 'support@platform.com',
    flutterAppEnabled: true
  });

  // Validate authentication token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const { authHelpers } = await import('../../services/api');
        const token = authHelpers.getToken();
        const user = authHelpers.getUser();

        // Check if token exists
        if (!token) {
          console.warn('No authentication token found');
          setMessage({ 
            type: 'error', 
            text: 'Authentication required. Please login to continue.' 
          });
          return;
        }

        // Check if user exists
        if (!user) {
          console.warn('No user data found');
          setMessage({ 
            type: 'error', 
            text: 'User information not found. Please login again.' 
          });
          return;
        }

        console.log('✓ Token validation passed:', { 
          hasToken: !!token, 
          userEmail: user.email,
          userRole: user.role 
        });
      } catch (error) {
        console.error('Token validation error:', error);
      }
    };

    validateToken();
  }, []); // Run once on mount

  // Load settings on mount and when currentUser changes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get authentication info
        const { authHelpers } = await import('../../services/api');
        const token = authHelpers.getToken();
        const user = currentUser || authHelpers.getUser();

        // Skip if not authenticated
        if (!token || !user) {
          return; // Silently skip if not authenticated
        }

        // Check if user has admin role
        const adminRoles = ['superAdmin', 'admin'];
        if (!adminRoles.includes(user.role)) {
          return; // Silently skip if not admin
        }

        // Load platform settings
        const platformResponse = await platformSettingsAPI.get();
        if (platformResponse.success && platformResponse.data.support) {
          setPlatformSupport(platformResponse.data.support);
        }

        // Load system settings
        const systemResponse = await adminSettingsAPI.getSystemSettings();
        if (systemResponse.success && systemResponse.data) {
          setSystemSettings(systemResponse.data);
        }
      } catch (error) {
        // Silently handle errors on initial load
        console.error('Failed to load settings:', error);
      }
    };

    // Only load if we have a currentUser or after a short delay to allow auth to load
    if (currentUser) {
      loadSettings();
    } else {
      // Wait a bit for authentication to load
      const timer = setTimeout(loadSettings, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser]); // Re-run when currentUser changes

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log('=== Profile Update Started ===');
    console.log('Profile data:', profileData);
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get authentication info
      const { authHelpers } = await import('../../services/api');
      const token = authHelpers.getToken();
      const user = authHelpers.getUser();

      console.log('Auth check - Token exists:', !!token);
      console.log('Auth check - User:', user);

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      if (!user) {
        throw new Error('User information not found. Please login again.');
      }

      console.log('Calling API to update profile...');
      
      // Use admin settings API
      const response = await adminSettingsAPI.updateProfile(profileData);
      console.log('API Response:', response);
      
      if (response.success) {
        // Update local storage with new user data
        const currentStoredUser = authHelpers.getUser();
        const updatedUser = { ...currentStoredUser, ...response.data };
        authHelpers.saveUser(updatedUser);

        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        console.log('Profile update successful');
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMsg = error.message || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMsg });
      
      // If authentication error, redirect to login after 3 seconds
      if (errorMsg.includes('session has expired') || errorMsg.includes('Authentication required') || errorMsg.includes('401')) {
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
      console.log('=== Profile Update Complete ===');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      // Use admin settings API
      const response = await adminSettingsAPI.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );

      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to change password';
      setMessage({ type: 'error', text: errorMsg });
      
      // If authentication error, redirect to login after 3 seconds
      if (errorMsg.includes('session has expired') || errorMsg.includes('Authentication required') || errorMsg.includes('401')) {
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsUpdate = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await adminSettingsAPI.updateSystemSettings(systemSettings);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'System settings updated successfully!' });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      const errorMsg = error.message || 'Failed to update system settings';
      setMessage({ type: 'error', text: errorMsg });
      
      // If authentication error, redirect to login after 3 seconds
      if (errorMsg.includes('session has expired') || errorMsg.includes('Authentication required') || errorMsg.includes('401')) {
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSettingsUpdate = async () => {
    console.log('=== Save Platform Settings Button Clicked ===');
    console.log('Current platform support state:', platformSupport);
    console.log('Current user prop:', currentUser);
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Use currentUser prop first, fallback to localStorage
      const { authHelpers } = await import('../../services/api');
      const token = authHelpers.getToken();
      const user = currentUser || authHelpers.getUser();

      console.log('Auth check - Token exists:', !!token);
      console.log('Auth check - Token value:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('Auth check - User from prop:', currentUser);
      console.log('Auth check - User from storage:', authHelpers.getUser());
      console.log('Auth check - Final user:', user);

      // Check if token exists
      if (!token) {
        const errorMsg = 'Authentication token not found. Please logout and login again.';
        console.error(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        setLoading(false);
        return;
      }

      // Check if using demo token (won't work with backend)
      if (token.includes('demo-signature')) {
        const errorMsg = 'Demo mode detected. Backend authentication required to save settings. Please login with a real admin account.';
        console.warn(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        setLoading(false);
        return;
      }

      // Check if user exists
      if (!user) {
        const errorMsg = 'User information not found. Please logout and login again.';
        console.error(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
        setLoading(false);
        return;
      }

      // Check admin role
      const adminRoles = ['superAdmin', 'admin'];
      if (!adminRoles.includes(user.role)) {
        const errorMsg = `Access denied. Admin privileges required. Your role: ${user.role}`;
        console.error(errorMsg);
        setMessage({ 
          type: 'error', 
          text: errorMsg
        });
        setLoading(false);
        return;
      }

      console.log('Calling API to update settings...');
      console.log('Request payload:', { support: platformSupport });
      
      const response = await platformSettingsAPI.update({ support: platformSupport });
      console.log('API Response:', response);
      
      if (response.success) {
        const successMsg = 'Platform settings updated successfully! Refreshing page...';
        console.log(successMsg);
        setMessage({ type: 'success', text: successMsg });
        
        // Force reload the page to refresh the banner with new settings
        setTimeout(() => {
          // Clear any cached data
          if ('caches' in window) {
            caches.keys().then(names => {
              names.forEach(name => caches.delete(name));
            });
          }
          // Hard reload
          window.location.reload(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Platform settings update error:', error);
      
      // Handle specific error cases
      let errorMsg = '';
      let actionRequired = '';
      
      if (error.message.includes('401') || error.message.includes('Not authorized') || error.message.includes('invalid token') || error.message.includes('Token expired')) {
        errorMsg = 'Your session has expired or the authentication token is invalid.';
        actionRequired = 'Please logout and login again with a real admin account.';
        
        // Auto-clear token and redirect after 3 seconds
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
      } else if (error.message.includes('403') || error.message.includes('Access denied')) {
        errorMsg = 'Access denied. You need admin privileges to update platform settings.';
        actionRequired = 'Please contact a system administrator.';
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMsg = 'Network error. Unable to connect to the server.';
        actionRequired = 'Please check your internet connection and try again.';
      } else {
        errorMsg = error.message || 'Failed to update platform settings';
        actionRequired = 'Please try again or contact support.';
      }
      
      console.error('Error message:', errorMsg);
      console.error('Action required:', actionRequired);
      
      setMessage({ 
        type: 'error', 
        text: `${errorMsg} ${actionRequired}` 
      });
    } finally {
      setLoading(false);
      console.log('=== Save Platform Settings Complete ===');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Settings' },
    { id: 'security', name: 'Security' },
    { id: 'system', name: 'System Settings' },
    { id: 'platform', name: 'Platform Support' },
    { id: 'notifications', name: 'Notifications' }
  ];

  const renderMessage = () => {
    if (!message.text) return null;

    return (
      <div className={`mb-6 p-4 rounded-lg border ${
        message.type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-700' 
          : 'bg-red-50 border-red-200 text-red-700'
      }`}>
        <div className="flex items-center">
          {message.type === 'success' ? (
            <span className="mr-2">✓</span>
          ) : (
            <span className="mr-2">✕</span>
          )}
          <span>{message.text}</span>
        </div>
      </div>
    );
  };

  const renderProfileSettings = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
        
        Profile Information
      </h3>

      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Email Address
          </label>
          <div className="relative">
            
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Role
          </label>
          <div className="flex items-center">
            
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Administrator
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md disabled:opacity-50 transition-colors ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Save className="mr-2" size={18} />
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
        
        Change Password
      </h3>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Password
          </label>
          <div className="relative">
            
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              {showPasswords.current ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            New Password
          </label>
          <div className="relative">
            
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              minLength="6"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              {showPasswords.new ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Confirm New Password
          </label>
          <div className="relative">
            
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              className={`w-full pl-10 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
              minLength="6"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
              {showPasswords.confirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md disabled:opacity-50 transition-colors ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSystemSettings = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
        
        System Configuration
      </h3>

      <div className="space-y-6">
        {/* Platform Settings */}
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Platform Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Maintenance Mode
                </label>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Temporarily disable the platform for maintenance
                </p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.maintenanceMode}
                onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  User Registration
                </label>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Allow new users to register accounts
                </p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.registrationEnabled}
                onChange={(e) => setSystemSettings({...systemSettings, registrationEnabled: e.target.checked})}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Auto-approve Posts
                </label>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Automatically approve new posts without moderation
                </p>
              </div>
              <input
                type="checkbox"
                checked={systemSettings.autoApproval}
                onChange={(e) => setSystemSettings({...systemSettings, autoApproval: e.target.checked})}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* File Upload Settings */}
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>File Upload Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={systemSettings.maxFileSize}
                onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Session Timeout (hours)
              </label>
              <input
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                min="1"
                max="168"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSystemSettingsUpdate}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md disabled:opacity-50 transition-colors ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
        
        Notification Preferences
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Notifications
            </label>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Receive email alerts for important events
            </p>
          </div>
          <input
            type="checkbox"
            checked={systemSettings.emailNotifications}
            onChange={(e) => setSystemSettings({...systemSettings, emailNotifications: e.target.checked})}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              New User Registrations
            </label>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get notified when new users register
            </p>
          </div>
          <input
            type="checkbox"
            defaultChecked={true}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              New Posts
            </label>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get notified when new posts are submitted
            </p>
          </div>
          <input
            type="checkbox"
            defaultChecked={true}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Reports & Issues
            </label>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get notified about user reports and system issues
            </p>
          </div>
          <input
            type="checkbox"
            defaultChecked={true}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderPlatformSupport = () => {
    // Check if user is authenticated and has admin role
    const adminRoles = ['superAdmin', 'admin'];
    const isAdmin = currentUser && adminRoles.includes(currentUser.role);

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
          <Phone className="mr-2" size={20} />
          Platform Support Configuration
        </h3>

        {/* Authentication Warning */}
        {!isAdmin && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">
                  Admin Access Required
                </h4>
                <p className="text-sm text-yellow-700">
                  You need to be logged in as an admin (superAdmin or admin) to view and update platform settings.
                  {currentUser ? ` Your current role: ${currentUser.role}` : ' Please login first.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Token Error Warning - Show when there's an auth error */}
        {message.type === 'error' && message.text.includes('session has expired') && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <Shield className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Authentication Required
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Your session has expired. Please logout and login again to continue.
                  </p>
                  <button
                    onClick={() => {
                      // Clear auth
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      // Redirect to login
                      window.location.href = '/login';
                    }}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    Logout & Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Support Banner Settings */}
          <div>
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Support Banner</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enable Support Banner
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Display support information banner at the top of the platform
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={platformSupport.enabled}
                  onChange={(e) => setPlatformSupport({...platformSupport, enabled: e.target.checked})}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={!isAdmin}
                />
              </div>

              <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Support Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="tel"
                  value={platformSupport.phoneNumber}
                  onChange={(e) => setPlatformSupport({...platformSupport, phoneNumber: e.target.value})}
                  placeholder="+1-800-555-0123"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  disabled={!isAdmin}
                />
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                This number will be displayed in the support banner
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  24/7 Service
                </label>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Indicate that support is available 24 hours a day, 7 days a week
                </p>
              </div>
              <input
                type="checkbox"
                checked={platformSupport.is24x7}
                onChange={(e) => setPlatformSupport({...platformSupport, is24x7: e.target.checked})}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Support Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="email"
                  value={platformSupport.supportEmail}
                  onChange={(e) => setPlatformSupport({...platformSupport, supportEmail: e.target.value})}
                  placeholder="support@platform.com"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  disabled={!isAdmin}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flutter App Settings */}
        <div>
          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Mobile App (Flutter)</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enable Flutter App Support
                </label>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Allow mobile app connections and API access for Flutter applications
                </p>
              </div>
              <input
                type="checkbox"
                checked={platformSupport.flutterAppEnabled}
                onChange={(e) => setPlatformSupport({...platformSupport, flutterAppEnabled: e.target.checked})}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                disabled={!isAdmin}
              />
            </div>

            {platformSupport.flutterAppEnabled && (
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <strong>Flutter App Status:</strong> Enabled
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Mobile applications can now connect to the platform API. Make sure to configure proper authentication and rate limiting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        {platformSupport.enabled && (
          <div>
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Banner Preview</h4>
            <div className="bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span className="text-sm font-medium">
                  Platform Support: {platformSupport.phoneNumber}
                </span>
              </div>
              {platformSupport.is24x7 && (
                <div className="flex items-center">
                  <span className="text-sm font-medium">⏰ 24/7 Service</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end items-center gap-3 pt-4">
          {/* Token Status Indicator */}
          <div className="flex items-center text-sm">
            {(() => {
              const token = localStorage.getItem('token');
              if (!token) {
                return (
                  <span className="flex items-center text-red-600">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    No Token
                  </span>
                );
              }
              return (
                <span className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Authenticated
                </span>
              );
            })()}
          </div>

          <button
            onClick={handlePlatformSettingsUpdate}
            disabled={loading || !isAdmin}
            className={`flex items-center px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title={!isAdmin ? 'Admin access required' : ''}
          >
            <Save className="mr-2" size={18} />
            {loading ? 'Saving...' : 'Save Platform Settings'}
          </button>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Back Button */}
        <PageHeader
          title="Admin Settings"
          subtitle="Manage your account and system configuration"
          onBack={onBack}
          darkMode={darkMode}
          showBackButton={!!onBack}
        />

        {/* Message Display */}
        {renderMessage()}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                    }`}
                  >
                    
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && renderProfileSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'system' && renderSystemSettings()}
          {activeTab === 'platform' && renderPlatformSupport()}
          {activeTab === 'notifications' && renderNotificationSettings()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
