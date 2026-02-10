import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const InlineLanguageSelector = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      nativeName: 'English',
      flag: '🇬🇧'
    },
    { 
      code: 'am', 
      name: 'Amharic', 
      nativeName: 'አማርኛ',
      flag: '🇪🇹'
    },
    { 
      code: 'om', 
      name: 'Afaan Oromoo', 
      nativeName: 'Afaan Oromoo',
      flag: '🇪🇹'
    },
    { 
      code: 'ti', 
      name: 'Tigrinya', 
      nativeName: 'ትግርኛ',
      flag: '🇪🇹'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    console.log('Changing language to:', languageCode);
    
    i18n.changeLanguage(languageCode).then(() => {
      console.log('Language changed successfully to:', i18n.language);
      localStorage.setItem('i18nextLng', languageCode);
      // Don't reload - let React handle the re-render
      // Components using useTranslation will automatically update
    }).catch((error) => {
      console.error('Error changing language:', error);
    });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Button - Styled like other header buttons */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors flex items-center space-x-1"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Current language: ${currentLanguage.nativeName}`}
      >
        
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-10 md:hidden" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {/* Language Options */}
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${
                    i18n.language === language.code 
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  role="menuitem"
                  aria-current={i18n.language === language.code ? 'true' : 'false'}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <div className="font-medium">{language.nativeName}</div>
                        <div className="text-xs text-gray-500">{language.name}</div>
                      </div>
                    </div>
                    {i18n.language === language.code && (
                      <span className="text-blue-600 font-bold" aria-label="Selected">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InlineLanguageSelector;