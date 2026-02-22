import React, { useState, useEffect } from 'react';
import { Phone, Clock } from 'lucide-react';
import { platformSettingsAPI } from '../services/api';
import { useApp } from '../contexts/AppContext';
import { useTranslation } from 'react-i18next';


const PlatformSupportBanner = () => {
  const { darkMode, userRole, currentUser } = useApp();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is superAdmin
  const isSuperAdmin = userRole === 'superAdmin' || currentUser?.role === 'superAdmin';
   const { t } = useTranslation();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Add timestamp to prevent caching
        const response = await platformSettingsAPI.getPublic();
        console.log('PlatformSupportBanner - API Response:', response);
        if (response.success && response.data) {
          console.log('PlatformSupportBanner - Settings loaded:', response.data);
          setSettings(response.data);
        }
      } catch (error) {
        console.error('PlatformSupportBanner - Load error:', error);
        // Silently fail - backend may not be running or settings not configured
        // This is expected behavior and not an error
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  if (loading || !settings || !settings.enabled || isSuperAdmin) {
    return null;
  }

  console.log('PlatformSupportBanner - Rendering with phone:', settings.phoneNumber);

  return (
    <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{t('app.name')}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 font-medium">
                <span>📞Platform Support {settings.phoneNumber}</span>
                <span>🕒 {t('contact.service24x7')}</span>
              </div>
            </div>
          </div>
        </div>
  );
};

export default PlatformSupportBanner;
