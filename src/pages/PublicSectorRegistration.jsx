import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Lock, Eye, EyeOff, Phone, MapPin, User, CheckCircle, ArrowRight, AlertCircle, FileText, RefreshCw, X } from 'lucide-react';

const PublicSectorRegistration = ({ setCurrentPage, darkMode }) => {
  console.log('🚀 PublicSectorRegistration component loaded!');
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Modal states for Terms and Privacy
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  // CAPTCHA state
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Form data state - exactly as specified in requirements
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
    subscriptionPlan: 'free',
    // Agreement
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  // Organization types as specified
  const organizationTypes = [
    { value: 'university', label: 'University' },
    { value: 'municipality', label: 'Municipality' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'transport', label: 'Transport Authority' },
    { value: 'government', label: 'Government Office' },
    { value: 'other', label: 'Other' }
  ];

  // Sector levels as specified
  const sectorLevels = [
    { value: 'federal', label: 'Federal' },
    { value: 'regional', label: 'Regional' },
    { value: 'city', label: 'City' },
    { value: 'local', label: 'Local' }
  ];

  // Languages as specified
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'am', label: 'Amharic' },
    { value: 'om', label: 'Afaan Oromo' },
    { value: 'ti', label: 'Tigrinya' }
  ];

  // Generate CAPTCHA for spam protection
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  // Auto-generate organizationId
  const generateOrganizationId = (name, type) => {
    if (!name || !type) return '';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
    const typePrefix = type.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${typePrefix}-${cleanName}-${timestamp}`;
  };

  // Email format validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Strong password validation
  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  // Phone number validation
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+251|0)?[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  // Initialize CAPTCHA and auto-generate organizationId
  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    if (formData.organizationName && formData.organizationType) {
      const newId = generateOrganizationId(formData.organizationName, formData.organizationType);
      // Only update if the ID has actually changed
      if (newId !== formData.organizationId) {
        setFormData(prev => ({ ...prev, organizationId: newId }));
      }
    }
  }, [formData.organizationName, formData.organizationType]);

  // Real-time password validation
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    }
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.organizationName.trim()) newErrors.organizationName = t('organization.register.errors.organizationNameRequired');
    if (!formData.organizationType) newErrors.organizationType = t('organization.register.errors.organizationTypeRequired');
    if (!formData.sectorLevel) newErrors.sectorLevel = t('organization.register.errors.sectorLevelRequired');
    if (!formData.officialEmail.trim()) newErrors.officialEmail = t('organization.register.errors.officialEmailRequired');
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('organization.register.errors.phoneNumberRequired');
    if (!formData.adminFullName.trim()) newErrors.adminFullName = t('organization.register.errors.adminNameRequired');
    if (!formData.adminEmail.trim()) newErrors.adminEmail = t('organization.register.errors.adminEmailRequired');
    if (!formData.password) newErrors.password = t('organization.register.errors.passwordRequired');
    if (!formData.confirmPassword) newErrors.confirmPassword = t('organization.register.errors.confirmPasswordRequired');

    // Email format validation
    if (formData.officialEmail && !validateEmail(formData.officialEmail)) {
      newErrors.officialEmail = t('organization.register.errors.officialEmailInvalid');
    }
    if (formData.adminEmail && !validateEmail(formData.adminEmail)) {
      newErrors.adminEmail = t('organization.register.errors.adminEmailInvalid');
    }

    // Phone number validation
    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = t('organization.register.errors.phoneNumberInvalid');
    }

    // Strong password validation
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = t('organization.register.errors.passwordInvalid');
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('organization.register.errors.passwordMismatch');
    }

    // CAPTCHA validation
    if (captchaInput !== captcha) {
      newErrors.captcha = t('organization.register.errors.captchaError');
    }

    // Terms agreement
    if (!formData.agreeToTerms) newErrors.agreeToTerms = t('organization.register.errors.termsRequired');
    if (!formData.agreeToPrivacy) newErrors.agreeToPrivacy = t('organization.register.errors.privacyRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // MERN stack API endpoint for registration
      const response = await fetch('http://localhost:5001/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          subscriptionPlan: formData.subscriptionPlan,
          // Security
          captchaVerified: true
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store registration data for verification page
        localStorage.setItem('registrationData', JSON.stringify({
          organizationName: formData.organizationName,
          adminEmail: formData.adminEmail,
          organizationId: formData.organizationId
        }));
        
        // Redirect to organization dashboard after email verification
        setCurrentPage('organization-verification');
      } else {
        setErrors({ submit: result.message || t('organization.register.errors.registrationFailed') });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: t('organization.register.errors.networkError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} py-12`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Language Selector */}
        <div className="mb-6">
          <div className="flex justify-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => i18n.changeLanguage(lang.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  i18n.language === lang.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {lang.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('organization.register.title')}
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('organization.register.subtitle')}
          </p>
        </div>

        {/* Registration Form */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Organization Information Section */}
            <section>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                <Building2 className="h-5 w-5 mr-2" />
                {t('organization.register.organizationInfo.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.name')} *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.organizationName ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.organizationInfo.namePlaceholder')}
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
                        {t(`organization.register.organizationTypes.${type.value}`)}
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
                        {t(`organization.register.sectorLevels.${level.value}`)}
                      </option>
                    ))}
                  </select>
                  {errors.sectorLevel && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.sectorLevel}
                    </p>
                  )}
                </div>

                {/* Official Email Address */}
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
                  {errors.officialEmail && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.officialEmail}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
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
                      } ${errors.phoneNumber ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.organizationInfo.phoneNumberPlaceholder')}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Physical Address */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.organizationInfo.address')}
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      
                      <input
                        type="text"
                        value={formData.physicalAddress.street}
                        onChange={(e) => setFormData({
                          ...formData, 
                          physicalAddress: {...formData.physicalAddress, street: e.target.value}
                        })}
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
                        onChange={(e) => setFormData({
                          ...formData, 
                          physicalAddress: {...formData.physicalAddress, city: e.target.value}
                        })}
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
                        onChange={(e) => setFormData({
                          ...formData, 
                          physicalAddress: {...formData.physicalAddress, region: e.target.value}
                        })}
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
                        onChange={(e) => setFormData({
                          ...formData, 
                          physicalAddress: {...formData.physicalAddress, postalCode: e.target.value}
                        })}
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
              </div>
            </section>

            {/* Admin Account Information Section */}
            <section>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                
                {t('organization.register.adminAccount.title')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Full Name */}
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
                  
                  {/* Strong Password Rules Display */}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs space-y-1">
                        <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.minLength ? '' : ''}
                          {t('organization.register.adminAccount.passwordRequirements.minLength')}
                        </div>
                        <div className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.hasUppercase ? '' : ''}
                          {t('organization.register.adminAccount.passwordRequirements.uppercase')}
                        </div>
                        <div className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.hasLowercase ? '' : ''}
                          {t('organization.register.adminAccount.passwordRequirements.lowercase')}
                        </div>
                        <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.hasNumber ? '' : ''}
                          {t('organization.register.adminAccount.passwordRequirements.number')}
                        </div>
                        <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                          {passwordValidation.hasSpecialChar ? '' : ''}
                          {t('organization.register.adminAccount.passwordRequirements.special')}
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* System Fields Section */}
            <section>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                
                System Configuration
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auto-generated Organization ID */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.confirmation.organizationId')}
                  </label>
                  <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded-lg p-3`}>
                    <span className="font-mono text-sm">{formData.organizationId || 'Will be generated automatically'}</span>
                  </div>
                </div>

                {/* Default Subscription Plan */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {t('organization.register.confirmation.plan')}
                  </label>
                  <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded-lg p-4 flex items-center justify-between`}>
                    <div>
                      <span className="text-sm font-semibold">Free Plan</span>
                      <p className="text-xs text-gray-500 mt-1">Includes 14-day trial with full features</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </section>

            {/* CAPTCHA Security Section */}
            <section>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                
                {t('organization.register.confirmation.securityVerification')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    CAPTCHA Verification *
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded-lg p-4 flex items-center space-x-4`}>
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
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } ${errors.captcha ? 'border-red-500' : ''}`}
                      placeholder={t('organization.register.confirmation.captchaPlaceholder')}
                    />
                  </div>
                  {errors.captcha && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      
                      {errors.captcha}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Terms and Conditions */}
            <section>
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                
                Legal Agreements
              </h2>
              
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
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:text-blue-500 underline font-medium"
                    >
                      {t('legal.termsOfService')}
                    </button>
                    {' '}*
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 flex items-center ml-7">
                    
                    {errors.agreeToTerms}
                  </p>
                )}
                
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
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-blue-600 hover:text-blue-500 underline font-medium"
                    >
                      {t('legal.privacyPolicy')}
                    </button>
                    {' '}*
                  </label>
                </div>
                {errors.agreeToPrivacy && (
                  <p className="text-sm text-red-600 flex items-center ml-7">
                    
                    {errors.agreeToPrivacy}
                  </p>
                )}
                
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
                  <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    By registering your organization, you confirm that you have the authority to bind your organization to these agreements and that all information provided is accurate and complete.
                  </p>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              {errors.submit && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('organization.register.confirmation.creatingOrganization')}
                  </>
                ) : (
                  <>
                    {t('organization.register.confirmation.createOrganization')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </div>
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

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('legal.termsOfService')}
              </h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                
              </button>
            </div>
            
            <div className={`px-6 py-4 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                  <p className="text-sm leading-relaxed">
                    By registering your organization on the Public Sector Lost & Found Platform, you agree to be bound by these Terms and Conditions. These terms govern your use of our SaaS platform and all related services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. Organization Registration</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    You represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>You have the authority to bind your organization to these terms</li>
                    <li>All information provided during registration is accurate and complete</li>
                    <li>Your organization is a legitimate public sector entity</li>
                    <li>You will maintain the security of your account credentials</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Service Usage</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    The platform provides lost and found management services for public sector organizations. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Use the service only for legitimate lost and found purposes</li>
                    <li>Not misuse or abuse the platform</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Respect the privacy and data of users</li>
                    <li>Not attempt to access unauthorized areas of the platform</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Data Responsibility</h3>
                  <p className="text-sm leading-relaxed">
                    Your organization is responsible for all data entered into the system, including lost item reports, found item listings, and user information. You must ensure compliance with data protection regulations applicable to your jurisdiction.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">5. Subscription and Billing</h3>
                  <p className="text-sm leading-relaxed">
                    Organizations start with a free 14-day trial. After the trial period, subscription fees apply based on your selected plan. Payment terms, cancellation policies, and refund conditions are outlined in your subscription agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">6. Service Availability</h3>
                  <p className="text-sm leading-relaxed">
                    While we strive for 99.9% uptime, we do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance. We are not liable for service interruptions beyond our reasonable control.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">7. Intellectual Property</h3>
                  <p className="text-sm leading-relaxed">
                    The platform, including all software, designs, and content, remains our intellectual property. You receive a limited license to use the service for your organization's lost and found management needs.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">8. Termination</h3>
                  <p className="text-sm leading-relaxed">
                    Either party may terminate the service agreement with 30 days notice. We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, you may export your data within 30 days.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">9. Limitation of Liability</h3>
                  <p className="text-sm leading-relaxed">
                    Our liability is limited to the amount paid for the service in the preceding 12 months. We are not liable for indirect, incidental, or consequential damages arising from service use.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">10. Changes to Terms</h3>
                  <p className="text-sm leading-relaxed">
                    We may update these terms periodically. Significant changes will be communicated via email. Continued use of the service after changes constitutes acceptance of the updated terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">11. Contact Information</h3>
                  <p className="text-sm leading-relaxed">
                    For questions about these terms, contact us at: support@publicsectorlf.com or call +1-800-555-0123
                  </p>
                </section>

                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className="text-sm font-medium">
                    Last Updated: January 13, 2026
                  </p>
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
              <button
                onClick={() => setShowTermsModal(false)}
                className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setFormData({...formData, agreeToTerms: true});
                  setShowTermsModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('legal.privacyPolicy')}
              </h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                
              </button>
            </div>
            
            <div className={`px-6 py-4 overflow-y-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    We collect the following types of information:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li><strong>Organization Information:</strong> Name, type, sector level, contact details, physical address</li>
                    <li><strong>Admin Account Information:</strong> Full name, email address, encrypted password</li>
                    <li><strong>User Data:</strong> Information about users within your organization</li>
                    <li><strong>Lost & Found Data:</strong> Item descriptions, images, locations, dates, and related information</li>
                    <li><strong>Usage Data:</strong> Log data, IP addresses, browser information, and platform usage statistics</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    We use collected information to:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Provide and maintain the lost and found management service</li>
                    <li>Process and manage lost and found item reports</li>
                    <li>Communicate with you about service updates and support</li>
                    <li>Improve platform functionality and user experience</li>
                    <li>Ensure security and prevent fraud or abuse</li>
                    <li>Comply with legal obligations and regulations</li>
                    <li>Generate anonymized analytics and reports</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">3. Data Storage and Security</h3>
                  <p className="text-sm leading-relaxed">
                    We implement industry-standard security measures to protect your data, including encryption at rest and in transit, secure authentication, regular security audits, and access controls. Data is stored on secure cloud servers with regular backups. However, no system is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">4. Data Sharing and Disclosure</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    We do not sell your data. We may share information only in these circumstances:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li><strong>Within Your Organization:</strong> Data is accessible to authorized users in your organization</li>
                    <li><strong>Service Providers:</strong> Third-party services that help us operate the platform (hosting, email, analytics)</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                    <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly authorize data sharing</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
                  <p className="text-sm leading-relaxed">
                    We retain your data for as long as your account is active or as needed to provide services. After account termination, data is retained for 90 days for recovery purposes, then permanently deleted unless legal obligations require longer retention. You may request data deletion at any time.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                  <p className="text-sm leading-relaxed mb-2">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Access your personal data and organization information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Request deletion of your data (subject to legal requirements)</li>
                    <li>Export your data in a portable format</li>
                    <li>Object to certain data processing activities</li>
                    <li>Withdraw consent for data processing</li>
                    <li>Lodge a complaint with data protection authorities</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">7. Cookies and Tracking</h3>
                  <p className="text-sm leading-relaxed">
                    We use cookies and similar technologies to maintain sessions, remember preferences, and analyze platform usage. You can control cookie settings through your browser, but some features may not function properly if cookies are disabled.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">8. Children's Privacy</h3>
                  <p className="text-sm leading-relaxed">
                    Our service is designed for public sector organizations and is not intended for children under 13. We do not knowingly collect information from children. If we become aware of such collection, we will delete the information immediately.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">9. International Data Transfers</h3>
                  <p className="text-sm leading-relaxed">
                    Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">10. Changes to Privacy Policy</h3>
                  <p className="text-sm leading-relaxed">
                    We may update this privacy policy periodically. Significant changes will be communicated via email and posted on the platform. The "Last Updated" date indicates when changes were made. Continued use after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">11. Contact Us</h3>
                  <p className="text-sm leading-relaxed">
                    For privacy-related questions, data requests, or concerns, contact our Data Protection Officer at:
                  </p>
                  <ul className="list-none text-sm space-y-1 ml-4 mt-2">
                    <li>Email: privacy@publicsectorlf.com</li>
                    <li>Phone: +1-800-555-0123</li>
                    <li>Mail: Public Sector Lost & Found Platform, Data Protection Office</li>
                  </ul>
                </section>

                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <p className="text-sm font-medium">
                    Last Updated: January 13, 2026
                  </p>
                  <p className="text-xs mt-2">
                    This privacy policy complies with GDPR, CCPA, and other applicable data protection regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className={`px-6 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setFormData({...formData, agreeToPrivacy: true});
                  setShowPrivacyModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accept Privacy Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicSectorRegistration;