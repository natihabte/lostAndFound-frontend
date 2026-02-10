import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Grid, List, SortAsc, SortDesc, X } from 'lucide-react';
import ModernItemCard from '../components/ModernItemCard';
import UniversalSearchBar, { filterItemsBySearch } from '../components/UniversalSearchBar';
import { NoItemsFound, LoadingState, CommunityStats } from '../components/EmptyStates';

const BrowseItemsPage = ({ 
  items = [], 
  loading, 
  isLoggedIn, 
  userRole, 
  onClaimItem, 
  onDeleteItem, 
  onContactOwner,
  onViewDetails,
  searchTerm = '',
  setSearchTerm,
  selectedCategory = 'all',
  setSelectedCategory,
  selectedStatus = 'all',
  setSelectedStatus,
  setCurrentPage,
  handleClaimItem,
  darkMode,
  onRefetch
}) => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const { t, i18n } = useTranslation();
  const categories = ['electronic', 'clothing', 'accessory', 'document', 'book', 'other'];

  // Extract unique locations from items (memoized)
  const locations = useMemo(() => 
    [...new Set(items.map(item => item.location))].filter(Boolean),
    [items]
  );

  // Trigger API refetch when filters change
  useEffect(() => {
    if (onRefetch) {
      onRefetch({
        search: '',
        category: selectedCategory,
        status: selectedStatus
      });
    }
  }, [selectedCategory, selectedStatus]);

  // Client-side filtering with search
  const filteredAndSortedItems = useMemo(() => {
    // First apply search filter
    const searchFiltered = filterItemsBySearch(items, localSearchTerm);
    
    const filtered = searchFiltered.filter(item => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      // Status filter  
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      // Location filter (client-side only)
      const matchesLocation = selectedLocation === 'all' || 
        (item.location && item.location === selectedLocation);
      
      return matchesCategory && matchesStatus && matchesLocation;
    });
    
    // Apply sorting
    return filtered.sort((a, b) => {
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
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
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
  }, [items, localSearchTerm, selectedCategory, selectedStatus, selectedLocation, sortBy, sortOrder]);

  const clearAllFilters = () => {
    setLocalSearchTerm('');
    if (setSearchTerm) setSearchTerm('');
    if (setSelectedCategory) setSelectedCategory('all');
    if (setSelectedStatus) setSelectedStatus('all');
    setSelectedLocation('all');
    // Trigger refetch with cleared filters
    if (onRefetch) {
      setTimeout(() => onRefetch({ search: '', category: 'all', status: 'all' }), 100);
    }
  };

  // Calculate stats based on filtered results
  const stats = useMemo(() => ({
    totalItems: filteredAndSortedItems.length,
    totalLost: filteredAndSortedItems.filter(item => item.status === 'Lost').length,
    totalFound: filteredAndSortedItems.filter(item => item.status === 'Found').length,
    reunited: filteredAndSortedItems.filter(item => item.claimed).length,
    activeUsers: Math.floor(filteredAndSortedItems.length * 0.7) // Approximate
  }), [filteredAndSortedItems]);

  if (loading) {
    return <LoadingState message="Loading items..." darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{t('pages.browseItems')}</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('pages.browseSubtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <UniversalSearchBar
            value={localSearchTerm}
            onChange={setLocalSearchTerm}
            placeholder={t('search.placeholder')}
            className="max-w-2xl mx-auto"
            darkMode={darkMode}
          />
        </div>

        {/* Community Stats */}
        <CommunityStats 
          stats={stats} 
          hasFilters={localSearchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedLocation !== 'all'}
          darkMode={darkMode}
        />

        {/* Items Display */}
        {filteredAndSortedItems.length === 0 ? (
          <NoItemsFound 
            hasFilters={localSearchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedLocation !== 'all'}
            searchTerm={localSearchTerm}
            onClearFilters={clearAllFilters}
            darkMode={darkMode}
          />
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
                onViewDetails={onViewDetails}
                onClaim={onClaimItem}
                onDelete={onDeleteItem}
                onContact={onContactOwner}
                viewMode={viewMode}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}

        {/* Load More Button (for pagination if needed) */}
        {filteredAndSortedItems.length > 0 && filteredAndSortedItems.length >= 20 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {t('actions.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseItemsPage;