import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, User, Mail, Lock, Eye, EyeOff, Phone, MapPin, FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const OrganizationRegister = ({ setCurrentPage, darkMode }) => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // CAPTCHA state
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    // Organization Information
    organizationName: '',
    organizationType: '',
    sectorLevel: '',
    officialEmail: '',
    phoneNumber: '',
    physicalAddress: {
      street: '',
      city: '',
      region: '',
      country: 'Ethiopia',
      postalCode: ''
    },
    // Admin Account Information
    adminFullName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    // System Fields
    organizationId: '', // Auto-generated
    defaultLanguage: 'en',
    subscriptionPlan: 'free',
    // Agreement
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const organizationTypes = [
    { value: 'university', label: t('organization.register.organizationTypes.university') },
    { value: 'municipality', label: t('organization.register.organizationTypes.municipality') },
    { value: 'hospital', label: t('organization.register.organizationTypes.hospital') },
    { value: 'transport', label: t('organization.register.organizationTypes.transport') },
    { value: 'government', label: t('organization.register.organizationTypes.government') },
    { value: 'other', label: t('organization.register.organizationTypes.other') }
  ];

  const sectorLevels = [
    { value: 'federal', label: t('organization.register.sectorLevels.federal') },
    { value: 'regional', label: t('organization.register.sectorLevels.regional') },
    { value: 'city', label: t('organization.register.sectorLevels.city') },
    { value: 'local', label: t('organization.register.sectorLevels.local') }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'am', label: 'አማርኛ (Amharic)' },
    { value: 'om', label: 'Afaan Oromoo (Oromo)' },
    { value: 'ti', label: 'ትግርኛ (Tigrinya)' }
  ];

  // Generate simple CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Auto-generate organization ID
  const generateOrganizationId = (name, type) => {
    if (!name || !type) return '';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    const typePrefix = type.substring(0, 3);
    const timestamp = Date.now().toString().slice(-4);
    return `${typePrefix}-${cleanName}-${timestamp}`;
  };

  // Enhanced validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    };
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+251|0)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
    
    // Auto-generate organization ID when name and type change
    if (formData.organizationName && formData.organizationType) {
      const newId = generateOrganizationId(formData.organizationName, formData.organizationType);
      setFormData(prev => ({ ...prev, organizationId: newId }));
    }
  }, [formData.organizationName, formData.organizationType]);

  // Enhanced form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current step
    const stepErrors = {};
    
    if (currentStep === 1) {
      if (!formData.organizationName.trim()) stepErrors.organizationName = 'Organization name is required';
      if (!formData.organizationType) stepErrors.organizationType = 'Organization type is required';
      if (!formData.sectorLevel) stepErrors.sectorLevel = 'Sector level is required';
      if (!formData.officialEmail.trim()) stepErrors.officialEmail = 'Official email is required';
      else if (!validateEmail(formData.officialEmail)) stepErrors.officialEmail = 'Invalid email format';
      if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required';
      else if (!validatePhoneNumber(formData.phoneNumber)) stepErrors.phoneNumber = 'Invalid phone number format';
    }
    
    if (currentStep === 2) {
      if (!formData.adminFullName.trim()) stepErrors.adminFullName = 'Administrator name is required';
      if (!formData.adminEmail.trim()) stepErrors.adminEmail = 'Administrator email is required';
      else if (!validateEmail(formData.adminEmail)) stepErrors.adminEmail = 'Invalid email format';
      
      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) stepErrors.password = 'Password is required';
      else if (!passwordValidation.isValid) stepErrors.password = 'Password does not meet requirements';
      
      if (!formData.confirmPassword) stepErrors.confirmPassword = 'Password confirmation is required';
      else if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (currentStep === 3) {
      if (!formData.agreeToTerms) stepErrors.agreeToTerms = 'You must agree to the Terms of Service';
      if (!formData.agreeToPrivacy) stepErrors.agreeToPrivacy = 'You must agree to the Privacy Policy';
      if (captchaInput !== captcha) {
        stepErrors.captcha = 'CAPTCHA verification failed';
        setCaptchaError('CAPTCHA verification failed');
        generateCaptcha();
      }
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setErrors({});
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission to backend API
    setLoading(true);
    try {
      const organizationData = {
        // Organization data
        organizationName: formData.organizationName.trim(),
        organizationType: formData.organizationType,
        sectorLevel: formData.sectorLevel,
        officialEmail: formData.officialEmail.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        physicalAddress: formData.physicalAddress,
        // Admin data
        adminFullName: formData.adminFullName.trim(),
        adminEmail: formData.adminEmail.trim(),
        password: formData.password,
        // System fields
        organizationId: formData.organizationId,
        defaultLanguage: formData.defaultLanguage,
        subscriptionPlan: formData.subscriptionPlan,
        // Verification
        captchaVerified: true
      };

      const response = await fetch('http://localhost:5001/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success - redirect to verification page
        localStorage.setItem('registrationData', JSON.stringify({
          organizationName: formData.organizationName,
          adminEmail: formData.adminEmail,
          organizationId: formData.organizationId
        }));
        setCurrentPage('organization-verification');
      } else {
        // Handle API errors
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Fallback: Store organization locally if backend is unavailable
      if (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.name === 'TypeError') {
        
        console.warn('Backend not available, storing organization locally');
        
        // Create organization object for local storage
        const localOrganization = {
          id: formData.organizationId,
          name: formData.organizationName.trim(),
          type: formData.organizationType,
          logo: `https://placehold.co/100x100/3b82f6/white?text=${formData.organizationName.charAt(0)}`,
          location: `${formData.physicalAddress.city}, ${formData.physicalAddress.region}`,
          description: `${formData.organizationType} organization in ${formData.sectorLevel} sector`,
          activeItems: 0,
          totalItems: 0,
          rating: 4.5,
          verified: false, // Will be verified later
          contact: {
            phone: formData.phoneNumber.trim(),
            email: formData.officialEmail.trim(),
            website: ''
          },
          stats: {
            lostItems: 0,
            foundItems: 0,
            returnedItems: 0
          },
          createdAt: new Date().toISOString(),
          adminEmail: formData.adminEmail.trim(),
          adminName: formData.adminFullName.trim()
        };
        
        // Store in localStorage
        const existingOrgs = JSON.parse(localStorage.getItem('localOrganizations') || '[]');
        existingOrgs.unshift(localOrganization);
        localStorage.setItem('localOrganizations', JSON.stringify(existingOrgs));
        
        // Store registration data for verification
        localStorage.setItem('registrationData', JSON.stringify({
          organizationName: formData.organizationName,
          adminEmail: formData.adminEmail,
          organizationId: formData.organizationId,
          storedLocally: true
        }));
        
        // Redirect to verification page
        setCurrentPage('organization-verification');
      } else {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('organization.register.title')}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('organization.register.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? '✓' : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step
                      ? 'bg-blue-600'
                      : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-16 text-sm">
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {t('organization.register.steps.organization')}
              </span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {t('organization.register.steps.adminAccount')}
              </span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {t('organization.register.steps.confirmation')}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Organization Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  {t('organization.register.organizationInfo.title')}
                </h2>

                {/* Organization Name */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.name')} *
                  </label>
                  <div className="relative">
                    
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.organizationName ? 'border-red-500' : ''}`}
                      placeholder="Enter your organization's full name"
                    />
                  </div>
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.organizationName}
                    </p>
                  )}
                </div>

                {/* Organization Type */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.type')} *
                  </label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.organizationType ? 'border-red-500' : ''}`}
                  >
                    <option value="">{t('organization.register.organizationInfo.typePlaceholder')}</option>
                    {organizationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.organizationType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.organizationType}
                    </p>
                  )}
                </div>

                {/* Sector Level */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.sectorLevel')} *
                  </label>
                  <select
                    value={formData.sectorLevel}
                    onChange={(e) => setFormData({...formData, sectorLevel: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${errors.sectorLevel ? 'border-red-500' : ''}`}
                  >
                    <option value="">{t('organization.register.organizationInfo.sectorLevelPlaceholder')}</option>
                    {sectorLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {t('organization.register.organizationInfo.officialEmail')} *
                    </label>
                    <div className="relative">
                      
                      <input
                        type="email"
                        value={formData.officialEmail}
                        onChange={(e) => setFormData({...formData, officialEmail: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        } ${errors.officialEmail ? 'border-red-500' : ''}`}
                        placeholder={t('organization.register.organizationInfo.officialEmailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      {t('organization.register.organizationInfo.phoneNumber')} *
                    </label>
                    <div className="relative">
                      
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder={t('organization.register.organizationInfo.phoneNumberPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.address')}
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      
                      <input
                        type="text"
                        value={formData.physicalAddress.street}
                        onChange={(e) => setFormData({...formData, physicalAddress: {...formData.physicalAddress, street: e.target.value}})}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder={t('organization.register.organizationInfo.street')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={formData.physicalAddress.city}
                        onChange={(e) => setFormData({...formData, physicalAddress: {...formData.physicalAddress, city: e.target.value}})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder={t('organization.register.organizationInfo.city')}
                      />
                      <input
                        type="text"
                        value={formData.physicalAddress.region}
                        onChange={(e) => setFormData({...formData, physicalAddress: {...formData.physicalAddress, region: e.target.value}})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder={t('organization.register.organizationInfo.region')}
                      />
                      <input
                        type="text"
                        value={formData.physicalAddress.postalCode}
                        onChange={(e) => setFormData({...formData, physicalAddress: {...formData.physicalAddress, postalCode: e.target.value}})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder={t('organization.register.organizationInfo.postalCode')}
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('landing')}
                    className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('organization.register.navigation.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {t('organization.register.navigation.continue')}
                    
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Admin Account Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  {t('organization.register.adminAccount.title')}
                </h2>

                {/* Admin Name */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.adminAccount.name')} *
                  </label>
                  <div className="relative">
                    
                    <input
                      type="text"
                      value={formData.adminFullName}
                      onChange={(e) => setFormData({...formData, adminFullName: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.adminFullName ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.adminAccount.namePlaceholder')}
                    />
                  </div>
                  {errors.adminFullName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.adminFullName}
                    </p>
                  )}
                </div>

                {/* Admin Email */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.adminAccount.email')} *
                  </label>
                  <div className="relative">
                    
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.adminEmail ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.adminAccount.emailPlaceholder')}
                    />
                  </div>
                  {errors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.adminEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.adminAccount.password')} *
                  </label>
                  <div className="relative">
                    
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.password ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.adminAccount.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs space-y-1">
                      {(() => {
                        const validation = validatePassword(formData.password);
                        return (
                          <>
                            <div className={`flex items-center ${validation.minLength ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              
                              {t('organization.register.adminAccount.passwordRequirements.minLength')}
                            </div>
                            <div className={`flex items-center ${validation.hasUppercase ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              
                              {t('organization.register.adminAccount.passwordRequirements.uppercase')}
                            </div>
                            <div className={`flex items-center ${validation.hasLowercase ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              
                              {t('organization.register.adminAccount.passwordRequirements.lowercase')}
                            </div>
                            <div className={`flex items-center ${validation.hasNumber ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              
                              {t('organization.register.adminAccount.passwordRequirements.number')}
                            </div>
                            <div className={`flex items-center ${validation.hasSpecialChar ? 'text-green-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              
                              {t('organization.register.adminAccount.passwordRequirements.special')}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.adminAccount.confirmPassword')} *
                  </label>
                  <div className="relative">
                    
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.adminAccount.confirmPasswordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Default Language - Dropdown Style */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.adminAccount.defaultLanguage')} *
                  </label>
                  <div className="relative">
                    
                    <select
                      value={formData.defaultLanguage}
                      onChange={(e) => {
                        setFormData({...formData, defaultLanguage: e.target.value});
                        i18n.changeLanguage(e.target.value);
                      }}
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('organization.register.adminAccount.languageSelected')} <span className="font-medium">{languages.find(l => l.value === formData.defaultLanguage)?.label}</span>
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('organization.register.navigation.back')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {t('organization.register.navigation.continue')}
                    
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                  {t('organization.register.confirmation.title')}
                </h2>

                {/* Organization Summary */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Organization Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.organizationName}</span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {organizationTypes.find(t => t.value === formData.organizationType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {sectorLevels.find(l => l.value === formData.sectorLevel)?.label}
                      </span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.officialEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Summary */}
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Administrator Account
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.adminFullName}</span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.adminEmail}</span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Language:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {languages.find(l => l.value === formData.defaultLanguage)?.label}
                      </span>
                    </div>
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plan:</span>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Free (14-day trial)</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Privacy */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToTerms" className={`ml-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('organization.register.confirmation.agreeToTerms')}{' '}
                      <button 
                        type="button" 
                        onClick={() => {
                          // Open Terms of Service modal
                          console.log('Open Terms of Service');
                        }}
                        className="text-blue-600 hover:text-blue-500 underline"
                      >
                        {t('legal.termsOfService')}
                      </button>
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={(e) => setFormData({...formData, agreeToPrivacy: e.target.checked})}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeToPrivacy" className={`ml-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('organization.register.confirmation.agreeToPrivacy')}{' '}
                      <button 
                        type="button" 
                        onClick={() => {
                          // Open Privacy Policy modal
                          console.log('Open Privacy Policy');
                        }}
                        className="text-blue-600 hover:text-blue-500 underline"
                      >
                        {t('legal.privacyPolicy')}
                      </button>
                    </label>
                  </div>
                </div>

                {/* CAPTCHA Verification */}
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.confirmation.securityVerification')} *
                  </label>
                  <div className="space-y-4">
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded-lg p-4 flex items-center justify-between`}>
                      <div className="flex items-center space-x-4">
                        <div className={`${darkMode ? 'bg-gray-600' : 'bg-white'} px-4 py-2 rounded font-mono text-lg tracking-wider select-none`}>
                          {captcha}
                        </div>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                          title="Generate new CAPTCHA"
                        >
                          
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setCaptchaError('');
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${captchaError ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.confirmation.captchaPlaceholder')}
                    />
                    {captchaError && (
                      <p className="text-sm text-red-600 flex items-center">
                        
                        {captchaError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Auto-generated Organization ID Display */}
                <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                  <div className="flex items-start">
                    
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                        Organization ID (Auto-generated)
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-700'} mb-2`}>
                        Your unique organization identifier: <span className="font-mono font-semibold">{formData.organizationId}</span>
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                        This ID will be used for your organization's workspace and cannot be changed later.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                  <div className="flex items-start">
                    
                    <div>
                      <h4 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                        Security & Verification
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                        After registration, you'll receive an email verification link. Your organization will be reviewed for approval within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('organization.register.navigation.back')}
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.agreeToTerms || !formData.agreeToPrivacy || loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        
                        {t('organization.register.confirmation.creatingOrganization')}
                      </>
                    ) : (
                      <>
                        {t('organization.register.confirmation.createOrganization')}
                        
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('organization.register.help.needHelp')}{' '}
            <button className="text-blue-600 hover:text-blue-500 underline">
              {t('organization.register.help.contactSupport')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister;