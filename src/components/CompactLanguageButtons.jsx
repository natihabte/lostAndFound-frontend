import React from 'react';
import { useTranslation } from 'react-i18next';

const CompactLanguageButtons = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', short: 'EN', flag: '🇬🇧' },
    { code: 'am', short: 'አማ', flag: '🇪🇹' },
    { code: 'om', short: 'OM', flag: '🇪🇹' },
    { code: 'ti', short: 'ትግ', flag: '🇪🇹' }
  ];

  const handleLanguageChange = (languageCode) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
            i18n.language === language.code
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
          }`}
          title={`Switch to ${language.short}`}
        >
          {language.flag}
        </button>
      ))}
    </div>
  );
};

export default CompactLanguageButtons;