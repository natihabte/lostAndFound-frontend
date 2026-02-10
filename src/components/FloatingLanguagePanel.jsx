import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
const FloatingLanguagePanel = () => {
  const { i18n, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const languages = [
    { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧' },
    { code: 'am', name: 'አማርኛ', short: 'አማ', flag: '🇪🇹' },
    { code: 'om', name: 'Afaan Oromoo', short: 'OM', flag: '🇪🇹' },
    { code: 'ti', name: 'ትግርኛ', short: 'ትግ', flag: '🇪🇹' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode);
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            
            <span className="text-sm font-medium">Language</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              {isExpanded ? '' : '+'}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              
            </button>
          </div>
        </div>

        {/* Current Language Display */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLanguage.flag}</span>
            <div>
              <div className="font-medium text-gray-900">{currentLanguage.name}</div>
              <div className="text-xs text-gray-500">Current: {i18n.language}</div>
            </div>
          </div>
        </div>

        {/* Language Options */}
        {isExpanded && (
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Click to change:</div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`p-2 rounded-md text-sm font-medium transition-all ${
                    i18n.language === language.code
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-xs">{language.short}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access Buttons (when collapsed) */}
        {!isExpanded && (
          <div className="p-2">
            <div className="flex space-x-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    i18n.language === language.code
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                  title={language.name}
                >
                  {language.flag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingLanguagePanel;