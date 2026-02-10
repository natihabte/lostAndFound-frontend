import React from 'react';
import { useTranslation } from 'react-i18next';
const PrivacyPolicy = ({ onClose, darkMode }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex justify-between items-center`}>
          <h1 className="text-2xl font-bold flex items-center">
            
            {t('legal.privacyPolicy')}
          </h1>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} text-2xl font-bold`}
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Last Updated */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <div className="flex items-center mb-2">
              
              <span className="font-semibold">{t('legal.lastUpdated')}</span>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>December 22, 2024</p>
          </div>

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.introduction')}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {t('legal.privacyIntro')}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.informationWeCollect')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  
                  {t('legal.personalInformation')}
                </h3>
                <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-1 ml-6`}>
                  <li>{t('legal.personalInfo.name')}</li>
                  <li>{t('legal.personalInfo.email')}</li>
                  <li>{t('legal.personalInfo.phone')}</li>
                  <li>{t('legal.personalInfo.memberId')}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  
                  {t('legal.itemInformation')}
                </h3>
                <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-1 ml-6`}>
                  <li>{t('legal.itemInfo.description')}</li>
                  <li>{t('legal.itemInfo.location')}</li>
                  <li>{t('legal.itemInfo.photos')}</li>
                  <li>{t('legal.itemInfo.category')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.howWeUseInfo')}
            </h2>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>{t('legal.useInfo.facilitate')}</li>
              <li>{t('legal.useInfo.communicate')}</li>
              <li>{t('legal.useInfo.improve')}</li>
              <li>{t('legal.useInfo.security')}</li>
              <li>{t('legal.useInfo.comply')}</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.informationSharing')}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
              {t('legal.sharingPolicy')}
            </p>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>{t('legal.sharing.consent')}</li>
              <li>{t('legal.sharing.legal')}</li>
              <li>{t('legal.sharing.safety')}</li>
              <li>{t('legal.sharing.university')}</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.dataSecurity')}
            </h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-4`}>
              {t('legal.securityMeasures')}
            </p>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>{t('legal.security.encryption')}</li>
              <li>{t('legal.security.access')}</li>
              <li>{t('legal.security.monitoring')}</li>
              <li>{t('legal.security.updates')}</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.yourRights')}
            </h2>
            <ul className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} list-disc list-inside space-y-2`}>
              <li>{t('legal.rights.access')}</li>
              <li>{t('legal.rights.correct')}</li>
              <li>{t('legal.rights.delete')}</li>
              <li>{t('legal.rights.restrict')}</li>
              <li>{t('legal.rights.portability')}</li>
              <li>{t('legal.rights.object')}</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              
              {t('legal.contactUs')}
            </h2>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 space-y-2`}>
              <div className="flex items-center">
                
                <span>privacy@publicsectorlf.com</span>
              </div>
              <div className="flex items-center">
                
                <span>+1-800-555-0123</span>
              </div>
              <div className="flex items-center">
                
                <span>Public Sector Lost & Found Platform, Global</span>
              </div>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('legal.changesToPolicy')}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {t('legal.policyChanges')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;