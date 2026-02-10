import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';

const AdminLogin = ({ onAdminLogin, setCurrentPage, darkMode }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Admin login logic
      if (formData.email === 'admin@platform.com' && formData.password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'System Administrator',
          email: 'admin@platform.com',
          role: 'admin'
        };
        onAdminLogin('admin', adminUser);
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${darkMode ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-indigo-400'} rounded-full flex items-center justify-center`}>
              
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('admin.login.title')}
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            {t('admin.login.subtitle')}
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-8`}>
          {error && (
            <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-6`}>
              <div className="flex items-center">
                
                <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t('auth.emailAddress')}
              </label>
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
                  placeholder="admin@platform.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {t('auth.password')}
              </label>
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
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? t('auth.loading') : t('admin.login.signIn')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('landing')}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} hover:underline`}
            >
              {t('navigation.backToHome')}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border rounded-lg`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2 font-semibold`}>
              {t('admin.login.demoCredentials')}:
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Email: admin@platform.com<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;