import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Sun, Moon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ROUTES } from '../constants/routes';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

const ModernAuth = () => {
  const navigate = useNavigate();
  const { handleLogin, darkMode, toggleDarkMode } = useApp();
  const { t } = useTranslation();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        if (!acceptedTerms) {
          setError(t('auth.acceptTerms'));
          setLoading(false);
          return;
        }
        
        const { authAPI } = await import('../services/api');
        const response = await authAPI.register(formData);
        setShowVerification(true);
        setSuccess(t('messages.registrationSuccess'));
      } else {
        const { authAPI, authHelpers } = await import('../services/api');
        const response = await authAPI.login(formData.email, formData.password);
        
        authHelpers.saveToken(response.token);
        authHelpers.saveUser(response.user);
        
        setSuccess(t('messages.loginSuccess'));
        await handleLogin(response.user.role, response.user);
        
        // Navigate based on user role - redirect admins to admin dashboard
        if (response.user.role === 'superAdmin' || response.user.role === 'admin' || 
            response.user.role === 'hallAdmin' || response.user.role === 'orgAdmin') {
          navigate(ROUTES.ADMIN);
        } else {
          navigate(ROUTES.HOME);
        }
      }
    } catch (err) {
      const errorMessage = err.message || t('messages.errorOccurred');
      setError(errorMessage);
      
      // Show verification UI if email not verified
      if (errorMessage.includes('verify your email')) {
        setShowVerification(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI, authHelpers } = await import('../services/api');
      const response = await authAPI.verify(formData.email, verificationCode);
      
      authHelpers.saveToken(response.token);
      authHelpers.saveUser(response.user);
      
      setSuccess('Email verified successfully!');
      await handleLogin(response.user.role, response.user);
      
      // Navigate based on user role - redirect admins to admin dashboard
      if (response.user.role === 'superAdmin' || response.user.role === 'admin' || 
          response.user.role === 'hallAdmin' || response.user.role === 'orgAdmin') {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (err) {
      setError(err.message || t('auth.invalidVerificationCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI } = await import('../services/api');
      await authAPI.forgotPassword(resetEmail);
      setShowResetPassword(true);
      setSuccess(t('messages.passwordResetSent'));
    } catch (err) {
      setError(err.message || t('auth.failedToSendResetCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(t('auth.passwordMinLength'));
      setLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('../services/api');
      await authAPI.resetPassword(resetEmail, resetCode, newPassword);
      setSuccess(t('messages.passwordResetSuccess'));
      
      // Reset states
      setShowForgotPassword(false);
      setShowResetPassword(false);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || t('auth.failedToResetPassword'));
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Form
  if (showForgotPassword && !showResetPassword) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
        
        {/* Dark/Light Mode Toggle - Fixed Position */}
        <button
          onClick={toggleDarkMode}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
            darkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
          title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`h-16 w-16 ${darkMode ? 'bg-red-900' : 'bg-red-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.resetPassword')}</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>{t('auth.enterEmailAddress')}</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.emailAddress')}</label>
                <div className="relative">
                  
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-red-500 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-red-500 placeholder-gray-500'
                    }`}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
                </div>
              )}

              {success && (
                <div className={`${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.sending') : t('auth.sendResetCode')}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className={`w-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-sm`}
              >
                {t('auth.backToSignIn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 to-teal-100'} flex items-center justify-center px-4`}>
        
        {/* Dark/Light Mode Toggle - Fixed Position */}
        <button
          onClick={toggleDarkMode}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
            darkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
          title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`h-16 w-16 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.createNewPassword')}</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>{t('auth.enterCodeSentTo')} {resetEmail}</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.resetCode')}</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:border-transparent ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:ring-green-500 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-green-500 placeholder-gray-500'
                  }`}
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.newPassword')}</label>
                <div className="relative">
                  
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-green-500 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-green-500 placeholder-gray-500'
                    }`}
                    placeholder={t('auth.enterNewPassword')}
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.confirmPassword')}</label>
                <div className="relative">
                  
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-green-500 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-green-500 placeholder-gray-500'
                    }`}
                    placeholder={t('auth.confirmNewPassword')}
                    minLength="6"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
                </div>
              )}

              {success && (
                <div className={`${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.resetting') : t('auth.resetPassword')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setShowForgotPassword(false);
                }}
                className={`w-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-sm`}
              >
                {t('auth.backToSignIn')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Verification Form
  if (showVerification) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
        
        {/* Dark/Light Mode Toggle - Fixed Position */}
        <button
          onClick={toggleDarkMode}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
            darkMode 
              ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
          title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`h-16 w-16 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              📧
            </div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('auth.verifyEmail')}</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>{t('auth.verificationSentTo')} {formData.email}</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.verificationCode')}</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:border-transparent ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                  }`}
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              {error && (
                <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
                </div>
              )}

              {success && (
                <div className={`${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.verifying') : t('auth.verifyEmail')}
              </button>

              {/* Resend Code Button */}
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { authAPI } = await import('../services/api');
                    await authAPI.resendCode(formData.email);
                    setSuccess(t('auth.newVerificationCodeSent'));
                    setError('');
                  } catch (err) {
                    setError(err.message || t('auth.failedToResendCode'));
                    setSuccess('');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-gray-600 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.sending') : t('auth.resendVerificationCode')}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className={`w-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} text-sm`}
              >
                {t('auth.backToRegistration')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Auth Form
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
      
      {/* Dark/Light Mode Toggle - Fixed Position */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
          darkMode 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
        title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isRegister ? t('auth.createAccount') : t('auth.publicSectorPortal')}
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            {isRegister 
              ? t('auth.createAccountDescription')
              : t('auth.signInToAccount')
            }
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          {/* Tab Switcher */}
          <div className={`flex mb-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-1`}>
            <button
              onClick={() => {
                setIsRegister(false);
                setAcceptedTerms(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isRegister 
                  ? `${darkMode ? 'bg-gray-600 text-blue-400' : 'bg-white text-blue-600'} shadow-sm`
                  : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setAcceptedTerms(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isRegister 
                  ? `${darkMode ? 'bg-gray-600 text-blue-400' : 'bg-white text-blue-600'} shadow-sm`
                  : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`
              }`}
            >
              {t('auth.signUp')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.fullName')}</label>
                <div className="relative">
                  
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                    }`}
                    placeholder={t('auth.fullNamePlaceholder')}
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.emailAddress')}</label>
              <div className="relative">
                
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.password')}</label>
              <div className="relative">
                
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                  }`}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isRegister && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}
            </div>

            {isRegister && (
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{t('auth.phoneNumber')}</label>
                <div className="relative">
                  
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 placeholder-gray-400' 
                        : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                    }`}
                    placeholder={t('auth.phoneNumberPlaceholder')}
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('auth.agreeToThe')}{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsOfService(true)}
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline font-medium`}
                  >
                    {t('legal.termsOfService')}
                  </button>
                  {' '}{t('auth.and')}{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyPolicy(true)}
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline font-medium`}
                  >
                    {t('legal.privacyPolicy')}
                  </button>
                </label>
              </div>
            )}

            {error && (
              <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl p-4`}>
                <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            {success && (
              <div className={`${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isRegister && !acceptedTerms)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('auth.pleaseWait') : (isRegister ? t('auth.createAccount') : t('auth.signIn'))}
            </button>
          </form>

          {/* Organization Registration */}
          <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center mb-3`}>
              {t('auth.publicSectorQuestion')}
            </p>
            <button
              onClick={() => navigate(ROUTES.PUBLIC_SECTOR_REGISTRATION)}
              className={`w-full py-3 px-6 border-2 rounded-xl font-medium transition-colors flex items-center justify-center ${
                darkMode 
                  ? 'border-blue-500 text-blue-400 hover:bg-blue-900/20' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              
              {t('auth.registerOrganization')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Legal Modals */}
      {showPrivacyPolicy && (
        <PrivacyPolicy 
          onClose={() => setShowPrivacyPolicy(false)}
          darkMode={darkMode}
        />
      )}

      {showTermsOfService && (
        <TermsOfService 
          onClose={() => setShowTermsOfService(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default ModernAuth;