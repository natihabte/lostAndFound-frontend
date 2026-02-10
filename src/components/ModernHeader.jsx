import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Settings, Shield, Sun, Moon } from 'lucide-react';
import InlineLanguageSelector from './InlineLanguageSelector';

const ModernHeader = ({ 
  currentPage, 
  setCurrentPage, 
  isLoggedIn, 
  userRole, 
  currentUser,
  handleLogout,
  searchTerm,
  setSearchTerm,
  darkMode,
  setDarkMode
}) => {
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
    // Check userRole prop first
    if (userRole && ['admin', 'hallAdmin', 'orgAdmin', 'org_admin'].includes(userRole)) {
      return true;
    }
    
    // Check currentUser.role as backup
    if (currentUser?.role && ['admin', 'hallAdmin', 'orgAdmin', 'org_admin'].includes(currentUser.role)) {
      return true;
    }
    
    // Check localStorage as final backup
    try {
      const storedUser = localStorage.getItem('user');
      const storedRole = localStorage.getItem('userRole');
      
      if (storedRole && ['admin', 'hallAdmin', 'orgAdmin', 'org_admin'].includes(storedRole)) {
        return true;
      }
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role && ['admin', 'hallAdmin', 'orgAdmin', 'org_admin'].includes(userData.role)) {
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking localStorage for admin role:', error);
    }
    
    return false;
  };

  const navigation = [
    { name: t('navigation.browse'), page: 'home', guest: true },
    { name: t('navigation.profile'), page: 'profile', guest: false },
  ];

  // Organizations as primary navigation item
  const organizationsNav = { name: 'Organizations', page: 'organizations', guest: true, primary: true };

  // Add user settings for non-admin users, admin settings for admin users
  const settingsNavigation = isAdminUser() ? [
    { name: t('admin.settings.title'), page: 'admin-settings', guest: false },
  ] : [
    { name: t('pages.userSettings'), page: 'user-settings', guest: false },
  ];

  // Add admin navigation if user is admin, hallAdmin, or orgAdmin
  const adminNavigation = isAdminUser() ? [
    { name: t('admin.dashboard.title'), page: 'admin', guest: false },
    { name: 'Organizations', page: 'admin-organizations', guest: false },
    { name: 'Orders', page: 'admin-orders', guest: false },
    { name: 'Simple Orders', page: 'simple-admin-orders', guest: false },
    { name: 'Reports', page: 'admin-reports', guest: false },
  ] : [];

  const allNavigation = [...navigation, ...adminNavigation, ...settingsNavigation]
    .filter((item, index, self) => 
      index === self.findIndex(t => t.page === item.page)
    ); // Remove duplicates by page

  return (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-50 transition-colors`}>
      {/* Platform Banner */}
      <div className="bg-blue-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              
              <span className="font-medium">{t('app.name')}</span>
              
              {/* Quick Organizations Access */}
              <button
                onClick={() => setCurrentPage('organizations')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded-full text-xs font-medium transition-colors"
              >
                
                <span>Organizations</span>
              </button>
              
              {/* DEBUG: Show user role */}
              {isLoggedIn && (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  isAdminUser()
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {isAdminUser() ? 'ADMIN MODE' : 'USER MODE'}
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>📞 {t('contact.platformSupport')}</span>
              <span>🕒 {t('contact.service24x7')}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                🌐 {t('language.select')}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                  onClick={() => setCurrentPage(isLoggedIn ? 'home' : 'landing')}
                  className={`text-xl font-bold ${darkMode ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}
                >
                  {t('app.name')}
                </button>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t('app.tagline')}</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 overflow-hidden">
            {/* Primary Organizations Button */}
            <button
              onClick={() => setCurrentPage('organizations')}
              className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-lg transition-all mr-4 ${
                currentPage === 'organizations'
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : darkMode 
                    ? 'bg-gray-700 text-green-400 hover:bg-green-600 hover:text-white border border-green-500' 
                    : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-300'
              }`}
            >
              <span className="font-bold">ORGANIZATIONS</span>
            </button>

            {/* Other Navigation Items */}
            {navigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={`${item.page}-${item.name}`}
                  onClick={() => setCurrentPage(item.page)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                  }`}
                >
                  
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}

            {/* Admin Navigation */}
            {adminNavigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={`admin-${item.page}-${item.name}`}
                  onClick={() => setCurrentPage(item.page)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    currentPage === item.page
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`
                  }`}
                >
                  
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Add Item Button */}
                <button
                  onClick={() => setCurrentPage('add-item')}
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
                  onClick={() => setDarkMode(!darkMode)}
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
                  onClick={() => setCurrentPage('login')}
                  className={`text-sm font-medium ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                >
                  {t('navigation.login')}
                </button>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('navigation.getStarted')}
                </button>
                
                {/* Language Selector */}
                <InlineLanguageSelector />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
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

            {/* Mobile Organizations Button */}
            <button
              onClick={() => setCurrentPage('organizations')}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                currentPage === 'organizations'
                  ? 'bg-green-600 text-white'
                  : darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-green-600' 
                    : 'text-gray-600 hover:text-white hover:bg-green-600'
              }`}
              title="Organizations"
            >
              
            </button>

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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Prominent Organizations Button for Mobile */}
            <button
              onClick={() => {
                setCurrentPage('organizations');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-lg font-bold rounded-lg mb-3 ${
                currentPage === 'organizations'
                  ? 'bg-green-600 text-white shadow-lg'
                  : darkMode 
                    ? 'bg-gray-700 text-green-400 hover:bg-green-600 hover:text-white border border-green-500' 
                    : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-300'
              }`}
            >
              ORGANIZATIONS
            </button>

            {/* Other Navigation Items */}
            {navigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={`mobile-${item.page}-${item.name}`}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-700'
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                  }`}
                >
                  
                  {item.name}
                </button>
              );
            })}

            {/* Admin Navigation for Mobile */}
            {adminNavigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={`mobile-admin-${item.page}-${item.name}`}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    currentPage === item.page
                      ? 'bg-purple-50 text-purple-700'
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-purple-700' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`
                  }`}
                >
                  
                  {item.name}
                </button>
              );
            })}
            
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
                  onClick={() => setDarkMode(!darkMode)}
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