import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Language Debugger Component
 * Shows current language state and allows quick testing
 * Remove this component in production
 */
const LanguageDebugger = () => {
  const { i18n, t } = useTranslation();
  const [showDebug, setShowDebug] = React.useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-purple-700 text-xs font-bold z-50"
        title="Show Language Debug Info"
      >
        🌐 DEBUG
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-600 rounded-lg shadow-2xl p-4 z-50 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-purple-600">🌐 Language Debug</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <strong>Current Language:</strong>
          <div className="font-mono text-blue-600">{i18n.language}</div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <strong>Available Languages:</strong>
          <div className="font-mono text-green-600">
            {i18n.languages.join(', ')}
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <strong>LocalStorage:</strong>
          <div className="font-mono text-orange-600">
            {localStorage.getItem('i18nextLng') || 'Not set'}
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <strong>Test Translation:</strong>
          <div className="text-gray-700">{t('navigation.home')}</div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <strong>Quick Test:</strong>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => {
                i18n.changeLanguage('en');
                setTimeout(() => window.location.reload(), 100);
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
            >
              EN
            </button>
            <button
              onClick={() => {
                i18n.changeLanguage('am');
                setTimeout(() => window.location.reload(), 100);
              }}
              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
            >
              አማ
            </button>
            <button
              onClick={() => {
                i18n.changeLanguage('om');
                setTimeout(() => window.location.reload(), 100);
              }}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
            >
              OM
            </button>
            <button
              onClick={() => {
                i18n.changeLanguage('ti');
                setTimeout(() => window.location.reload(), 100);
              }}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
            >
              ትግ
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">
          <strong>⚠️ Note:</strong> Language changes trigger a page reload to ensure all components update properly.
        </div>
      </div>
    </div>
  );
};

export default LanguageDebugger;
