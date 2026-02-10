import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';

const FloatingControls = ({ darkMode, setDarkMode }) => {
  const { i18n, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const controlsRef = useRef(null);

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
    }).catch((error) => {
      console.error('Error changing language:', error);
    });
    setShowLanguageMenu(false);
    setIsExpanded(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowLanguageMenu(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div 
      ref={controlsRef}
      className="floating-controls fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3"
    >
      {/* Language Menu */}
      {showLanguageMenu && (
        <div className={`language-menu-backdrop ${darkMode ? 'bg-gray-800/95 border-gray-600' : 'bg-white/95 border-gray-200'} border rounded-xl shadow-2xl p-2 mb-2 animate-in slide-in-from-bottom-2 duration-200`}>
          <div className="space-y-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                  i18n.language === language.code 
                    ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-50'}`
                }`}
              >
                <span className="text-lg mr-3">{language.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{language.nativeName}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language.name}</div>
                </div>
                {i18n.language === language.code && (
                  <span className="ml-auto text-blue-600 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="flex flex-col space-y-2 animate-in slide-in-from-bottom-2 duration-200">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`floating-control-button w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              darkMode 
                ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400' 
                : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            }`}
            aria-label={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
            title={darkMode ? t('theme.switchToLight') : t('theme.switchToDark')}
          >
            {darkMode ? '' : ''}
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className={`floating-control-button w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label={t('language.select')}
            title={`${t('language.select')}: ${currentLanguage.nativeName}`}
          >
            
          </button>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`floating-main-button w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          darkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700 border-2 border-gray-600' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
        } ${isExpanded ? 'expanded' : ''}`}
        aria-label={isExpanded ? 'Close controls' : 'Open controls'}
        title={isExpanded ? 'Close controls' : 'Open controls'}
      >
        {isExpanded ? (
          
        ) : (
          
        )}
      </button>

      {/* Quick Access Indicators */}
      {!isExpanded && (
        <div className="absolute -top-2 -left-2 flex flex-col space-y-1">
          {/* Current Language Indicator */}
          <div className={`floating-indicator w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
          } shadow-lg`}>
            {currentLanguage.flag}
          </div>
          
          {/* Dark Mode Indicator */}
          <div className={`floating-indicator w-6 h-6 rounded-full flex items-center justify-center ${
            darkMode 
              ? 'bg-yellow-500 text-yellow-900' 
              : 'bg-gray-800 text-yellow-400'
          } shadow-lg`}>
            {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingControls;