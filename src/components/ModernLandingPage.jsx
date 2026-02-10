import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Users, Globe, TrendingUp, Award, Heart, Star, Package, AlertCircle, CheckCircle } from 'lucide-react';
import ModernSearchBar from './ModernSearchBar';
import ModernItemCard from './ModernItemCard';

const ModernLandingPage = ({ 
  items, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  setCurrentPage,
  isLoggedIn,
  userRole,
  darkMode,
  onViewDetails,
  onClaimItem,
  onContactOwner
}) => {
  const { t, i18n } = useTranslation();
  const stats = {
    totalItems: items.length,
    totalLost: items.filter(i => i.status === 'Lost').length,
    totalFound: items.filter(i => i.status === 'Found').length,
    recentItems: items.slice(0, 6)
  };

  const categories = ['electronic', 'clothing', 'accessory', 'document', 'book', 'other'];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* ADMIN SETTINGS BUTTON - ONLY FOR ADMINS */}
      {userRole === 'admin' && (
        <div className="bg-red-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <button
              onClick={() => {
                alert('🔧 ADMIN DETECTED! Going to Admin Settings...');
                setCurrentPage('admin-settings');
              }}
              className="bg-white text-red-600 px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              ADMIN SETTINGS - CLICK HERE
            </button>
            <p className="mt-2 text-sm">Admin detected! Click to access settings</p>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className={`${darkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'} text-white`} aria-labelledby="hero-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center" aria-hidden="true">
                <Package className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold mb-6">
              {t('app.name')}
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('pages.browseSubtitle')}. 
              {t('trust.securitySubtitle')}.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <ModernSearchBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                categories={categories}
                placeholder={t('search.placeholderAdvanced')}
                darkMode={darkMode}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalItems}</div>
                <div className="text-blue-100">{t('stats.totalItems')}</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalLost}</div>
                <div className="text-red-100">{t('stats.totalLost')}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold">{stats.totalFound}</div>
                <div className="text-green-100">{t('stats.totalFound')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ml-4`}>{t('actions.lostSomething')}</h3>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('actions.lostDescription')}
            </p>
            <button
              onClick={() => isLoggedIn ? setCurrentPage('add-item') : setCurrentPage('login')}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              {t('items.reportLost')}
              
            </button>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} ml-4`}>{t('actions.foundSomething')}</h3>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {t('actions.foundDescription')}
            </p>
            <button
              onClick={() => isLoggedIn ? setCurrentPage('add-item') : setCurrentPage('login')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              {t('items.reportFound')}
              
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('actions.browseByCategory')}</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('categories.findQuickly')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => {
            const count = items.filter(item => item.category === category).length;
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage('home');
                }}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-md'} rounded-xl p-6 shadow-sm transition-all text-center group`}
              >
                <div className="text-3xl mb-3"></div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} capitalize mb-1`}>{t(`categories.${category}`)}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{count} {t('stats.items')}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('pages.recentItems')}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('pages.latestItems')}</p>
          </div>
          <button
            onClick={() => setCurrentPage('home')}
            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium flex items-center transition-colors`}
          >
            {t('pages.viewAllItems')}
            
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.recentItems.map(item => (
            <ModernItemCard
              key={`${item.id || item._id}-${i18n.language}`}
              item={item}
              isLoggedIn={isLoggedIn}
              userRole="user"
              onViewDetails={onViewDetails}
              onClaim={onClaimItem}
              onContact={onContactOwner}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* Trust & Safety */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-blue-50'} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('trust.safeAndTrusted')}</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('trust.securitySubtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('trust.securePlatform')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('trust.secureDescription')}</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('trust.verifiedOrganizations')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('trust.verifiedDescription')}</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('trust.support24x7')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t('trust.supportDescription')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Registration CTA */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-green-600 to-blue-600'} py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('organization.cta.title')}
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-green-100'} mb-8 max-w-2xl mx-auto`}>
            {t('organization.cta.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{t('organization.features.multiTenant.title')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-green-100'} text-sm`}>{t('organization.features.multiTenant.description')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('organization.features.secure.title')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-green-100'} text-sm`}>{t('organization.features.secure.description')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="text-lg font-semibold text-white mb-2">{t('organization.features.multiLanguage.title')}</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-green-100'} text-sm`}>{t('organization.features.multiLanguage.description')}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('public-sector-registration')}
            className={`${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-green-600 hover:bg-gray-100'} px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center mx-auto`}
          >
            
            {t('organization.cta.registerButton')}
            
          </button>
          <p className={`${darkMode ? 'text-gray-300' : 'text-green-100'} text-sm mt-4`}>
            {t('organization.cta.benefits')}
          </p>
        </div>
      </div>

      {/* Call to Action */}
      {!isLoggedIn && (
        <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-900'} text-white py-16`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('cta.readyToStart')}</h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('cta.joinCommunity')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('login')}
                className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-3 rounded-xl font-medium transition-colors`}
              >
                {t('auth.signUp')}
              </button>
              <button
                onClick={() => setCurrentPage('public-sector-registration')}
                className={`${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center`}
              >
                
                {t('organization.cta.registerOrganization')}
              </button>
              <button
                onClick={() => setCurrentPage('login')}
                className={`border ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-600 hover:bg-gray-800'} text-white px-8 py-3 rounded-xl font-medium transition-colors`}
              >
                {t('navigation.login')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernLandingPage;