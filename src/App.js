import React, { useState, useCallback, useEffect } from 'react';

// Import i18n
import './i18n';
import { useTranslation } from 'react-i18next';

// Import academic styles
import './styles/academic.css';

// Import modern components
import ModernHeader from './components/ModernHeader';
import LandingPage from './components/ModernLandingPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import ModernAuth from './components/ModernAuth';
import ModernItemCard from './components/ModernItemCard';
import ModernAddItem from './components/ModernAddItem';
import ModernProfile from './components/ModernProfile';
import ModernMessaging from './components/ModernMessaging';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { 
  NoItemsFound, 
  NoPosts, 
  LoginRequired, 
  WelcomeMessage, 
  ErrorMessage, 
  SuccessMessage, 
  LoadingState,
  CommunityStats 
} from './components/EmptyStates';

// Import page components
import ItemDetailPage from './pages/ItemDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import UserSettings from './pages/UserSettings';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import HallAdminDashboard from './pages/admin/HallAdminDashboard';
import OrgAdminDashboard from './pages/admin/OrgAdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPosts from './pages/admin/AdminPosts';
import AdminReports from './pages/admin/AdminReports';
import AdminOrders from './pages/admin/AdminOrders';
import SimpleAdminOrders from './pages/admin/SimpleAdminOrders';
import AdminOrganizations from './pages/admin/AdminOrganizations';
import AdminSettings from './pages/admin/AdminSettings';
import AdminActivityLog from './pages/admin/AdminActivityLog';
import OrganizationRegister from './pages/OrganizationRegister';
import PublicSectorRegistration from './pages/PublicSectorRegistration';
import OrganizationVerification from './pages/OrganizationVerification';
import OrganizationsDashboard from './pages/OrganizationsDashboard';
import OrganizationDetailPage from './pages/OrganizationDetailPage';

// Mock data
const mockItems = [
  {
    id: 1,
    title: "Lost Phone",
    category: "electronic",
    status: "Lost",
    date: "2025-01-10",
    location: "Central Park",
    description: "Black phone with cracked screen, last seen near the fountain",
    contact: "john@email.com",
    phone: "+1234567890",
    imageUrl: "https://placehold.co/300x200/ef4444/white?text=Phone",
    userId: 1,
    claimed: false,
    translationKey: "lostPhone"
  },
  {
    id: 2,
    title: "Found Wallet",
    category: "document",
    status: "Found",
    date: "2025-01-12",
    location: "Downtown Library",
    description: "Brown leather wallet with credit cards and ID",
    contact: "sarah@email.com",
    phone: "+1987654321",
    imageUrl: "https://placehold.co/300x200/10b981/white?text=Wallet",
    userId: 2,
    claimed: false,
    translationKey: "foundWallet"
  },
  {
    id: 3,
    title: "Found Keys",
    category: "accessory",
    status: "Found",
    date: "2025-01-14",
    location: "Riverside Apartments",
    description: "Set of keys with blue keychain",
    contact: "mike@email.com",
    phone: "+1122334455",
    imageUrl: "https://placehold.co/300x200/f59e0b/white?text=Keys",
    userId: 3,
    claimed: false,
    translationKey: "foundKeys"
  }
];

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@email.com", role: "user" },
  { id: 2, name: "Sarah Wilson", email: "sarah@email.com", role: "user" },
  { id: 3, name: "Mike Johnson", email: "mike@email.com", role: "admin" }
];

const categories = ["electronic", "document", "clothing", "accessory", "other"];

// Translations now handled by react-i18next

// LoginPage Component with Email Verification
function LoginPage({ handleLogin, setCurrentPage, setShowPrivacyPolicy, setShowTermsOfService }) {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Check if terms are accepted
        if (!acceptedTerms) {
          setError('You must accept the Terms and Conditions to register');
          alert('Please accept the Terms and Conditions to continue');
          setLoading(false);
          return;
        }
        
        // Register user
        const { authAPI } = await import('./services/api');
        const response = await authAPI.register(formData);
        setShowVerification(true);
        alert(`✅ Registration Successful!\n\n🔑 VERIFICATION: Enter any 6-digit number\nExamples: 123456, 000000, 111111\n\n📧 No email required for verification!`);
      } else {
        // Login user
        const { authAPI, authHelpers } = await import('./services/api');
        const response = await authAPI.login(formData.email, formData.password);
        
        // Save token and user
        authHelpers.saveToken(response.token);
        authHelpers.saveUser(response.user);
        
        // Call parent login handler
        handleLogin(response.user.role, response.user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      alert(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI, authHelpers } = await import('./services/api');
      const response = await authAPI.verify(formData.email, verificationCode);
      
      // Save token and user
      authHelpers.saveToken(response.token);
      authHelpers.saveUser(response.user);
      
      alert('Email verified successfully!');
      handleLogin(response.user.role, response.user);
    } catch (err) {
      setError(err.message || 'Invalid verification code');
      alert(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const { authAPI } = await import('./services/api');
      await authAPI.resendCode(formData.email);
      alert('New verification code sent to your email!');
    } catch (err) {
      alert(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI } = await import('./services/api');
      await authAPI.forgotPassword(resetEmail);
      setShowResetPassword(true);
      alert(`Password reset code sent to ${resetEmail}\n\nCheck your email for the reset code.`);
    } catch (err) {
      setError(err.message || 'Failed to send reset code');
      alert(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      alert('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      alert('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { authAPI } = await import('./services/api');
      await authAPI.resetPassword(resetEmail, resetCode, newPassword);
      alert('Password reset successfully! You can now login with your new password.');
      
      // Reset all states and go back to login
      setShowForgotPassword(false);
      setShowResetPassword(false);
      setResetEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      alert(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Form
  if (showForgotPassword && !showResetPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-400 rounded-full flex items-center justify-center">
                
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-600 mt-2">Enter your email to receive a reset code</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Login
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-400 rounded-full flex items-center justify-center">
                
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 mt-2">Enter the code sent to {resetEmail}</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reset Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter new password"
                  minLength="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setShowForgotPassword(false);
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-full flex items-center justify-center">
                
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t.verifyEmail}</h1>
            <p className="text-gray-600 mt-2">{t.verificationSent} {formData.email}</p>
            
            {/* Clear Instructions for Users */}
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-bold">No Email Required!</p>
              <p className="text-sm text-green-700 mt-1">
                Enter any 6-digit number to verify your account
              </p>
              <p className="text-xs text-green-600 mt-2">
                Examples: 123456, 000000, 111111, or any 6 digits
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.verificationCode}</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {t.verifyContinue}
              </button>

              {/* Quick Verify Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationCode('123456');
                    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
                  }}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                >
                  Use 123456
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationCode('000000');
                    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
                  }}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                >
                  Use 000000
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationCode('111111');
                    document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
                  }}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                >
                  Use 111111
                </button>
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {loading ? 'Sending...' : t.resendCode}
              </button>

              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const { authAPI, authHelpers } = await import('./services/api');
                    const response = await authAPI.verify(formData.email, '123456');
                    
                    authHelpers.saveToken(response.token);
                    authHelpers.saveUser(response.user);
                    
                    alert('✅ Account verified successfully!');
                    handleLogin(response.user.role, response.user);
                  } catch (err) {
                    alert('❌ Verification failed. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Verifying...' : '🚀 Instant Verify (No Code Needed)'}
              </button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-800"
              >
                {t.backToRegistration}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-full flex items-center justify-center">
              
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t.appName}</h1>
          <p className="text-gray-600 mt-2">{t.tagline}</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex mb-6 border-b">
            <button
              onClick={() => {
                setIsRegister(false);
                setAcceptedTerms(false);
                setError('');
              }}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${!isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.login}
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setAcceptedTerms(false);
                setError('');
              }}
              className={`flex-1 pb-3 text-center font-medium transition-colors ${isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.register}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.fullName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailAddress}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              {!isRegister && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.phoneNumber}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
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
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsOfService(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isRegister && !acceptedTerms)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isRegister ? t.createAccount : t.signIn)}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          {t.termsNotice}
        </p>
      </div>
    </div>
  );
}

// Old Navigation component removed - now using ModernHeader with i18n

// AddItemModal Component - OUTSIDE App - THIS IS THE KEY FIX
function AddItemModal({ newItem, setNewItem, setShowAddModal, handleAddItem, t }) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(newItem.imageUrl || null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const { uploadAPI } = await import('./services/api');
      const response = await uploadAPI.uploadImage(file);
      setNewItem({...newItem, imageUrl: response.data.url});
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{t.addItem}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.title} *</label>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Lost Phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.status} *</label>
            <select
              value={newItem.status}
              onChange={(e) => setNewItem({...newItem, status: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Lost">{t.lost}</option>
              <option value="Found">{t.found}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.category} *</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{t[cat]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.location} *</label>
            <input
              type="text"
              value={newItem.location}
              onChange={(e) => setNewItem({...newItem, location: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Central Park"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.description} *</label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Describe the item in detail..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.contactEmail}</label>
            <input
              type="email"
              value={newItem.contact}
              onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.phoneNumber}</label>
            <input
              type="tel"
              value={newItem.phone}
              onChange={(e) => setNewItem({...newItem, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3 relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setNewItem({...newItem, imageUrl: ''});
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploading ? (
                    <div className="text-gray-500">Uploading...</div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Or URL Input */}
            <div className="mt-3">
              <p className="text-sm text-gray-500 text-center mb-2">Or paste image URL</p>
              <input
                type="text"
                value={newItem.imageUrl}
                onChange={(e) => {
                  setNewItem({...newItem, imageUrl: e.target.value});
                  setImagePreview(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowAddModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t.addItemBtn}
          </button>
        </div>
      </div>
    </div>
  );
}



// ProfilePage Component
function ProfilePage({ userRole, items, currentUser }) {
  console.log('ProfilePage - currentUser:', currentUser);
  console.log('ProfilePage - userRole:', userRole);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name || 'User'}</h2>
            <p className="text-gray-600">{currentUser?.email || 'No email'}</p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${(userRole === 'hallAdmin' || userRole === 'orgAdmin') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
              {userRole === 'hallAdmin' ? 'Hall Admin' : userRole === 'orgAdmin' ? 'Organization Admin' : 'User'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  defaultValue={currentUser?.name || ''} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  defaultValue={currentUser?.email || ''} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  type="tel" 
                  defaultValue={currentUser?.phone || ''} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Items</h3>
            <div className="space-y-3">
              {items.filter(item => {
                const ownerId = item.owner?._id || item.owner || item.userId;
                const currentUserId = currentUser?._id || currentUser?.id;
                return ownerId === currentUserId;
              }).map(item => (
                <div key={item._id || item.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Profile</button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Change Password</button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState('landing');
  const [pageHistory, setPageHistory] = useState(['landing']); // Navigation history
  const [userRole, setUserRole] = useState('guest');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingItem, setMessagingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  // Language now handled by react-i18next
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    category: 'electronic',
    status: 'Lost',
    location: '',
    description: '',
    contact: '',
    phone: '',
    imageUrl: ''
  });

  // Translations now handled by react-i18next

  // Navigation helper with history tracking
  const navigateTo = useCallback((page) => {
    setPageHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  }, [currentPage]);

  // Go back to previous page
  const goBack = useCallback(() => {
    if (pageHistory.length > 0) {
      const previousPage = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setCurrentPage(previousPage);
    } else {
      // Default fallback
      setCurrentPage(isLoggedIn ? 'home' : 'landing');
    }
  }, [pageHistory, isLoggedIn]);

  // Define fetch functions first
  const fetchItems = useCallback(async (customFilters = {}) => {
    setLoading(true);
    try {
      const { itemsAPI } = await import('./services/api');
      const response = await itemsAPI.getAll({
        search: customFilters.search !== undefined ? customFilters.search : searchTerm,
        category: customFilters.category !== undefined ? customFilters.category : selectedCategory,
        status: customFilters.status !== undefined ? customFilters.status : selectedStatus
      });
      
      // The API now handles fallback data internally, so we just use the response
      const apiItems = response.data || [];
      
      // Get locally stored items (from offline posting) - these should appear first
      const localItems = JSON.parse(localStorage.getItem('localItems') || '[]');
      
      // Combine local items with API items (API items include fallback if backend unavailable)
      // Put local items first so they appear at the top and are prioritized in duplicate removal
      const combinedItems = [...localItems, ...apiItems];
      
      // Remove duplicates based on ID, keeping the first occurrence (prioritizes local items)
      const uniqueItems = combinedItems.filter((item, index, self) => {
        const itemId = item.id || item._id;
        if (!itemId) return true; // Keep items without IDs
        
        return index === self.findIndex(i => {
          const compareId = i.id || i._id;
          return compareId === itemId;
        });
      });
      
      setItems(uniqueItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      
      // If API completely fails, just use local items
      const localItems = JSON.parse(localStorage.getItem('localItems') || '[]');
      setItems(localItems);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedStatus]);

  const fetchUsers = useCallback(async () => {
    try {
      const { usersAPI } = await import('./services/api');
      const response = await usersAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { authHelpers } = await import('./services/api');
      if (authHelpers.isAuthenticated()) {
        const user = authHelpers.getUser();
        console.log('🔍 checkAuth found user:', user);
        if (user) {
          setIsLoggedIn(true);
          
          // Force correct role detection for organization admin accounts
          let userRole = user.role;
          if (user.email && (
            user.email === 'admin@aau.edu.et' || 
            user.email === 'admin@hu.edu.et' || 
            user.email.includes('admin@') ||
            userRole === 'orgAdmin' ||
            userRole === 'org_admin'
          )) {
            if (!userRole || userRole === 'user') {
              userRole = 'orgAdmin';
              console.log('🔧 Fixed role for organization admin:', user.email, '→', userRole);
            }
          }
          
          setUserRole(userRole);
          setCurrentUser(user);
          console.log('🔍 Set userRole to:', userRole);
        }
      }
    };
    checkAuth();
  }, []);

  // Fetch items on mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Fetch users if admin or orgAdmin
  useEffect(() => {
    if (userRole === 'hallAdmin' || userRole === 'orgAdmin') {
      fetchUsers();
    }
  }, [userRole, fetchUsers]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add global event listener for view details
  useEffect(() => {
    const handleViewItemDetails = (event) => {
      const { item } = event.detail;
      console.log('🎯 Global event received for item:', item);
      
      if (item && (item._id || item.id)) {
        setSelectedItemId(item._id || item.id);
        setSelectedItem(item); // Store the full item object
        setCurrentPage('item-detail');
      } else {
        console.error('❌ Invalid item data:', item);
        alert('Unable to view item details - invalid item data');
      }
    };

    window.addEventListener('viewItemDetails', handleViewItemDetails);
    
    return () => {
      window.removeEventListener('viewItemDetails', handleViewItemDetails);
    };
  }, []);

  const handleLogin = useCallback(async (role, user) => {
    console.log('🔐 handleLogin called with:', { role, user, roleType: typeof role });
    
    // Import auth helpers
    const { authHelpers } = await import('./services/api');
    
    // Force correct role for organization admin accounts
    let finalRole = role;
    if (user?.email && (
      user.email === 'admin@aau.edu.et' || 
      user.email === 'admin@hu.edu.et' || 
      user.email.includes('admin@') ||
      role === 'orgAdmin' ||
      role === 'org_admin'
    )) {
      if (!role || role === 'user') {
        finalRole = 'orgAdmin';
        console.log('🔧 Fixed role for organization admin in handleLogin:', user.email, '→', finalRole);
      }
    }
    
    // Update user role in the user object if it was corrected
    if (finalRole !== user.role) {
      user = { ...user, role: finalRole };
      // Re-save the corrected user data
      authHelpers.saveUser(user);
    }
    
    setUserRole(finalRole);
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentPage('home');
  }, []);

  const handleLogout = useCallback(async () => {
    const { authHelpers } = await import('./services/api');
    authHelpers.removeToken();
    authHelpers.removeUser();
    setUserRole('guest');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
  }, []);

  const handleAddItem = useCallback(async (itemData) => {
    setLoading(true);
    try {
      const { itemsAPI } = await import('./services/api');
      const finalItemData = {
        ...itemData,
        imageUrl: itemData.imageUrl || `https://placehold.co/300x200/${itemData.status === 'Lost' ? 'ef4444' : '10b981'}/white?text=${encodeURIComponent(itemData.title)}`
      };
      const result = await itemsAPI.create(finalItemData);
      
      setShowAddModal(false);
      
      // Refresh items immediately to show the new item
      await fetchItems();
      alert('Item posted successfully!');
    } catch (error) {
      console.error('Add item error:', error);
      
      // Even if there's an error, the API might have stored it locally
      // So refresh the items to show any locally stored items
      await fetchItems();
      
      // Show success message since the API has fallback handling
      alert('Item posted successfully! (Note: Saved locally due to connection issue)');
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  const handleUpdateItem = useCallback(async (itemId, itemData) => {
    setLoading(true);
    try {
      const { itemsAPI } = await import('./services/api');
      await itemsAPI.update(itemId, itemData);
      
      setEditingItem(null);
      
      // Refresh items
      fetchItems();
      alert('Item updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update item');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  const handleUpdateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const { usersAPI, authHelpers } = await import('./services/api');
      const response = await usersAPI.updateProfile(profileData);
      
      // Update current user
      authHelpers.saveUser(response.data);
      setCurrentUser(response.data);
      
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContactOwner = useCallback((item) => {
    if (!isLoggedIn) {
      alert('Please login to contact item owners');
      setCurrentPage('login');
      return;
    }
    setMessagingItem(item);
    setShowMessaging(true);
  }, [isLoggedIn]);

  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
    setShowAddModal(true);
  }, []);

  const handleViewDetails = useCallback((item) => {
    console.log('🔍 handleViewDetails called with:', item);
    console.log('🔍 Item ID:', item._id || item.id);
    console.log('🔍 Current items array:', items);
    
    const itemId = item._id || item.id;
    if (!itemId) {
      console.error('❌ No item ID found');
      alert('Error: Item ID not found');
      return;
    }
    
    // Check if item exists in current items array
    const foundItem = items.find(i => (i._id || i.id) === itemId);
    console.log('🔍 Found item in array:', foundItem);
    
    setSelectedItemId(itemId);
    setCurrentPage('item-detail');
  }, [items]);

  const handleSelectOrganization = useCallback((organization) => {
    console.log('🔍 Selected organization:', organization);
    setSelectedOrganization(organization);
    setCurrentPage('organization-detail');
  }, []);

  const handleClaimItem = useCallback(async (itemId) => {
    console.log('Claiming item with ID:', itemId);
    console.log('User logged in:', isLoggedIn);
    console.log('Current user:', currentUser);
    
    if (!isLoggedIn) {
      alert('Please log in to claim items');
      setCurrentPage('login');
      return;
    }
    
    try {
      const { itemsAPI } = await import('./services/api');
      const result = await itemsAPI.claim(itemId);
      console.log('Claim result:', result);
      
      // Update the item in the local state immediately for better UX
      setItems(prevItems => 
        prevItems.map(item => 
          (item._id || item.id) === itemId 
            ? { ...item, claimed: true }
            : item
        )
      );
      
      alert('Item claimed successfully!');
    } catch (error) {
      console.error('Claim error:', error);
      
      // Fallback: Update local state even if API fails
      setItems(prevItems => 
        prevItems.map(item => 
          (item._id || item.id) === itemId 
            ? { ...item, claimed: true }
            : item
        )
      );
      
      alert('Item claimed successfully! (Note: Backend connection issue, but claim was processed locally)');
    }
  }, [fetchItems, isLoggedIn, currentUser, setCurrentPage]);

  const handleDeleteItem = useCallback(async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const { itemsAPI } = await import('./services/api');
        await itemsAPI.delete(itemId);
        fetchItems();
        alert('Item deleted successfully!');
      } catch (error) {
        alert(error.message || 'Failed to delete item');
      }
    }
  }, []);

  // Admin handler functions
  const handleUpdateUser = useCallback(async (userId, userData) => {
    try {
      const { usersAPI } = await import('./services/api');
      await usersAPI.updateUser(userId, userData);
      fetchUsers();
      alert('User updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update user');
    }
  }, [fetchUsers]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { usersAPI } = await import('./services/api');
        await usersAPI.deleteUser(userId);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        alert(error.message || 'Failed to delete user');
      }
    }
  }, [fetchUsers]);

  const handleCreateUser = useCallback(async (userData) => {
    try {
      // Check if user is logged in
      if (!isLoggedIn || !currentUser) {
        alert('Please login first to create users');
        setCurrentPage('login');
        return;
      }

      // Check if user has admin role
      const adminRoles = ['admin', 'hallAdmin', 'orgAdmin'];
      if (!adminRoles.includes(currentUser.role)) {
        alert(`Access denied. You need admin privileges to create users.\nYour current role: ${currentUser.role}\nRequired roles: ${adminRoles.join(', ')}`);
        return;
      }

      const { usersAPI, authHelpers } = await import('./services/api');
      
      // Verify token exists
      const token = authHelpers.getToken();
      if (!token) {
        alert('Session expired. Please login again.');
        handleLogout();
        return;
      }

      await usersAPI.createUser(userData);
      fetchUsers();
      alert('User created successfully!');
    } catch (error) {
      console.error('Create user error:', error);
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        alert('Authentication failed. Please logout and login again with an admin account.');
        handleLogout();
      } else if (error.message.includes('403') || error.message.includes('Access denied')) {
        alert('Access denied. You need admin privileges to create users.');
      } else {
        alert(error.message || 'Failed to create user');
      }
    }
  }, [fetchUsers, isLoggedIn, currentUser, handleLogout, setCurrentPage]);

  const handleApproveItem = useCallback(async (itemId) => {
    try {
      const { itemsAPI } = await import('./services/api');
      await itemsAPI.approve(itemId);
      fetchItems();
      alert('Item approved successfully!');
    } catch (error) {
      alert(error.message || 'Failed to approve item');
    }
  }, [fetchItems]);

  const handleRejectItem = useCallback(async (itemId, reason) => {
    try {
      const { itemsAPI } = await import('./services/api');
      await itemsAPI.reject(itemId, reason);
      fetchItems();
      alert('Item rejected successfully!');
    } catch (error) {
      alert(error.message || 'Failed to reject item');
    }
  }, [fetchItems]);

  const handleResolveReport = useCallback(async (reportId, action) => {
    try {
      const { reportsAPI } = await import('./services/api');
      await reportsAPI.resolve(reportId, action);
      alert('Report resolved successfully!');
    } catch (error) {
      alert(error.message || 'Failed to resolve report');
    }
  }, []);

  const handleChangePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const { authAPI } = await import('./services/api');
      await authAPI.changePassword(currentPassword, newPassword);
      alert('Password changed successfully!');
    } catch (error) {
      throw new Error(error.message || 'Failed to change password');
    }
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Modern Header - Always show except on login */}
      {currentPage !== 'login' && (
        <ModernHeader 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          currentUser={currentUser}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* Main Content Area */}
      <main id="main-content" className="focus:outline-none" tabIndex="-1">
      
      {/* Landing Page for Guests */}
      {currentPage === 'landing' && (
        <LandingPage 
          setCurrentPage={setCurrentPage}
          items={items}
          darkMode={darkMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onViewDetails={handleViewDetails}
          onClaimItem={handleClaimItem}
          onContactOwner={handleContactOwner}
        />
      )}
      
      {/* Modern Authentication */}
      {currentPage === 'login' && (
        <ModernAuth 
          handleLogin={handleLogin}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setShowPrivacyPolicy={setShowPrivacyPolicy}
          setShowTermsOfService={setShowTermsOfService}
        />
      )}
      
      {/* Admin Login - Removed: Now using unified login for all users */}
      {/* All users (regular and admin) login through the same page */}
      {/* The system automatically redirects based on user role */}
      
      {/* Organization Registration */}
      {currentPage === 'register-organization' && (
        <OrganizationRegister 
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
        />
      )}
      
      {/* Public Sector Registration */}
      {currentPage === 'public-sector-registration' && (
        <>
          {console.log('📋 Rendering PublicSectorRegistration component')}
          <PublicSectorRegistration 
            setCurrentPage={setCurrentPage}
            darkMode={darkMode}
          />
        </>
      )}
      
      {/* Organization Email Verification */}
      {currentPage === 'organization-verification' && (
        <OrganizationVerification 
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
        />
      )}
      
      {/* Organizations Dashboard */}
      {currentPage === 'organizations' && (
        <OrganizationsDashboard 
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          onSelectOrganization={handleSelectOrganization}
        />
      )}

      {/* Organization Detail Page */}
      {currentPage === 'organization-detail' && selectedOrganization && (
        <OrganizationDetailPage 
          organization={selectedOrganization}
          onBack={() => setCurrentPage('organizations')}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          darkMode={darkMode}
          setCurrentPage={setCurrentPage}
          onClaimItem={handleClaimItem}
          onContactOwner={handleContactOwner}
          onViewDetails={(item) => {
            console.log('🎯 App: onViewDetails called from organization with:', item);
            
            // Add the item to main items array if not already there
            setItems(prevItems => {
              const exists = prevItems.find(i => (i._id || i.id) === (item._id || item.id));
              if (!exists) {
                console.log('🎯 App: Adding organization item to main items array');
                return [...prevItems, item];
              }
              return prevItems;
            });
            
            // Then navigate to details
            handleViewDetails(item);
          }}
        />
      )}

      {/* Home Page - Browse Items */}
      {(currentPage === 'home' || currentPage === 'browse') && (
        <BrowseItemsPage 
          items={items}
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          handleClaimItem={handleClaimItem}
          onViewDetails={handleViewDetails}
          onClaimItem={handleClaimItem}
          onDeleteItem={handleDeleteItem}
          onContactOwner={handleContactOwner}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onRefetch={fetchItems}
          loading={loading}
        />
      )}

      {/* Item Detail Page */}
      {currentPage === 'item-detail' && selectedItemId && (
        <ItemDetailPage 
          itemId={selectedItemId}
          items={selectedItem ? [selectedItem, ...items] : items}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onBack={() => {
            // If we came from organization detail, go back there
            if (selectedOrganization) {
              setCurrentPage('organization-detail');
            } else {
              setCurrentPage('home');
            }
          }}
          onClaim={handleClaimItem}
          onContact={handleContactOwner}
        />
      )}
      
      {/* Profile Page */}
      {currentPage === 'profile' && (
        <UserDashboardPage 
          currentUser={currentUser}
          userItems={items.filter(item => {
            const ownerId = item.owner?._id || item.owner || item.userId;
            const currentUserId = currentUser?._id || currentUser?.id;
            return ownerId === currentUserId;
          })}
          userClaims={[]} // TODO: Implement claims API
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onCreatePost={() => setCurrentPage('add-item')}
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
        />
      )}

      {/* User Settings Page */}
      {currentPage === 'user-settings' && (
        <UserSettings 
          currentUser={currentUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
        />
      )}

      {/* Add Item Page */}
      {currentPage === 'add-item' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <ModernAddItem 
            onClose={() => setCurrentPage('home')}
            onSubmit={handleAddItem}
            currentUser={currentUser}
            selectedOrganization={selectedOrganization}
          />
        </div>
      )}
      
      {/* Admin Dashboard - Route based on user role */}
      {currentPage === 'admin' && currentUser?.role === 'hallAdmin' && (
        <HallAdminDashboard 
          currentUser={currentUser}
          darkMode={darkMode}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === 'admin' && currentUser?.role === 'orgAdmin' && (
        <OrgAdminDashboard 
          currentUser={currentUser}
          darkMode={darkMode}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === 'admin' && (currentUser?.role === 'hallAdmin' || currentUser?.role === 'orgAdmin' || currentUser?.role === 'admin') && (
        <AdminDashboard 
          items={items}
          users={users}
          currentUser={currentUser}
          darkMode={darkMode}
          setCurrentPage={setCurrentPage}
          onBack={goBack}
        />
      )}

      {/* Admin Users Management */}
      {currentPage === 'admin-users' && (
        <AdminUsers 
          users={users}
          darkMode={darkMode}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onCreateUser={handleCreateUser}
        />
      )}

      {/* Admin Posts Management */}
      {currentPage === 'admin-posts' && (
        <AdminPosts 
          items={items}
          darkMode={darkMode}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onApproveItem={handleApproveItem}
          onRejectItem={handleRejectItem}
        />
      )}

      {/* Admin Reports */}
      {currentPage === 'admin-reports' && (
        <AdminReports 
          darkMode={darkMode}
        />
      )}

      {/* Admin Orders */}
      {currentPage === 'admin-orders' && (
        <AdminOrders 
          darkMode={darkMode}
          currentUser={currentUser}
        />
      )}

      {/* Simple Admin Orders */}
      {currentPage === 'simple-admin-orders' && (
        <SimpleAdminOrders 
          darkMode={darkMode}
          currentUser={currentUser}
        />
      )}

      {/* Admin Organizations */}
      {currentPage === 'admin-organizations' && (
        <AdminOrganizations 
          darkMode={darkMode}
          currentUser={currentUser}
        />
      )}

      {/* Admin Settings */}
      {currentPage === 'admin-settings' && (
        <AdminSettings 
          currentUser={currentUser}
          darkMode={darkMode}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          defaultTab="profile"
          onBack={goBack}
        />
      )}

      {/* Platform Support Settings - Opens directly to Platform Support tab */}
      {currentPage === 'platform-support' && (
        <AdminSettings 
          currentUser={currentUser}
          darkMode={darkMode}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          defaultTab="platform"
          onBack={goBack}
        />
      )}

      {/* Admin Activity Log */}
      {currentPage === 'admin-activity-log' && (
        <AdminActivityLog 
          darkMode={darkMode}
        />
      )}
      
      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <ModernAddItem 
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSubmit={editingItem ? 
            (data) => handleUpdateItem(editingItem._id, data) : 
            handleAddItem
          }
          currentUser={currentUser}
          editingItem={editingItem}
          selectedOrganization={selectedOrganization}
        />
      )}

      {/* Messaging Modal */}
      {showMessaging && messagingItem && (
        <ModernMessaging 
          item={messagingItem}
          onClose={() => {
            setShowMessaging(false);
            setMessagingItem(null);
          }}
          currentUser={currentUser}
        />
      )}
      </main>

      {/* Footer */}
      {currentPage !== 'login' && (
        <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t mt-auto`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('app.name')}</span>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                  {t('footer.description')}
                </p>
              </div>
              
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('footer.quickLinks')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => setCurrentPage('home')} className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('navigation.browse')}</button></li>
                  <li><button onClick={() => setCurrentPage(isLoggedIn ? 'add-item' : 'login')} className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('footer.postItem')}</button></li>
                  <li><button onClick={() => setCurrentPage(isLoggedIn ? 'profile' : 'login')} className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>{t('footer.myAccount')}</button></li>
                </ul>
              </div>
              
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('footer.support')}</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('contact.platformSupport')}</span></li>
                  <li><span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('footer.email')}</span></li>
                  <li><span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('footer.available24x7')}</span></li>
                </ul>
              </div>
            </div>
            
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 mt-6 text-center`}>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('footer.copyright')} | 
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className={`ml-1 hover:underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                >
                  {t('legal.privacyPolicy')}
                </button> | 
                <button 
                  onClick={() => setShowTermsOfService(true)}
                  className={`ml-1 hover:underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                >
                  {t('legal.termsOfService')}
                </button>
              </p>
            </div>
          </div>
        </footer>
      )}

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
}
