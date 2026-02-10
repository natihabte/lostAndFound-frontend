import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

const OrganizationsDashboard = ({ 
  currentUser, 
  isLoggedIn, 
  setCurrentPage, 
  darkMode,
  onSelectOrganization 
}) => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // Organization types
  const organizationTypes = {
    university: { label: t('organizations.types.university') },
    hospital: { label: t('organizations.types.hospital') },
    municipality: { label: t('organizations.types.municipality') },
    transport: { label: t('organizations.types.transport') },
    government: { label: t('organizations.types.government') },
    bank: { label: t('organizations.types.bank') },
    mall: { label: t('organizations.types.mall') },
    other: { label: t('organizations.types.other') }
  };

  // Mock organizations data (should match API data structure) - UPDATED to include user-requested organizations
  const mockOrganizations = [
    // User-requested organizations (HP, Bunna Bank, Abay Bank) - ALWAYS VISIBLE
    {
      id: 'org_hp',
      name: 'Hewlett Packard Enterprise',
      type: 'other',
      logo: 'https://placehold.co/100x100/16a34a/white?text=HP',
      location: 'Addis Ababa, Ethiopia',
      description: 'Technology solutions and enterprise services',
      activeItems: 8,
      totalItems: 12,
      rating: 4.7,
      verified: true,
      contact: {
        phone: '+251-11-662-4500',
        email: 'info@hpe.com',
        website: 'www.hpe.com'
      },
      stats: {
        lostItems: 5,
        foundItems: 3,
        returnedItems: 4
      }
    },
    {
      id: 'org_bunna',
      name: 'Bunna Bank',
      type: 'bank',
      logo: 'https://placehold.co/100x100/dc2626/white?text=BB',
      location: 'Addis Ababa, Ethiopia',
      description: 'Reliable banking partner for businesses and individuals',
      activeItems: 6,
      totalItems: 10,
      rating: 4.6,
      verified: true,
      contact: {
        phone: '+251-11-551-7300',
        email: 'info@bunnabank.com',
        website: 'www.bunnabank.com'
      },
      stats: {
        lostItems: 4,
        foundItems: 2,
        returnedItems: 4
      }
    },
    {
      id: 'org_abay',
      name: 'Abay Bank',
      type: 'bank',
      logo: 'https://placehold.co/100x100/0ea5e9/white?text=AB',
      location: 'Addis Ababa, Ethiopia',
      description: 'Modern banking services across Ethiopia',
      activeItems: 7,
      totalItems: 11,
      rating: 4.3,
      verified: true,
      contact: {
        phone: '+251-11-667-8900',
        email: 'info@abaybank.com.et',
        website: 'www.abaybank.com.et'
      },
      stats: {
        lostItems: 4,
        foundItems: 3,
        returnedItems: 4
      }
    },
    // System organizations
    {
      id: 'org_1',
      name: 'Addis Ababa University',
      type: 'university',
      logo: 'https://placehold.co/100x100/3b82f6/white?text=AAU',
      location: 'Addis Ababa, Ethiopia',
      description: 'Leading university in Ethiopia with multiple campuses',
      activeItems: 45,
      totalItems: 156,
      rating: 4.8,
      verified: true,
      contact: {
        phone: '+251-11-123-4567',
        email: 'info@aau.edu.et',
        website: 'www.aau.edu.et'
      },
      stats: {
        lostItems: 28,
        foundItems: 17,
        returnedItems: 111
      }
    },
    {
      id: 'org_2',
      name: 'Hawassa University',
      type: 'university',
      logo: 'https://placehold.co/100x100/10b981/white?text=HU',
      location: 'Hawassa, Ethiopia',
      description: 'Modern university serving southern Ethiopia',
      activeItems: 23,
      totalItems: 89,
      rating: 4.6,
      verified: true,
      contact: {
        phone: '+251-46-220-6421',
        email: 'info@hu.edu.et',
        website: 'www.hu.edu.et'
      },
      stats: {
        lostItems: 15,
        foundItems: 8,
        returnedItems: 66
      }
    },
    {
      id: 'org_3',
      name: 'Black Lion Hospital',
      type: 'hospital',
      logo: 'https://placehold.co/100x100/ef4444/white?text=BLH',
      location: 'Addis Ababa, Ethiopia',
      description: 'Premier medical facility and teaching hospital',
      activeItems: 12,
      totalItems: 67,
      rating: 4.7,
      verified: true,
      contact: {
        phone: '+251-11-551-7611',
        email: 'info@blacklion.gov.et',
        website: 'www.blacklionhospital.gov.et'
      },
      stats: {
        lostItems: 8,
        foundItems: 4,
        returnedItems: 55
      }
    },
    {
      id: 'org_4',
      name: 'Addis Ababa City Administration',
      type: 'municipality',
      logo: 'https://placehold.co/100x100/f59e0b/white?text=AA',
      location: 'Addis Ababa, Ethiopia',
      description: 'Municipal services and city administration',
      activeItems: 34,
      totalItems: 123,
      rating: 4.4,
      verified: true,
      contact: {
        phone: '+251-11-551-8080',
        email: 'info@addisababa.gov.et',
        website: 'www.addisababa.gov.et'
      },
      stats: {
        lostItems: 22,
        foundItems: 12,
        returnedItems: 89
      }
    },
    {
      id: 'org_5',
      name: 'Ethiopian Airlines',
      type: 'transport',
      logo: 'https://placehold.co/100x100/8b5cf6/white?text=ET',
      location: 'Bole International Airport',
      description: 'National flag carrier airline of Ethiopia',
      activeItems: 67,
      totalItems: 234,
      rating: 4.9,
      verified: true,
      contact: {
        phone: '+251-11-661-7000',
        email: 'customercare@ethiopianairlines.com',
        website: 'www.ethiopianairlines.com'
      },
      stats: {
        lostItems: 45,
        foundItems: 22,
        returnedItems: 167
      }
    },
    {
      id: 'org_6',
      name: 'Commercial Bank of Ethiopia',
      type: 'bank',
      logo: 'https://placehold.co/100x100/059669/white?text=CBE',
      location: 'Multiple Branches',
      description: 'Largest commercial bank in Ethiopia',
      activeItems: 18,
      totalItems: 78,
      rating: 4.5,
      verified: true,
      contact: {
        phone: '+251-11-551-5438',
        email: 'info@combanketh.et',
        website: 'www.combanketh.et'
      },
      stats: {
        lostItems: 12,
        foundItems: 6,
        returnedItems: 60
      }
    }
  ];

  useEffect(() => {
    // Fetch organizations from API
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const { organizationsAPI } = await import('../services/api');
        const response = await organizationsAPI.getAll();
        console.log('📊 Organizations API Response:', response);
        setOrganizations(response.data || []);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        // Don't override API fallback - the API already handles localStorage + mock data internally
        // If we reach this catch block, it means there's a more serious error
        console.warn('Using emergency fallback organizations');
        setOrganizations(mockOrganizations);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Filter and sort organizations
  const filteredOrganizations = organizations
    .filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || org.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'items':
          return b.activeItems - a.activeItems;
        case 'rating':
          return b.rating - a.rating;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  const handleOrganizationClick = (organization) => {
    console.log('🏢 Organization clicked:', organization);
    if (onSelectOrganization) {
      onSelectOrganization(organization);
    }
    setCurrentPage('organization-detail');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {t('organizations.dashboard.title')}
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('organizations.dashboard.subtitle')}
              </p>
            </div>
            
            {isLoggedIn && (
              <button
                onClick={() => setCurrentPage('register-organization')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                
                {t('organizations.registerOrganization')}
              </button>
            )}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  
                </div>
                <div className="ml-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Organizations</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizations.length}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  
                </div>
                <div className="ml-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Items</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizations.reduce((sum, org) => sum + org.activeItems, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  
                </div>
                <div className="ml-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Items Returned</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {organizations.reduce((sum, org) => sum + org.stats.returnedItems, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  
                </div>
                <div className="ml-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Rating</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {(organizations.reduce((sum, org) => sum + org.rating, 0) / organizations.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 mb-8`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('organizations.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">{t('organizations.allTypes')}</option>
                {Object.entries(organizationTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="name">{t('organizations.sortByName')}</option>
                <option value="items">{t('organizations.sortByItems')}</option>
                <option value="rating">{t('organizations.sortByRating')}</option>
                <option value="location">{t('organizations.sortByLocation')}</option>
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

        {/* Organizations Grid/List */}
        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-12">
            
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('organizations.noResults')}
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {t('organizations.noResultsDescription')}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t('organizations.clearFilters')}
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredOrganizations.map(organization => (
              <OrganizationCard
                key={organization.id}
                organization={organization}
                viewMode={viewMode}
                darkMode={darkMode}
                organizationTypes={organizationTypes}
                onClick={() => handleOrganizationClick(organization)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Organization Card Component
const OrganizationCard = ({ organization, viewMode, darkMode, organizationTypes, onClick, t }) => {
  const typeInfo = organizationTypes[organization.type] || organizationTypes.other;

  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick}
        className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
          border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group`}
      >
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organization.name}
              </h3>
              
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                
                {organization.location}
              </div>
              <div className="flex items-center">
                
                {organization.activeItems} active items
              </div>
              <div className="flex items-center">
                
                {organization.rating}
              </div>
            </div>
            
            <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {organization.description}
            </p>
          </div>

          {/* Action */}
          <div className="flex-shrink-0">
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
        border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg group`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <img
            src={organization.logo}
            alt={organization.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          
        </div>

        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {organization.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          
          {organization.location}
        </div>

        <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {organization.description}
        </p>
      </div>

      {/* Stats */}
      <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-100 bg-gray-50'}`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {organization.activeItems}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {organization.stats.returnedItems}
            </p>
            <p className="text-xs text-gray-500">Returned</p>
          </div>
          <div>
            <div className="flex items-center justify-center">
              
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {organization.rating}
              </p>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 pt-4">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors group-hover:bg-blue-700">
          
          {t('organizations.viewItems')}
        </button>
      </div>
    </div>
  );
};

export default OrganizationsDashboard;