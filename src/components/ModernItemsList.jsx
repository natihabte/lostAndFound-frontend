import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModernItemCard from './ModernItemCard';
import UniversalSearchBar, { filterItemsBySearch } from './UniversalSearchBar';

const ModernItemsList = ({ 
  items, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  isLoggedIn, 
  userRole, 
  onClaimItem, 
  onDeleteItem,
  categories,
  darkMode
}) => {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'location'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort items
  const searchFiltered = filterItemsBySearch(items, searchTerm);
  const filteredAndSortedItems = searchFiltered
    .filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.date || a.createdAt);
          bValue = new Date(b.date || b.createdAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleViewDetails = (item) => {
    // You can implement a modal or navigate to detail page
    console.log('View details for:', item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <UniversalSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('search.placeholderAdvanced')}
              className="shadow-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              
              {t('filters.category')}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">{t('filters.sortByDate')}</option>
                <option value="title">{t('filters.sortByTitle')}</option>
                <option value="location">{t('filters.sortByLocation')}</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                {sortOrder === 'asc' ? '' : ''}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.category')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('filters.allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.status')}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">{t('filters.allStatus')}</option>
                  <option value="Lost">{t('status.lost')}</option>
                  <option value="Found">{t('status.found')}</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            {t('search.showingResults', { count: filteredAndSortedItems.length, total: items.length })}
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <span className="text-blue-600">
              {t('search.filtersActive')}
            </span>
          )}
        </div>
      </div>

      {/* Items Grid/List */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('search.noResults')}</h3>
            <p className="text-gray-600 mb-6">
              {t('messages.noItemsFound')}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('filters.clearAll')}
            </button>
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedItems.map(item => (
            <ModernItemCard
              key={`${item._id || item.id}-${i18n.language}`}
              item={item}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onViewDetails={handleViewDetails}
              onClaim={onClaimItem}
              onContact={onContact}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}

      {/* Load More Button (if needed for pagination) */}
      {filteredAndSortedItems.length > 0 && filteredAndSortedItems.length < items.length && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            {t('actions.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernItemsList;