import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const OrganizationVerification = ({ setCurrentPage, darkMode }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, expired
  const [message, setMessage] = useState('');
  const [organizationData, setOrganizationData] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/organizations/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          setOrganizationData(data.data);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, []);

  const handleResendVerification = async () => {
    const email = prompt('Please enter your admin email address:');
    if (!email) return;

    setResendLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/organizations/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Verification email sent successfully! Please check your inbox.');
      } else {
        alert(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to send verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 text-center`}>
          
          {/* Verifying State */}
          {status === 'verifying' && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  
                </div>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Verifying Your Email
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  
                </div>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Email Verified Successfully!
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                {message}
              </p>

              {organizationData && (
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Organization Details
                  </h3>
                  <div className="text-left space-y-2">
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Organization:</span>
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                        {organizationData.organization.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin:</span>
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>
                        {organizationData.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status:</span>
                      <span className={`${
                        organizationData.organization.status === 'active' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      } font-medium`}>
                        {organizationData.organization.status === 'active' ? 'Active' : 'Pending Approval'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6`}>
                <div className="flex items-start">
                  
                  <div className="text-left">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>
                      What's Next?
                    </h4>
                    <ul className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-700'} space-y-1`}>
                      <li>• Your organization is now pending approval</li>
                      <li>• Our team will review your application within 24-48 hours</li>
                      <li>• You'll receive an email notification once approved</li>
                      <li>• After approval, you can start your 14-day free trial</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Continue to Login
                
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div>
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                  
                </div>
              </div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Verification Failed
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                {message}
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  {resendLoading ? (
                    <>
                      
                      Sending...
                    </>
                  ) : (
                    <>
                      
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentPage('public-sector-registration')}
                  className={`w-full border py-3 px-6 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Register New Organization
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Need help?{' '}
              <button className="text-blue-600 hover:text-blue-500 underline">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationVerification;