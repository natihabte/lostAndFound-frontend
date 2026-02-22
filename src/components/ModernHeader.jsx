import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import InlineLanguageSelector from './InlineLanguageSelector';
import { useApp } from '../contexts/AppContext';
import { ROUTES } from '../constants/routes';
import { platformSettingsAPI } from '../services/api';

const ModernHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userRole, currentUser, handleLogout, darkMode, toggleDarkMode, platformSupport } = useApp();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // DEBUG: Log the props being received
  React.useEffect(() => {
    console.log('🔍 ModernHeader Props:', {
      isLoggedIn,
      userRole,
      currentUser,
      userRoleType: typeof userRole,
      currentUserType: typeof currentUser
    });
  }, [isLoggedIn, userRole, currentUser]);

  // Helper function to check if user is admin
  const isAdminUser = () => {
    // Only check userRole prop and currentUser.role
    // Do NOT check localStorage to avoid stale data
    
    // Check userRole prop first
    if (userRole && ['superAdmin', 'admin'].includes(userRole)) {
      return true;
    }
    
    // Check currentUser.role as backup
    if (currentUser?.role && ['superAdmin', 'admin'].includes(currentUser.role)) {
      return true;
    }
    
    // Default to false - user is NOT an admin
    return false;
  };

  // Get current page from location
  const currentPage = location.pathname;
  
  // Check if currently on admin dashboard
  const isOnAdminDashboard = currentPage.startsWith('/admin');

  // Simplified navigation - No dashboard button for admins (they use sidebar)
  const getDashboardButton = () => {
    if (!isLoggedIn) return null;
    
    // Admins don't need dashboard button - they use sidebar navigation
    if (isAdminUser()) {
      return null;
    }
    
    // For regular users: only My Dashboard
    return {
      name: t('navigation.profile'),
      route: ROUTES.PROFILE,
      icon: '👤',
      color: 'blue'
    };
  };

  const dashboardButton = getDashboardButton();

  return (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b fixed top-0 left-0 right-0 z-50 transition-colors`}>
      {/* Platform Banner - Hide only for superAdmin */}
      {platformSupport.enabled && userRole !== 'superAdmin' && (
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{t('app.name')}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4 font-medium">
                <span>📞 Platform Support {platformSupport.phoneNumber}</span>
                <span>🕒 {t('contact.service24x7')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                
              </div>
              <div className="ml-3">
                <button 
                  onClick={() => navigate(isLoggedIn ? ROUTES.HOME : ROUTES.LANDING)}
                  className={`text-xl font-bold ${darkMode ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}
                >
                  {t('app.name')}
                </button>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('app.tagline')}</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Simplified */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Browse Items - Hide for admins */}
            {!isAdminUser() && (
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  currentPage === ROUTES.HOME
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span>📦 {t('navigation.browse')}</span>
              </button>
            )}

            {/* Organizations - Hide for admins */}
            {!isAdminUser() && (
              <button
                onClick={() => navigate(ROUTES.ORGANIZATIONS)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  currentPage === ROUTES.ORGANIZATIONS
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <span>🏢 Organizations</span>
              </button>
            )}

            {/* Dynamic Dashboard Button - Only when logged in */}
            {dashboardButton && (
              <button
                onClick={() => navigate(dashboardButton.route)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                  currentPage === dashboardButton.route
                    ? dashboardButton.color === 'blue'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-purple-700 text-white shadow-md'
                    : dashboardButton.color === 'blue'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                <span>{dashboardButton.icon} {dashboardButton.name}</span>
              </button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Add Item Button */}
                <button
                  onClick={() => navigate(ROUTES.ADD_ITEM)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  
                  <span className="hidden sm:inline">{t('navigation.addItem')}</span>
                </button>
                
                <div className="hidden sm:block text-right">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUser?.name || 'User'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isAdminUser() ? 
                      (userRole === 'hallAdmin' || userRole === 'admin') ? t('navigation.admin') : t('auth.organizationAdmin')
                      : t('pages.member')}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  
                </div>
                <button
                  onClick={handleLogout}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                >
                  {t('navigation.logout')}
                </button>
                
                {/* Language Selector */}
                <InlineLanguageSelector />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
                  title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {t('navigation.login')}
                </button>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  {t('navigation.getStarted')}
                </button>
                
                {/* Language Selector */}
                <InlineLanguageSelector />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
                  title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Simplified */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-2">
            {/* Browse Items - Hide for admins */}
            {!isAdminUser() && (
              <button
                onClick={() => {
                  navigate(ROUTES.HOME);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-base font-medium rounded-lg shadow-sm ${
                  currentPage === ROUTES.HOME
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                📦 {t('navigation.browse')}
              </button>
            )}

            {/* Organizations - Hide for admins */}
            {!isAdminUser() && (
              <button
                onClick={() => {
                  navigate(ROUTES.ORGANIZATIONS);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-base font-medium rounded-lg shadow-sm ${
                  currentPage === ROUTES.ORGANIZATIONS
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                🏢 Organizations
              </button>
            )}

            {/* Dynamic Dashboard Button */}
            {dashboardButton && (
              <button
                onClick={() => {
                  navigate(dashboardButton.route);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-base font-medium rounded-lg shadow-sm ${
                  currentPage === dashboardButton.route
                    ? dashboardButton.color === 'blue'
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'bg-purple-700 text-white shadow-md'
                    : dashboardButton.color === 'blue'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {dashboardButton.icon} {dashboardButton.name}
              </button>
            )}
            
            {/* Mobile Language Selector & Dark Mode */}
            <div className={`px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-2 pt-4`}>
              <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center mb-3`}>
                
                {t('language.select')}
              </div>
              <InlineLanguageSelector className="w-full mb-4" />
              
              {/* Mobile Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {darkMode ? t('theme.darkMode') : t('theme.lightMode')}
                </span>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ModernHeader;