import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';

const AdminActivityLog = () => {
  const { t } = useTranslation();
  const { darkMode } = useApp();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [stats, setStats] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    const mockActivities = [
      {
        _id: '1',
        action: 'user_registered',
        description: 'New user registered: John Doe (john@example.com)',
        user: { name: 'John Doe', email: 'john@example.com', role: 'user' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { email: 'john@example.com', registrationMethod: 'email' }
      },
      {
        _id: '2',
        action: 'user_login',
        description: 'User logged in: john@example.com',
        user: { name: 'John Doe', email: 'john@example.com', role: 'user' },
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { email: 'john@example.com', loginCount: 1 }
      },
      {
        _id: '3',
        action: 'user_verified',
        description: 'User verified email: john@example.com',
        user: { name: 'John Doe', email: 'john@example.com', role: 'user' },
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { email: 'john@example.com', verificationMethod: 'email_code' }
      },
      {
        _id: '4',
        action: 'admin_login',
        description: 'Admin logged in: admin@platform.com',
        user: { name: 'Admin User', email: 'admin@platform.com', role: 'admin' },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        ipAddress: '192.168.1.50',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { email: 'admin@platform.com', role: 'admin' }
      },
      {
        _id: '5',
        action: 'item_created',
        description: 'New item posted: Lost iPhone 13',
        user: { name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        metadata: { itemTitle: 'Lost iPhone 13', category: 'Electronics' }
      }
    ];

    setActivities(mockActivities);
    setStats({
      totalActivities: mockActivities.length,
      todayActivities: mockActivities.filter(a => 
        new Date(a.timestamp).toDateString() === new Date().toDateString()
      ).length,
      uniqueUsers: new Set(mockActivities.map(a => a.user.email)).size,
      registrations: mockActivities.filter(a => a.action === 'user_registered').length,
      logins: mockActivities.filter(a => a.action.includes('login')).length
    });
    setLoading(false);
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case 'user_registered': return 'text-green-600 bg-green-100';
      case 'user_verified': return 'text-blue-600 bg-blue-100';
      case 'user_login': return 'text-indigo-600 bg-indigo-100';
      case 'admin_login': return 'text-purple-600 bg-purple-100';
      case 'user_logout': return 'text-gray-600 bg-gray-100';
      case 'password_changed': return 'text-orange-600 bg-orange-100';
      case 'profile_updated': return 'text-yellow-600 bg-yellow-100';
      case 'item_created': return 'text-green-600 bg-green-100';
      case 'item_updated': return 'text-blue-600 bg-blue-100';
      case 'item_deleted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || activity.action === filterAction;
    const matchesUser = filterUser === 'all' || activity.user.role === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="flex items-center space-x-2">
          
          <span className={darkMode ? 'text-white' : 'text-gray-900'}>Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            User Activity Log
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Monitor all user actions including registrations, logins, and system activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Activities
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalActivities}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Today
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.todayActivities}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Active Users
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.uniqueUsers}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Registrations
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.registrations}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Logins
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.logins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              
              <input
                type="text"
                placeholder="Search activities, users, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Action Filter */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="all">All Actions</option>
              <option value="user_registered">Registrations</option>
              <option value="user_verified">Verifications</option>
              <option value="user_login">User Logins</option>
              <option value="admin_login">Admin Logins</option>
              <option value="password_changed">Password Changes</option>
              <option value="profile_updated">Profile Updates</option>
              <option value="item_created">Items Created</option>
            </select>

            {/* User Type Filter */}
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="all">All Users</option>
              <option value="user">Regular Users</option>
              <option value="admin">Administrators</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterAction('all');
                setFilterUser('all');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              
              Recent Activities ({filteredActivities.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity._id} className={`p-6 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <div className="flex items-start space-x-4">
                    
                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                              
                              {activity.user.name} ({activity.user.email})
                            </span>
                            {activity.user.role === 'admin' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                            
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Technical Details */}
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                          
                          IP: {activity.ipAddress}
                        </div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                          
                          {activity.userAgent?.split(' ')[0] || 'Unknown Browser'}
                        </div>
                      </div>
                      
                      {/* Metadata */}
                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <div className="mt-2">
                          <details className="group">
                            <summary className={`cursor-pointer text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-600`}>
                              
                              View Details
                            </summary>
                            <div className={`mt-2 p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded text-xs`}>
                              <pre className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {JSON.stringify(activity.metadata, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                
                <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  No activities found
                </h3>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityLog;