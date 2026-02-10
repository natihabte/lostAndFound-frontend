import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// Quick test buttons for debugging
const QuickLanguageTest = () => {
  const { i18n } = useTranslation();
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <div className="text-xs font-bold mb-2">Quick Language Test</div>
      <div className="flex space-x-2">
        <button onClick={() => i18n.changeLanguage('en')} className="px-2 py-1 bg-gray-200 rounded text-xs">EN</button>
        <button onClick={() => i18n.changeLanguage('am')} className="px-2 py-1 bg-gray-200 rounded text-xs">አማ</button>
        <button onClick={() => i18n.changeLanguage('om')} className="px-2 py-1 bg-gray-200 rounded text-xs">OM</button>
        <button onClick={() => i18n.changeLanguage('ti')} className="px-2 py-1 bg-gray-200 rounded text-xs">ትግ</button>
      </div>
      <div className="text-xs mt-2">Current: {i18n.language}</div>
    </div>
  );
};

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'om', name: 'Afaan Oromoo', nativeName: 'Afaan Oromoo' },
    { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode).then(() => {
      console.log('Language changed successfully to:', i18n.language);
    }).catch((error) => {
      console.error('Error changing language:', error);
    });
    setIsOpen(false);
  };

  return (
    <>
      <QuickLanguageTest />
      <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md hover:shadow-lg"
        aria-label={t('language.select')}
        title={`${t('language.select')}: ${currentLanguage.nativeName}`}
      >
        
        <span className="font-medium">{currentLanguage.nativeName}</span>
        
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                    i18n.language === language.code 
                      ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500 mt-1">{language.name}</div>
                    </div>
                    {i18n.language === language.code && (
                      <span className="text-blue-600 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default LanguageSwitcher;