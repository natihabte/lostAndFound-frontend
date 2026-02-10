import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Award, TrendingUp, Plus, Edit, Trash2, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { NoPosts, WelcomeMessage } from '../components/EmptyStates';

const UserDashboardPage = ({ 
  currentUser, 
  userItems, 
  userClaims, 
  onEditItem, 
  onDeleteItem, 
  onCreatePost,
  setCurrentPage,
  darkMode
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalPosts: userItems?.length || 0,
    lostPosts: userItems?.filter(item => item.status === 'Lost').length || 0,
    foundPosts: userItems?.filter(item => item.status === 'Found').length || 0,
    claimedItems: userClaims?.length || 0,
    successRate: userItems?.length > 0 ? 
      Math.round((userItems.filter(item => item.claimed).length / userItems.length) * 100) : 0
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'posts', label: 'My Posts', count: stats.totalPosts },
    { id: 'claims', label: 'My Claims', count: stats.claimedItems }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Message for New Users */}
      {stats.totalPosts === 0 && (
        <WelcomeMessage 
          userName={currentUser?.name?.split(' ')[0] || 'there'}
          onGetStarted={onCreatePost}
          darkMode={darkMode}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lost Items</p>
              <p className="text-3xl font-bold text-red-600">{stats.lostPosts}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Found Items</p>
              <p className="text-3xl font-bold text-green-600">{stats.foundPosts}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-blue-600">{stats.successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('pages.recentActivity')}</h3>
        <div className="space-y-4">
          {userItems?.slice(0, 5).map(item => (
            <div key={item._id} className={`flex items-center space-x-3 p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <div className={`w-3 h-3 rounded-full ${
                item.status === 'Lost' ? 'bg-red-500' : 'bg-green-500'
              }`}></div>
              <div className="flex-1">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.status} • {item.location}</p>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(item.createdAt || item.date).toLocaleDateString()}
              </span>
            </div>
          ))}
          {(!userItems || userItems.length === 0) && (
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>{t('pages.noRecentActivity')}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Manage your posts and track your activity</p>
          </div>
          
          {/* Settings Button */}
          <button
            onClick={() => setCurrentPage('user-settings')}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            
            Account Settings
          </button>
        </div>

        {/* Profile Summary */}
        <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-2xl p-6 text-white mb-8`}>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
              <p className="text-blue-100">{currentUser?.email}</p>
              <div className="flex items-center mt-2">
                
                <span className="text-sm text-blue-100">
                  Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                My Posts ({stats.totalPosts})
              </h3>
              <button
                onClick={onCreatePost}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Post
              </button>
            </div>

            {userItems && userItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userItems.map(item => (
                  <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status}
                        </span>
                        {item.claimed && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            Claimed
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        
                        {item.location}
                        <span className="mx-2">•</span>
                        
                        {new Date(item.createdAt || item.date).toLocaleDateString()}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditItem && onEditItem(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Edit item"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-gray-500">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded focus:outline-none focus:ring-2 focus:ring-gray-500">
                            <Package className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => onDeleteItem && onDeleteItem(item._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Delete item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoPosts onCreatePost={onCreatePost} />
            )}
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              My Claims ({stats.claimedItems})
            </h3>
            
            {userClaims && userClaims.length > 0 ? (
              <div className="space-y-4">
                {userClaims.map(claim => (
                  <div key={claim._id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start space-x-4">
                      {claim.item?.imageUrl && (
                        <img 
                          src={claim.item.imageUrl} 
                          alt={claim.item.title} 
                          className="w-16 h-16 object-cover rounded-lg" 
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{claim.item?.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{claim.item?.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          
                          {claim.item?.location}
                          <span className="mx-2">•</span>
                          <span>Claimed on {new Date(claim.claimedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims yet</h3>
                <p className="text-gray-600">Items you claim will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;