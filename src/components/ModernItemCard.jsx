import { useTranslation } from 'react-i18next';
import { Eye, Mail, Trash2, CheckCircle, MapPin, Calendar, Tag } from 'lucide-react';

const ModernItemCard = ({ 
  item, 
  isLoggedIn, 
  userRole, 
  onViewDetails, 
  onClaim, 
  onDelete, 
  onContact,
  darkMode 
}) => {
  const { t, i18n } = useTranslation();

  // Helper function to get translated text for mock items
  const getTranslatedText = (field, originalText) => {
    // Check if this is a mock item by looking for translation key
    if (item.translationKey) {
      const key = `mockItems.${item.translationKey}.${field}`;
      const translated = t(key);
      // If translation exists and is different from the key, use it
      if (translated && translated !== key) {
        return translated;
      }
    }
    // Otherwise return original text (for real user data)
    return originalText;
  };
  
  // Force component to be aware of language changes
  const currentLang = i18n.language;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('time.today');
    if (diffDays === 2) return t('time.yesterday');
    if (diffDays <= 7) return t('time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border group`}>
      {/* Image Section */}
      <div className={`relative aspect-w-16 aspect-h-9 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {item.imageUrl && item.imageUrl !== 'local_preview' ? (
          <>
            <img 
              src={item.imageUrl} 
              alt={getTranslatedText('title', item.title)}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // If image fails to load, hide it and show fallback
                console.warn('Image failed to load:', item.imageUrl);
                e.target.style.display = 'none';
                const fallback = e.target.parentNode.querySelector('.image-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
              onLoad={(e) => {
                // If image loads successfully, hide fallback
                const fallback = e.target.parentNode.querySelector('.image-fallback');
                if (fallback) fallback.style.display = 'none';
              }}
            />
            {/* Fallback placeholder - shown if image fails to load */}
            <div 
              className={`image-fallback absolute inset-0 w-full h-48 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'} flex items-center justify-center hidden`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2"></div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{t(`categories.${item.category}`)}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Image not available</p>
              </div>
            </div>
          </>
        ) : (
          <div className={`w-full h-48 ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-4xl mb-2"></div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize`}>{t(`categories.${item.category}`)}</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            item.status === 'Lost' 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {t(`status.${item.status.toLowerCase()}`)}
          </span>
        </div>

        {/* Claimed Badge */}
        {item.claimed && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {t('status.claimed')}
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔍 View Details clicked for item:', item);
              
              // Try multiple approaches to ensure it works
              if (onViewDetails) {
                onViewDetails(item);
              } else {
                // Fallback: Create a custom event to trigger navigation
                const event = new CustomEvent('viewItemDetails', { 
                  detail: { item: item }
                });
                window.dispatchEvent(event);
              }
            }}
            className={`${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-50'} px-4 py-2 rounded-lg font-medium shadow-lg transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <Eye className="h-5 w-5" />
            <span>{t('items.viewDetails') || 'View Details'}</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg leading-tight line-clamp-2`}>
            {getTranslatedText('title', item.title)}
          </h3>
          <div className={`flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-3`}>
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(item.date || item.createdAt)}
          </div>
        </div>

        {/* Description */}
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>
          {getTranslatedText('description', item.description)}
        </p>

        {/* Location */}
        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          <MapPin className="h-4 w-4 mr-1" />
          <span>{getTranslatedText('location', item.location)}</span>
        </div>

        {/* Category */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            <Tag className="h-3 w-3 mr-1" />
            {t(`categories.${item.category}`)}
          </span>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {/* Contact Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn && (
              <button
                onClick={() => onContact && onContact(item)}
                className={`flex items-center ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
              >
                <Mail className="h-4 w-4 mr-1" />
                <span className="text-sm">{t('items.contact')}</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {isLoggedIn && !item.claimed && onClaim && (
              <button
                onClick={() => onClaim(item._id || item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.status === 'Lost'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {item.status === 'Lost' ? t('items.iFoundThis') : t('items.thisIsMine')}
              </button>
            )}

            {/* Report Item Button for Users */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  const reportReason = prompt('Report this item to admin:\n\n1. Incorrect information\n2. Inappropriate content\n3. Already returned\n4. Other issue\n\nPlease describe the issue:');
                  if (reportReason) {
                    window.location.href = `mailto:admin@platform.com?subject=Item Report - ${item.title}&body=Hello Admin,%0D%0A%0D%0AI want to report an issue with this item:%0D%0A%0D%0AItem: ${encodeURIComponent(item.title)}%0D%0AItem ID: ${encodeURIComponent(item._id || item.id)}%0D%0ALocation: ${encodeURIComponent(item.location)}%0D%0AStatus: ${item.status}%0D%0A%0D%0AReported by: ${item.owner?.name || 'User'}%0D%0AIssue: ${encodeURIComponent(reportReason)}%0D%0A%0D%0APlease review this item.%0D%0A%0D%0AThank you!`;
                  }
                }}
                className="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                title="Report issue with this item"
              >
                🚨 Report
              </button>
            )}

            {userRole === 'admin' && onDelete && (
              <button
                onClick={() => onDelete(item._id || item.id)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernItemCard;