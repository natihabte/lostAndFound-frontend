import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ModernItemCard from '../components/ModernItemCard';
import UniversalSearchBar, { filterItemsBySearch } from '../components/UniversalSearchBar';
import { NoItemsFound, LoadingState } from '../components/EmptyStates';

const OrganizationDetailPage = ({ 
  organization,
  onBack,
  isLoggedIn,
  currentUser,
  darkMode,
  setCurrentPage,
  onClaimItem,
  onContactOwner,
  onViewDetails
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState('items');

  const categories = [
    { value: 'electronic', label: t('categories.electronic') },
    { value: 'clothing', label: t('categories.clothing') },
    { value: 'accessory', label: t('categories.accessory') },
    { value: 'document', label: t('categories.document') },
    { value: 'book', label: t('categories.book') },
    { value: 'other', label: t('categories.other') }
  ];

  // Mock organization items (in real app, fetch from API)
  const mockItems = [
    {
      _id: 'item_1',
      title: 'Lost Student ID Card',
      category: 'document',
      status: 'Lost',
      location: 'Main Library',
      description: 'Blue student ID card with photo, lost near the entrance',
      imageUrl: 'https://placehold.co/300x200/ef4444/white?text=ID+Card',
      owner: { name: 'John Doe', _id: 'user_1' },
      organization: organization?.id,
      date: '2025-02-01',
      claimed: false
    },
    {
      _id: 'item_2',
      title: 'Found Laptop Charger',
      category: 'electronic',
      status: 'Found',
      location: 'Computer Lab 2',
      description: 'Dell laptop charger found on desk',
      imageUrl: 'https://placehold.co/300x200/10b981/white?text=Charger',
      owner: { name: 'Sarah Wilson', _id: 'user_2' },
      organization: organization?.id,
      date: '2025-02-02',
      claimed: false
    },
    {
      _id: 'item_3',
      title: 'Lost Textbook',
      category: 'book',
      status: 'Lost',
      location: 'Lecture Hall A',
      description: 'Mathematics textbook, 3rd edition',
      imageUrl: 'https://placehold.co/300x200/f59e0b/white?text=Book',
      owner: { name: 'Mike Johnson', _id: 'user_3' },
      organization: organization?.id,
      date: '2025-02-03',
      claimed: false
    }
  ];

  useEffect(() => {
    // Fetch organization items from API
    const fetchOrganizationItems = async () => {
      if (!organization?.id) return;
      
      setLoading(true);
      try {
        const { organizationsAPI } = await import('../services/api');
        const response = await organizationsAPI.getItems(organization.id);
        console.log('🏢 Organization items from API:', response.data);
        setItems(response.data || []);
      } catch (error) {
        console.error('Failed to fetch organization items:', error);
        // Use mock data as fallback
        console.log('🏢 Using mock items as fallback:', mockItems);
        setItems(mockItems);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationItems();
  }, [organization]);

  // Calculate real statistics from actual items
  const organizationStats = useMemo(() => {
    const lostItems = items.filter(item => item.status === 'Lost').length;
    const foundItems = items.filter(item => item.status === 'Found').length;
    const returnedItems = items.filter(item => item.claimed === true).length;
    const activeItems = items.filter(item => item.claimed !== true).length;
    
    return {
      lostItems,
      foundItems,
      returnedItems,
      activeItems,
      totalItems: items.length
    };
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    const searchFiltered = filterItemsBySearch(items, searchTerm);
    
    return searchFiltered.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesCategory && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [items, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const handlePostItem = () => {
    if (!isLoggedIn) {
      alert('Please login to post items');
      setCurrentPage('login');
      return;
    }
    // TODO: Pass organization context to add item modal
    setCurrentPage('add-item');
  };

  if (!organization) {
    console.log('❌ OrganizationDetailPage: No organization provided');
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Organization Not Found
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            The organization you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ OrganizationDetailPage: Organization data:', organization);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className={`inline-flex items-center mb-6 px-4 py-2 rounded-xl transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            
            Back to Organizations
          </button>

          {/* Organization Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start space-x-6">
              <img
                src={organization.logo}
                alt={organization.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organization.name}
                  </h1>
                  
                </div>
                
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    
                    {organization.location}
                  </div>
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    
                    {organization.rating} Rating
                  </div>
                  <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    
                    {organizationStats.activeItems} Active Items
                  </div>
                </div>
                
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
                  {organization.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      // Report item to admin instead of posting directly
                      const reportData = {
                        type: 'item_report',
                        organization: organization.name,
                        organizationId: organization.id,
                        reportedBy: currentUser?.name || 'Anonymous',
                        reporterEmail: currentUser?.email || 'user@email.com',
                        timestamp: new Date().toISOString()
                      };
                      
                      // Open report modal/form
                      window.location.href = `mailto:admin@platform.com?subject=Item Report for ${organization.name}&body=Hello Admin,%0D%0A%0D%0AI want to report an item:%0D%0A%0D%0AOrganization: ${organization.name}%0D%0AReported by: ${currentUser?.name || 'User'}%0D%0AEmail: ${currentUser?.email || 'user@email.com'}%0D%0ADate: ${new Date().toLocaleDateString()}%0D%0A%0D%0AItem Details:%0D%0A[ ] Lost Item%0D%0A[ ] Found Item%0D%0A%0D%0ATitle: %0D%0ACategory: %0D%0ALocation: %0D%0ADescription: %0D%0A%0D%0APlease add this item to the system.%0D%0A%0D%0AThank you!`;
                    }}
                    className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    
                    Report Item to Admin
                  </button>
                  
                  <button
                    onClick={() => {
                      // Quick report buttons
                      const quickReport = prompt(`Quick Report for ${organization.name}:\n\nEnter item details (Title, Category, Location, Description):`);
                      if (quickReport) {
                        window.location.href = `mailto:admin@platform.com?subject=Quick Item Report - ${organization.name}&body=Hello Admin,%0D%0A%0D%0AQuick item report:%0D%0A%0D%0AOrganization: ${organization.name}%0D%0AReported by: ${currentUser?.name || 'User'}%0D%0ADetails: ${encodeURIComponent(quickReport)}%0D%0A%0D%0APlease add this to the system.%0D%0A%0D%0AThank you!`;
                      }
                    }}
                    className="inline-flex items-center px-4 py-3 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    📝 Quick Report
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">Login to report items to admin</p>
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Login to Report Items
                  </button>
                </div>
              )}
              
              {organization.contact?.website && (
                <a
                  href={organization.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-4 py-3 border rounded-xl transition-colors ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organizationStats.lostItems}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Lost Items</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organizationStats.foundItems}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Found Items</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organizationStats.returnedItems}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Returned</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organization.rating}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('items')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'items'
                    ? 'border-blue-500 text-blue-600'
                    : darkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                
                Lost & Found Items ({filteredItems.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : darkMode 
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                
                About Organization
              </button>
            </nav>
          </div>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <>
            {/* Search and Filters */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 mb-8`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <UniversalSearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Search items in this organization..."
                    darkMode={darkMode}
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Status</option>
                    <option value="Lost">Lost Items</option>
                    <option value="Found">Found Items</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className={`flex items-center border rounded-xl p-1 ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'
                  }`}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white'
                          : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-blue-600 text-white'
                          : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Grid/List */}
            {loading ? (
              <LoadingState darkMode={darkMode} />
            ) : filteredItems.length === 0 ? (
              <NoItemsFound 
                darkMode={darkMode}
                onClearFilters={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                onReportItem={() => {
                  if (!isLoggedIn) {
                    alert('Please login to report items');
                    setCurrentPage('login');
                    return;
                  }
                  // Report to admin instead of posting directly
                  window.location.href = `mailto:admin@platform.com?subject=Item Report for ${organization.name}&body=Hello Admin,%0D%0A%0D%0AI want to report an item for ${organization.name}:%0D%0A%0D%0AReported by: ${currentUser?.name || 'User'}%0D%0AEmail: ${currentUser?.email || 'user@email.com'}%0D%0A%0D%0AItem Details:%0D%0A[ ] Lost Item%0D%0A[ ] Found Item%0D%0A%0D%0ATitle: %0D%0ACategory: %0D%0ALocation: %0D%0ADescription: %0D%0A%0D%0APlease add this item to the system.%0D%0A%0D%0AThank you!`;
                }}
                isLoggedIn={isLoggedIn}
                showReportButton={true}
              />
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredItems.map(item => (
                  <ModernItemCard
                    key={item._id}
                    item={item}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onClaim={onClaimItem}
                    onContact={onContactOwner}
                    onViewDetails={(item) => {
                      console.log('🏢 OrganizationDetailPage: onViewDetails called with:', item);
                      console.log('🏢 Available items in organization:', items);
                      onViewDetails(item);
                    }}
                    viewMode={viewMode}
                    darkMode={darkMode}
                    showOrganization={false} // Don't show org name since we're already in org context
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>
              <div className="space-y-4">
                {organization.contact?.email && (
                  <div className="flex items-center">
                    
                    <a 
                      href={`mailto:${organization.contact.email}`}
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                    >
                      {organization.contact.email}
                    </a>
                  </div>
                )}
                {organization.contact?.phone && (
                  <div className="flex items-center">
                    
                    <a 
                      href={`tel:${organization.contact.phone}`}
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                    >
                      {organization.contact.phone}
                    </a>
                  </div>
                )}
                {organization.contact?.website && (
                  <div className="flex items-center">
                    
                    <a 
                      href={organization.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}
                    >
                      {organization.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Organization Stats */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Organization Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Items Posted</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizationStats.totalItems}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Items Returned</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizationStats.returnedItems}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizationStats.totalItems > 0 ? Math.round((organizationStats.returnedItems / organizationStats.totalItems) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Member Since</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date().getFullYear() - 1} {/* Mock data */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailPage;