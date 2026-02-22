import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ModernHeader from '../components/ModernHeader';
import PlatformSupportBanner from '../components/PlatformSupportBanner';
import { LoadingState } from '../components/EmptyStates';
import { useTranslation } from 'react-i18next';

const AppLayout = () => {
  const location = useLocation();
  const { darkMode, userRole } = useApp();
  const { t } = useTranslation();
  
  // Don't show header on login page
  const showHeader = location.pathname !== '/login';
  // Don't show footer for admin users on home page (admin layout handles its own layout)
  const isAdminUser = userRole === 'superAdmin' || userRole === 'admin';
  const showFooter = showHeader && !(isAdminUser && location.pathname === '/');

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Platform Support Banner */}
      {/* <PlatformSupportBanner /> */}
      
      {/* Header */}
      {showHeader && <ModernHeader />}

      {/* Main Content */}
      <main id="main-content" className={`focus:outline-none min-h-screen ${showHeader ? 'pt-16' : ''} ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`} tabIndex="-1">
        <Suspense fallback={<LoadingState message={t('common.loading')} />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className="font-bold text-gray-900 dark:text-white">{t('app.name')}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('footer.description')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.quickLinks')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('navigation.browse')}</a></li>
                  <li><a href="/items/add" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.postItem')}</a></li>
                  <li><a href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.myAccount')}</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('footer.support')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="text-gray-600 dark:text-gray-300">{t('contact.platformSupport')}</span></li>
                  <li><span className="text-gray-600 dark:text-gray-300">{t('footer.email')}</span></li>
                  <li><span className="text-gray-600 dark:text-gray-300">{t('footer.available24x7')}</span></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('footer.copyright')} | 
                <a href="/privacy" className="ml-1 hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  {t('legal.privacyPolicy')}
                </a> | 
                <a href="/terms" className="ml-1 hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  {t('legal.termsOfService')}
                </a>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
