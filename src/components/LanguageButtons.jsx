import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageButtons = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'am', name: 'አማርኛ', short: 'አማ', flag: '🇪🇹' },
    { code: 'om', name: 'Afaan Oromoo', short: 'OM', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', short: 'ትግ', flag: '🇪🇹' }
  ];

  const handleLanguageChange = (languageCode) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
            i18n.language === language.code
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
          }`}
          title={`Switch to ${language.name}`}
        >
          <div className="flex items-center space-x-1">
            <span>{language.flag}</span>
            <span className="hidden sm:inline">{language.short}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default LanguageButtons;