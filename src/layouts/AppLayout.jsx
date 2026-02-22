import React, { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import ModernHeader from '../components/ModernHeader';
import PlatformSupportBanner from '../components/PlatformSupportBanner';
import { LoadingState } from '../components/EmptyStates';
import { useTranslation } from 'react-i18next';
import { Home, Users, Building2, BarChart3, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { ROUTES } from '../constants/routes';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, userRole, currentUser, platformSupport } = useApp();
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    adminDashboard: true
  });
  
  // Check if user is admin
  const isAdmin = userRole === 'superAdmin' || userRole === 'admin';
  
  // Show sidebar only for admin users on root path or profile
  const showAdminSidebar = isAdmin && (location.pathname === '/' || location.pathname === '/profile');
  
  // Check if platform banner should be shown (not for super admin)
  const showPlatformBanner = userRole !== 'superAdmin';
  
  // Calculate header height based on whether banner is shown
  const headerHeight = showPlatformBanner ? 'top-24' : 'top-16'; // 96px with banner, 64px without
  const contentPadding = showPlatformBanner ? 'pt-24' : 'pt-16';
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if current path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if current path starts with
  const isActiveSection = (path) => {
    return location.pathname.startsWith(path);
  };

  // Sidebar navigation items for admin
  const navigationItems = [
    {
      id: 'home',
      label: 'My Profile',
      icon: Home,
      path: '/',
      active: location.pathname === '/' || isActive('/admin/user-settings')
    },
    {
      id: 'adminDashboard',
      label: 'Admin Dashboard',
      icon: Shield,
      path: ROUTES.ADMIN,
      active: location.pathname === '/admin' || (isActiveSection('/admin') && location.pathname !== '/' && location.pathname !== '/admin/user-settings'),
      expandable: true,
      expanded: expandedSections.adminDashboard,
      children: [
        {
          id: 'organizations',
          label: 'Organizations',
          icon: Building2,
          path: ROUTES.ADMIN_ORGANIZATIONS,
          active: isActive(ROUTES.ADMIN_ORGANIZATIONS)
        },
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          path: ROUTES.ADMIN_USERS,
          active: isActive(ROUTES.ADMIN_USERS)
        },
        {
          id: 'systemReports',
          label: 'System Reports',
          icon: BarChart3,
          path: ROUTES.ADMIN_REPORTS,
          active: isActive(ROUTES.ADMIN_REPORTS)
        }
      ]
    }
  ];

  // Render navigation item
  const renderNavItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.expanded;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren && item.expandable) {
              if (item.path) {
                navigate(item.path);
                toggleSection(item.id);
              } else {
                toggleSection(item.id);
              }
            } else if (item.path) {
              navigate(item.path);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            level === 0 ? 'mb-1' : 'mb-0.5'
          } ${
            item.active
              ? 'bg-blue-600 text-white shadow-md'
              : darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${(level * 16) + 16}px` }}
        >
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-3" />}
            <span>{item.label}</span>
          </div>
          {hasChildren && item.expandable && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Platform Support Banner */}
      {/* <PlatformSupportBanner /> */}
      
      {/* Header - Now shown on all pages */}
      <ModernHeader />

      <div className="flex">
        {/* Admin Sidebar - Only shown for admin users on root/profile */}
        {showAdminSidebar && (
          <div className={`w-64 fixed left-0 ${headerHeight} bottom-0 z-40 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col overflow-hidden`}>
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto pt-6">
              {navigationItems.map(item => renderNavItem(item))}
            </nav>

            {/* User Info */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUser?.name || 'Admin'}
                  </p>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentUser?.email || 'admin@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className={`focus:outline-none min-h-screen ${contentPadding} ${showAdminSidebar ? 'ml-64 flex justify-center' : ''} ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`} tabIndex="-1">
          <Suspense fallback={<LoadingState message={t('common.loading')} />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Footer - Now shown on all pages except for super admin */}
      {userRole !== 'superAdmin' && (
        <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto ${showAdminSidebar ? 'ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('app.name')}</span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('footer.description')}
                </p>
              </div>
              
              <div>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('footer.quickLinks')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/home" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('navigation.browse')}</a></li>
                  <li><a href="/items/add" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('footer.postItem')}</a></li>
                  <li><a href="/profile" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('footer.myAccount')}</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('footer.support')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{t('contact.platformSupport')}</span></li>
                  <li><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>📞 {platformSupport.phoneNumber}</span></li>
                  <li><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>🕒 {platformSupport.is24x7 ? t('contact.service24x7') : t('contact.businessHours')}</span></li>
                </ul>
              </div>
            </div>
            
            <div className={`border-t pt-6 mt-6 text-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('footer.copyright')} | 
                <a href="/privacy" className={`ml-1 hover:underline transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  {t('legal.privacyPolicy')}
                </a> | 
                <a href="/terms" className={`ml-1 hover:underline transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
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
