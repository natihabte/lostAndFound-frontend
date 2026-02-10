import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Edit, Save, X, Package, Award, Settings, Mail, Phone, MapPin } from 'lucide-react';

const ModernProfile = ({ currentUser, userItems, userClaims, onUpdateProfile, onDeleteItem, onEditItem, darkMode }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });

  const tabs = [
    { id: 'overview', label: t('profile.tabs.overview') },
    { id: 'posts', label: t('profile.tabs.myPosts') },
    { id: 'claims', label: t('profile.tabs.myClaims') },
    { id: 'settings', label: t('profile.tabs.settings') }
  ];

  const handleSaveProfile = async () => {
    try {
      await onUpdateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const stats = {
    totalPosts: userItems?.length || 0,
    lostPosts: userItems?.filter(item => item.status === 'Lost').length || 0,
    foundPosts: userItems?.filter(item => item.status === 'Found').length || 0,
    claimedItems: userClaims?.length || 0,
    successRate: userItems?.length > 0 ? Math.round((userItems.filter(item => item.claimed).length / userItems.length) * 100) : 0
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-2xl p-6 text-white`}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            
          </div>
          <div>
            <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
            <p className={`${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>{currentUser?.email}</p>
            <div className="flex items-center mt-2">
              
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-blue-100'}`}>
                Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-4 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lost Items</p>
              <p className="text-2xl font-bold text-red-600">{stats.lostPosts}</p>
            </div>
            
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Found Items</p>
              <p className="text-2xl font-bold text-green-600">{stats.foundPosts}</p>
            </div>
            
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">{stats.successRate}%</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {userItems?.slice(0, 3).map(item => (
            <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.status === 'Lost' ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.status} • {item.location}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(item.createdAt || item.date).toLocaleDateString()}
              </span>
            </div>
          ))}
          {(!userItems || userItems.length === 0) && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">My Posts ({stats.totalPosts})</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">All Posts</option>
            <option value="Lost">Lost Items</option>
            <option value="Found">Found Items</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userItems?.map(item => (
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
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    
                  </button>
                  <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                    
                  </button>
                  <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                    
                  </button>
                </div>
                <button
                  onClick={() => onDeleteItem && onDeleteItem(item._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!userItems || userItems.length === 0) && (
        <div className="text-center py-12">
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('emptyStates.noPosts.title')}</h3>
          <p className="text-gray-600 mb-4">{t('emptyStates.noPosts.description')}</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            {t('emptyStates.noPosts.action')}
          </button>
        </div>
      )}
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{t('profile.claims.title', { count: stats.claimedItems })}</h3>
      
      <div className="space-y-4">
        {userClaims?.map(claim => (
          <div key={claim._id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start space-x-4">
              {claim.item?.imageUrl && (
                <img src={claim.item.imageUrl} alt={claim.item.title} className="w-16 h-16 object-cover rounded-lg" />
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

      {(!userClaims || userClaims.length === 0) && (
        <div className="text-center py-12">
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('emptyStates.noClaims.title')}</h3>
          <p className="text-gray-600">{t('emptyStates.noClaims.shortDescription')}</p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{currentUser?.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <p className="text-gray-900 flex items-center">
              
              {currentUser?.email}
            </p>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 flex items-center">
                
                {currentUser?.phone || 'Not provided'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Email notifications for new matches</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">SMS notifications for claims</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Weekly summary emails</span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Show my name on posts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-2 text-sm text-gray-700">Allow direct contact</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">Public profile</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'posts' && renderPosts()}
      {activeTab === 'claims' && renderClaims()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
};

export default ModernProfile;