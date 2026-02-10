import React, { useState, useRef, useEffect } from 'react';
const AccessibleNavigation = ({ 
  currentPage, 
  setCurrentPage, 
  isLoggedIn, 
  userRole, 
  currentUser,
  handleLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navigation = [
    { 
      name: 'Home', 
      page: 'landing',
      guest: true,
      priority: true
    },
    { 
      name: 'Browse Items', 
      page: 'home',
      guest: true,
      description: 'Search and browse lost and found items'
    },
    { 
      name: 'My Dashboard', 
      page: 'profile',
      guest: false,
      description: 'View your posts and account settings'
    }
  ];

  const userMenuItems = [
    { name: 'Dashboard', page: 'profile' },
    { name: 'Settings', page: 'settings' },
    { name: 'Sign Out', action: handleLogout }
  ];

  const handleNavigation = (page, requiresAuth = false) => {
    if (requiresAuth && !isLoggedIn) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      {/* University Banner */}
      <div className="bg-blue-600 text-white py-2" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              
              <span className="font-medium">Public Sector Lost & Found Service</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>📞 Platform Support: +1-800-555-0123</span>
              <span>🕒 Available 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => handleNavigation(isLoggedIn ? 'home' : 'landing')}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
                aria-label="Go to homepage"
              >
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Public Sector Lost & Found</h1>
                  <p className="text-xs text-gray-500">Management SaaS Platform</p>
                </div>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.page, false)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  aria-describedby={`${item.page}-description`}
                >
                  {item.name}
                  <span id={`${item.page}-description`} className="sr-only">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* User Menu and Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Post Item Button */}
                <button
                  onClick={() => handleNavigation('add-item')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Post a new lost or found item"
                >
                  
                  <span className="hidden sm:inline">Post Item</span>
                  <span className="sm:hidden">Post</span>
                </button>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userRole === 'admin' ? 'Administrator' : 
                         userRole === 'org_admin' ? 'Organization Admin' : 
                         'Member'}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                      
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {userMenuItems.map((item) => {
                        
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              if (item.action) {
                                item.action();
                              } else {
                                handleNavigation(item.page);
                              }
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                          >
                            
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleNavigation('login')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" ref={mobileMenuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.filter(item => item.guest || isLoggedIn).map((item) => {

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.page, false)}
                  className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    currentPage === item.page
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  
                  {item.name}
                </button>
              );
            })}
            
            {/* Mobile User Actions */}
            {isLoggedIn && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                {userMenuItems.map((item) => {
                  
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          handleNavigation(item.page);
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      
                      {item.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50"
      >
        Skip to main content
      </a>
    </nav>
  );
};

export default AccessibleNavigation;