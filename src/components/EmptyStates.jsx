import React from 'react';
import { useTranslation } from 'react-i18next';

// Generic Empty State Component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel,
  variant = 'default', // 'default', 'success', 'info', 'warning'
  darkMode = false
}) => {
  const variants = {
    default: {
      iconBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
      iconColor: darkMode ? 'text-gray-500' : 'text-gray-400',
      titleColor: darkMode ? 'text-white' : 'text-gray-900',
      descColor: darkMode ? 'text-gray-300' : 'text-gray-600'
    },
    success: {
      iconBg: darkMode ? 'bg-green-900' : 'bg-green-100',
      iconColor: darkMode ? 'text-green-400' : 'text-green-600',
      titleColor: darkMode ? 'text-white' : 'text-gray-900',
      descColor: darkMode ? 'text-gray-300' : 'text-gray-600'
    },
    info: {
      iconBg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
      iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
      titleColor: darkMode ? 'text-white' : 'text-gray-900',
      descColor: darkMode ? 'text-gray-300' : 'text-gray-600'
    },
    warning: {
      iconBg: darkMode ? 'bg-yellow-900' : 'bg-yellow-100',
      iconColor: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      titleColor: darkMode ? 'text-white' : 'text-gray-900',
      descColor: darkMode ? 'text-gray-300' : 'text-gray-600'
    }
  };

  const style = variants[variant];

  return (
    <div className="text-center py-12 px-4">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${style.iconBg} rounded-2xl mb-4`}>
        
      </div>
      <h3 className={`text-xl font-semibold ${style.titleColor} mb-2`}>{title}</h3>
      <p className={`${style.descColor} max-w-md mx-auto mb-6`}>{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// No Items Found
export const NoItemsFound = ({ 
  onClearFilters, 
  hasFilters, 
  searchTerm, 
  darkMode = false, 
  onReportItem, 
  isLoggedIn, 
  showReportButton = false 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-12 px-4">
      <div className={`inline-flex items-center justify-center w-16 h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl mb-4`}>
        
      </div>
      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
        {hasFilters ? t('search.noResults') : "No items yet"}
      </h3>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-md mx-auto mb-6`}>
        {hasFilters
          ? searchTerm 
            ? t('search.noResultsWithTerm', { term: searchTerm })
            : t('messages.noItemsFound')
          : "No items have been posted in this organization yet. Report lost or found items to admin."
        }
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('search.clearFilters') || 'Clear Filters'}
          </button>
        )}
        
        {showReportButton && (
          <button
            onClick={onReportItem}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              isLoggedIn
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? '📝 Report Item to Admin' : 'Login to Report Items'}
          </button>
        )}
      </div>
    </div>
  );
};

// No Posts Yet
export const NoPosts = ({ onCreatePost }) => {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('emptyStates.noPosts.title')}
      description={t('emptyStates.noPosts.description')}
      action={onCreatePost}
      actionLabel={t('emptyStates.noPosts.action')}
      variant="info"
    />
  );
};

// No Claims Yet
export const NoClaims = () => {
  const { t } = useTranslation();
  return (
    <EmptyState
      title={t('emptyStates.noClaims.title')}
      description={t('emptyStates.noClaims.description')}
      variant="success"
    />
  );
};

// Login Required
export const LoginRequired = ({ onLogin, message }) => {
  const { t } = useTranslation();
  return (
    <EmptyState
      title="Login Required"
      description={message || t('auth.loginToAccess')}
      action={onLogin}
      actionLabel={t('navigation.login')}
      variant="info"
    />
  );
};

// Welcome Message for New Users
export const WelcomeMessage = ({ userName, onGetStarted, darkMode }) => {
  const { t } = useTranslation();
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'} rounded-2xl p-8 mb-8 border`}>
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {t('welcome.title', { userName })}
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
            {t('welcome.communityMessage')}
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('welcome.browseItems')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('welcome.postItems')}</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('welcome.contactOwners')}</span>
            </li>
          </ul>
          {onGetStarted && (
            <button
              onClick={onGetStarted}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('navigation.getStarted')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Error Message Component
export const ErrorMessage = ({ title, message, onRetry, onDismiss }) => (
  <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4" role="alert">
    <div className="flex items-start">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-800 mb-1">{title}</h4>
        <p className="text-sm text-red-700">{message}</p>
        {(onRetry || onDismiss) && (
          <div className="mt-3 flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-red-800 hover:text-red-900 focus:outline-none focus:underline"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-red-700 hover:text-red-800 focus:outline-none focus:underline"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Success Message Component
export const SuccessMessage = ({ title, message, onDismiss }) => (
  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4" role="alert">
    <div className="flex items-start">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-green-800 mb-1">{title}</h4>
        <p className="text-sm text-green-700">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-2 text-sm font-medium text-green-800 hover:text-green-900 focus:outline-none focus:underline"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  </div>
);

// Info Message Component
export const InfoMessage = ({ title, message, onAction, actionLabel }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4" role="alert">
    <div className="flex items-start">
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-blue-800 mb-1">{title}</h4>
        <p className="text-sm text-blue-700">{message}</p>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="mt-2 text-sm font-medium text-blue-800 hover:text-blue-900 focus:outline-none focus:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  </div>
);

// Loading State Component
export const LoadingState = ({ message, darkMode = false }) => {
  const { t } = useTranslation();
  const defaultMessage = message || "Loading...";
  
  return (
    <div className="text-center py-12">
      <div className={`inline-block animate-spin rounded-full h-12 w-12 border-4 ${
        darkMode ? 'border-gray-700 border-t-blue-400' : 'border-gray-200 border-t-blue-600'
      } mb-4`}></div>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{defaultMessage}</p>
    </div>
  );
};

// Community Stats Component
export const CommunityStats = ({ stats, hasFilters = false, darkMode = false }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`${
      darkMode 
        ? 'bg-gradient-to-r from-blue-800 to-indigo-800' 
        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
    } rounded-2xl p-6 text-white mb-8`}>
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold">
          {hasFilters && stats.totalItems === 0 ? t('search.noResults') : t('stats.communityImpact')}
        </h3>
      </div>
      {hasFilters && stats.totalItems === 0 ? (
        <div className="text-center py-4">
          <div className="text-2xl font-bold mb-2">{t('search.noMatches')}</div>
          <div className="text-blue-100 text-sm">{t('search.tryAdjusting')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold">{stats.totalItems || 0}</div>
            <div className="text-blue-100 text-sm">{t('stats.totalItems')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-300">{stats.totalLost || 0}</div>
            <div className="text-blue-100 text-sm">{t('stats.lostItems')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-300">{stats.totalFound || 0}</div>
            <div className="text-blue-100 text-sm">{t('stats.foundItems')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

