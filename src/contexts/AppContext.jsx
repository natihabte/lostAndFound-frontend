import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userRole, setUserRole] = useState('guest');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { authHelpers } = await import('../services/api');
      if (authHelpers.isAuthenticated()) {
        const user = authHelpers.getUser();
        if (user) {
          setIsLoggedIn(true);
          
          // Map old roles to new roles for backward compatibility
          let userRole = user.role;
          if (userRole === 'hallAdmin') {
            userRole = 'superAdmin';
            user.role = 'superAdmin';
            authHelpers.saveUser(user);
          } else if (userRole === 'orgAdmin') {
            userRole = 'admin';
            user.role = 'admin';
            authHelpers.saveUser(user);
          }
          
          setUserRole(userRole);
          setCurrentUser(user);
        }
      }
    };
    checkAuth();
  }, []);

  // Apply dark mode and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogin = useCallback(async (role, user) => {
    const { authHelpers } = await import('../services/api');
    
    // Map old roles to new roles for backward compatibility
    let finalRole = role;
    if (role === 'hallAdmin') {
      finalRole = 'superAdmin';
    } else if (role === 'orgAdmin') {
      finalRole = 'admin';
    }
    
    // Update user role in the user object if it was mapped
    if (finalRole !== user.role) {
      user = { ...user, role: finalRole };
      authHelpers.saveUser(user);
    }
    
    setUserRole(finalRole);
    setCurrentUser(user);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(async () => {
    const { authHelpers } = await import('../services/api');
    authHelpers.removeToken();
    authHelpers.removeUser();
    setUserRole('guest');
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // Redirect to home page after logout
    window.location.href = '/';
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleUpdateProfile = useCallback(async (profileData) => {
    try {
      const { usersAPI, authHelpers } = await import('../services/api');
      const response = await usersAPI.updateProfile(profileData);
      
      // Update current user in state and localStorage
      const updatedUser = response.data;
      authHelpers.saveUser(updatedUser);
      setCurrentUser(updatedUser);
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }, []);

  const value = {
    userRole,
    setUserRole,
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    items,
    setItems,
    users,
    setUsers,
    darkMode,
    setDarkMode,
    toggleDarkMode,
    loading,
    setLoading,
    handleLogin,
    handleLogout,
    handleUpdateProfile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
