import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    organizationName: '',
    organizationType: '',
    sectorLevel: '',
    officialEmail: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      region: '',
      country: 'Ethiopia',
      postalCode: ''
    },
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    organizationId: '',
    defaultLanguage: i18n.language || 'en',
    subscriptionPlan: 'free',
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

  // Validation functions
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
    
    if (formData.organizationName && formData.organizationType) {
      const newId = generateOrganizationId(formData.organizationName, formData.organizationType);
      setFormData(prev => ({ ...prev, organizationId: newId }));
    }
  }, [formData.organizationName, formData.organizationType]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = {};
    
    if (currentStep === 1) {
      if (!formData.organizationName.trim()) stepErrors.organizationName = t('organization.register.organizationInfo.nameRequired');
      if (!formData.organizationType) stepErrors.organizationType = t('organization.register.organizationInfo.typeRequired');
      if (!formData.sectorLevel) stepErrors.sectorLevel = t('organization.register.organizationInfo.sectorLevelRequired');
      if (!formData.officialEmail.trim()) stepErrors.officialEmail = t('organization.register.organizationInfo.officialEmailRequired');
      else if (!validateEmail(formData.officialEmail)) stepErrors.officialEmail = t('organization.register.organizationInfo.officialEmailInvalid');
      if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = t('organization.register.organizationInfo.phoneNumberRequired');
      else if (!validatePhoneNumber(formData.phoneNumber)) stepErrors.phoneNumber = t('organization.register.organizationInfo.phoneNumberInvalid');
    }
    
    if (currentStep === 2) {
      if (!formData.adminName.trim()) stepErrors.adminName = t('organization.register.adminAccount.nameRequired');
      if (!formData.adminEmail.trim()) stepErrors.adminEmail = t('organization.register.adminAccount.emailRequired');
      else if (!validateEmail(formData.adminEmail)) stepErrors.adminEmail = t('organization.register.adminAccount.emailInvalid');
      
      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) stepErrors.password = t('organization.register.adminAccount.passwordRequired');
      else if (!passwordValidation.isValid) stepErrors.password = t('organization.register.adminAccount.passwordInvalid');
      
      if (!formData.confirmPassword) stepErrors.confirmPassword = t('organization.register.adminAccount.confirmPasswordRequired');
      else if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = t('organization.register.adminAccount.passwordMismatch');
    }
    
    if (currentStep === 3) {
      if (!formData.agreeToTerms) stepErrors.agreeToTerms = t('organization.register.confirmation.termsRequired');
      if (!formData.agreeToPrivacy) stepErrors.agreeToPrivacy = t('organization.register.confirmation.privacyRequired');
      if (captchaInput !== captcha) {
        stepErrors.captcha = t('organization.register.confirmation.captchaError');
        setCaptchaError(t('organization.register.confirmation.captchaError'));
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

    // Final submission
    setLoading(true);
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationName: formData.organizationName.trim(),
          organizationType: formData.organizationType,
          sectorLevel: formData.sectorLevel,
          officialEmail: formData.officialEmail.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          address: formData.address,
          adminName: formData.adminName.trim(),
          adminEmail: formData.adminEmail.trim(),
          password: formData.password,
          organizationId: formData.organizationId,
          defaultLanguage: formData.defaultLanguage,
          subscriptionPlan: formData.subscriptionPlan,
          captchaVerified: true
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('registrationData', JSON.stringify({
          organizationName: formData.organizationName,
          adminEmail: formData.adminEmail,
          organizationId: formData.organizationId
        }));
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
                  {currentStep > step ? (
                    
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  
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
