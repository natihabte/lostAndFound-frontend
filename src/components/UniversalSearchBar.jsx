import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Universal Search Bar Component
 * 
 * A reusable, accessible search input component that filters items by title and description.
 * 
 * @param {string} value - Current search term (controlled input)
 * @param {function} onChange - Callback when search term changes
 * @param {string} placeholder - Placeholder text for the input
 * @param {string} className - Additional CSS classes for customization
 */
const UniversalSearchBar = ({ 
  value = '', 
  onChange, 
  placeholder, 
  className = '',
  darkMode = false 
}) => {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder || t('search.placeholder');
  
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon */}
      
      
      {/* Search Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={defaultPlaceholder}
        className={`w-full pl-10 pr-10 py-3 border ${
          darkMode 
            ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:bg-gray-600 placeholder-gray-400' 
            : 'border-gray-300 bg-gray-100 text-black focus:ring-gray-500 focus:bg-white placeholder-gray-500'
        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
        aria-label={t('search.searchItems')}
      />
      
      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${
            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
          } rounded-full transition-colors`}
          aria-label={t('search.clearFilters')}
        >
          
        </button>
      )}
    </div>
  );
};

/**
 * Filter items based on search term
 * Case-insensitive search across title and description
 * 
 * @param {Array} items - Array of items to filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} Filtered items
 */
export const filterItemsBySearch = (items, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return items;
  }

  const query = searchTerm.trim().toLowerCase();
  
  return items.filter(item => {
    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    
    return title.includes(query) || description.includes(query);
  });
};

export default UniversalSearchBar;
