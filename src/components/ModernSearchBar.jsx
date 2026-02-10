import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ModernSearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  onSearch,
  placeholder,
  darkMode = false
}) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const defaultPlaceholder = placeholder || t('search.placeholderAdvanced');

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setLocationFilter('');
    setDateFilter('');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || locationFilter || dateFilter;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          
          <input
            type="text"
            placeholder={defaultPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-20 py-4 text-lg border rounded-2xl focus:outline-none focus:ring-4 shadow-lg transition-all duration-200 ${
              darkMode 
                ? 'text-white border-gray-600 bg-gray-700 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-gray-600 placeholder-gray-400' 
                : 'text-black border-gray-300 bg-gray-100 focus:ring-gray-300/50 focus:border-gray-500 focus:bg-white placeholder-gray-500'
            }`}
          />
          
          {/* Quick Filter Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-colors ${
              showAdvanced || hasActiveFilters
                ? darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'
                : darkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            
          </button>
        </div>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="absolute -bottom-2 left-4">
            <div className="flex items-center space-x-2">
              <span className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-600 text-white'} text-xs px-2 py-1 rounded-full`}>
                {t('filters.filtersActiveCount', { count: [searchTerm, selectedCategory !== 'all' ? selectedCategory : '', selectedStatus !== 'all' ? selectedStatus : '', locationFilter, dateFilter].filter(Boolean).length })}
              </span>
              <button
                onClick={handleClearAll}
                className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} flex items-center`}
              >
                
                {t('filters.clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className={`mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-lg border p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                
                {t('filters.category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-500' 
                    : 'border-gray-300 bg-white text-black focus:ring-gray-500'
                }`}
              >
                <option value="all">{t('filters.allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                
                {t('filters.status')}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="all">{t('filters.allStatus')}</option>
                <option value="Lost">{t('status.lostItems')}</option>
                <option value="Found">{t('status.foundItems')}</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                
                {t('filters.location')}
              </label>
              <input
                type="text"
                placeholder="e.g., Library, Cafeteria"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                
                {t('filters.dateRange')}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">{t('filters.anyTime')}</option>
                <option value="today">{t('filters.today')}</option>
                <option value="week">{t('filters.thisWeek')}</option>
                <option value="month">{t('filters.thisMonth')}</option>
                <option value="3months">{t('filters.last3Months')}</option>
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{t('filters.quickFilters')}</span>
              <button
                onClick={() => {
                  setSelectedStatus('Lost');
                  setSelectedCategory('electronic');
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
{t('filters.lostElectronics')}
              </button>
              <button
                onClick={() => {
                  setSelectedStatus('Found');
                  setSelectedCategory('document');
                }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
{t('filters.foundDocuments')}
              </button>
              <button
                onClick={() => {
                  setDateFilter('today');
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
{t('filters.todaysItems')}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
{t('filters.clearAll')}
              </button>
              <button
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium"
              >
{t('filters.applyFilters')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {!searchTerm && !showAdvanced && (
        <div className="mt-4 flex items-center space-x-3">
          <span className="text-sm text-gray-500">{t('search.popularSearches')}</span>
          {['phone', 'wallet', 'keys', 'laptop', 'backpack'].map(term => (
            <button
              key={term}
              onClick={() => setSearchTerm(t(`categories.${term}`))}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {t(`categories.${term}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernSearchBar;