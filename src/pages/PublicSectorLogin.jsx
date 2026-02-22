import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, Building2, User, Sun, Moon, AlertCircle, CheckCircle } from 'lucide-react';

const PublicSectorLogin = ({ handleLogin, setCurrentPage, darkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user'); // 'user' or 'organization'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Language options
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'ti', label: 'ትግርኛ', flag: '🇪🇹' }
  ];

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { authAPI, authHelpers } = await import('../services/api');
      const response = await authAPI.login(formData.email, formData.password);
      
      // Save token and user
      authHelpers.saveToken(response.token);
      authHelpers.saveUser(response.user);
      
      // Call parent login handler
      handleLogin(response.user.role, response.user);
      
    } catch (err) {
      setErrors({ 
        submit: err.message || 'Login failed. Please check your credentials and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} flex items-center justify-center px-4 py-12`}>
      
      {/* Dark/Light Mode Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 border border-gray-700' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
          aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
          title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('auth.publicSectorPortal')}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('auth.lostFoundManagement')}
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  i18n.language === lang.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                title={lang.label}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          
          {/* Login Type Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setLoginType('user')}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                loginType === 'user'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                {t('auth.userLogin')}
              </div>
            </button>
            <button
              onClick={() => setLoginType('organization')}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${
                loginType === 'organization'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : darkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <Building2 className="h-4 w-4 mr-2" />
                {t('auth.organizationAdmin')}
              </div>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {loginType === 'organization' ? t('auth.organizationEmail') : t('auth.emailAddress')} <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder={loginType === 'organization' ? t('auth.organizationEmailPlaceholder') : t('auth.emailPlaceholder')}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {t('auth.emailRequired')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t('auth.password')} <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.password ? 'border-red-500' : ''}`}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  {t('auth.passwordRequired')}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('auth.rememberMe')}
                </label>
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage('forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('auth.signingIn')}
                </>
              ) : (
                <>
                  {t('auth.signIn')}
                  <LogIn className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                {t('auth.newToPlatform')}
              </span>
            </div>
          </div>

          {/* Registration Links */}
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('public-sector-registration')}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all border-2 flex items-center justify-center ${
                darkMode
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <Building2 className="h-5 w-5 mr-2" />
              {t('auth.registerOrganization')}
            </button>
            
            <button
              onClick={() => setCurrentPage('register')}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('auth.createUserAccount')}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            <span>{t('auth.secureLogin')}</span>
          </div>
          <p>
            {t('auth.securityProtocols')}
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            By signing in, you agree to our{' '}
            <button 
              onClick={() => setCurrentPage('terms')}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              {t('legal.termsOfService')}
            </button>
            {' '}{t('auth.and')}{' '}
            <button 
              onClick={() => setCurrentPage('privacy')}
              className="text-blue-600 hover:text-blue-500 underline"
            >
              {t('legal.privacyPolicy')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicSectorLogin;
