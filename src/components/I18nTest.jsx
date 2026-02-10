import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Simple test component to verify i18n is working
 */
const I18nTest = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">i18n Test</h2>
      
      <div className="space-y-2 text-sm">
        <p><strong>Current Language:</strong> {i18n.language}</p>
        <p><strong>App Name:</strong> {t('app.name')}</p>
        <p><strong>Tagline:</strong> {t('app.tagline')}</p>
        <p><strong>Home:</strong> {t('navigation.home')}</p>
        <p><strong>Search Placeholder:</strong> {t('search.placeholder')}</p>
      </div>

      <div className="mt-4 space-x-2">
        <button 
          onClick={() => i18n.changeLanguage('en')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          English
        </button>
        <button 
          onClick={() => i18n.changeLanguage('am')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          አማርኛ
        </button>
        <button 
          onClick={() => i18n.changeLanguage('om')}
          className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
        >
          Afaan Oromoo
        </button>
        <button 
          onClick={() => i18n.changeLanguage('ti')}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm"
        >
          ትግርኛ
        </button>
      </div>
    </div>
  );
};

export default I18nTest;