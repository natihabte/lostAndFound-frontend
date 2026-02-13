import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Package, CheckCircle, ClipboardCheck, TrendingUp, UserCheck, Activity, LayoutDashboard, AlertCircle } from 'lucide-react';

const OrgAdminDashboard = ({ darkMode, currentUser }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [pendingItems, setPendingItems] = useState([]);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const mockStats = {
        users: {
          total: 245,
          active: 198,
          inactive: 47
        },
        lostItems: {
          total: 89,
          pending: 12,
          approved: 65,
          approvalRate: 73
        },
        foundItems: {
          total: 67,
          pending: 8,
          verified: 52,
          verificationRate: 78
        },
        claims: {
          total: 34,
          pending: 6,
          approved: 23,
          approvalRate: 68
        },
        recentActivity: [
          {
            _id: '1',
            action: 'lost_item_approved',
            description: 'Lost laptop approved for posting',
            user: { name: 'John Doe' },
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            action: 'claim_approved',
            description: 'Claim for found wallet approved',
            user: { name: 'Jane Smith' },
            createdAt: new Date().toISOString()
          }
        ]
      };

      const mockPendingItems = [
        {
          _id: '1',
          title: 'Lost iPhone 13',
          category: 'electronics',
          type: 'lost',
          reportedBy: { name: 'Ahmed Ali', email: 'ahmed@example.com' },
          createdAt: new Date().toISOString(),
          status: 'pending'
        },
        {
          _id: '2',
          title: 'Found Wallet',
          category: 'accessories',
          type: 'found',
          foundBy: { name: 'Sara Mohammed', email: 'sara@example.com' },
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      ];

      const mockPendingClaims = [
        {
          _id: '1',
          claimedBy: { name: 'Meron Teshome', email: 'meron@example.com' },
          lostItem: { title: 'Lost Backpack', category: 'bags' },
          createdAt: new Date().toISOString(),
          status: 'pending'
        },
        {
          _id: '2',
          claimedBy: { name: 'Dawit Bekele', email: 'dawit@example.com' },
          foundItem: { title: 'Found Keys', category: 'keys' },
          createdAt: new Date().toISOString(),
          status: 'pending'
        }
      ];

      const mockRecentUsers = [
        {
          _id: '1',
          name: 'Tigist Haile',
          email: 'tigist@example.com',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Yohannes Tadesse',
          email: 'yohannes@example.com',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];

      setStats(mockStats);
      setPendingItems(mockPendingItems);
      setPendingClaims(mockPendingClaims);
      setRecentUsers(mockRecentUsers);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId, itemType, action) => {
    try {
      // Update local state for demo
      setPendingItems(items => items.filter(item => item._id !== itemId));
      alert(`${itemType} item ${action}d successfully`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item');
    }
  };

  const handleApproveClaim = async (claimId, action) => {
    try {
      // Update local state for demo
      setPendingClaims(claims => claims.filter(claim => claim._id !== claimId));
      alert(`Claim ${action}d successfully`);
    } catch (error) {
      console.error('Error updating claim:', error);
      alert('Error updating claim');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'text-blue-600', subtitle, trend }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
          {subtitle && (
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              
              <span className="text-xs text-green-500">{trend}</span>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );

  const PendingItemCard = ({ item }) => (
    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {item.title}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.type === 'lost' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {item.type}
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Category: {item.category}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.type === 'lost' ? 'Reported by' : 'Found by'}: {item.reportedBy?.name || item.foundBy?.name}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleApproveItem(item._id, item.type, 'approve')}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Approve"
          >
            
          </button>
          <button
            onClick={() => {
              const reason = prompt('Reason for rejection:');
              if (reason) handleApproveItem(item._id, item.type, 'reject');
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Reject"
          >
            
          </button>
        </div>
      </div>
    </div>
  );

  const PendingClaimCard = ({ claim }) => (
    <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            
            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Claim for {claim.lostItem?.title || claim.foundItem?.title}
            </h4>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Category: {claim.lostItem?.category || claim.foundItem?.category}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Claimed by: {claim.claimedBy?.name} ({claim.claimedBy?.email})
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleApproveClaim(claim._id, 'approve')}
            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Approve Claim"
          >
            
          </button>
          <button
            onClick={() => {
              const reason = prompt('Reason for rejection:');
              if (reason) handleApproveClaim(claim._id, 'reject');
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Reject Claim"
          >
            
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Organization Admin Dashboard
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage your organization's lost and found system
              </p>
              {currentUser?.organization && (
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                  Organization: {currentUser.organization.name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => alert('Generate Report feature coming soon!')}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Organization Users"
            value={stats.users?.total || 0}
            color="text-blue-600"
            subtitle={`${stats.users?.active || 0} active`}
            trend="+12% this month"
          />
          <StatCard
            title="Lost Items"
            value={stats.lostItems?.total || 0}
            color="text-red-600"
            subtitle={`${stats.lostItems?.pending || 0} pending approval`}
          />
          <StatCard
            title="Found Items"
            value={stats.foundItems?.total || 0}
            color="text-green-600"
            subtitle={`${stats.foundItems?.pending || 0} pending verification`}
          />
          <StatCard
            title="Claims"
            value={stats.claims?.total || 0}
            color="text-purple-600"
            subtitle={`${stats.claims?.pending || 0} pending review`}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Approval Rate"
            value={`${stats.lostItems?.approvalRate || 0}%`}
            color="text-orange-600"
            subtitle="Lost items approved"
          />
          <StatCard
            title="Verification Rate"
            value={`${stats.foundItems?.verificationRate || 0}%`}
            color="text-indigo-600"
            subtitle="Found items verified"
          />
          <StatCard
            title="Resolution Rate"
            value={`${stats.claims?.approvalRate || 0}%`}
            color="text-pink-600"
            subtitle="Claims resolved"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: LayoutDashboard },
                { id: 'pending-items', name: 'Pending Items', count: pendingItems.length, icon: Package },
                { id: 'pending-claims', name: 'Pending Claims', count: pendingClaims.length, icon: AlertCircle },
                { id: 'users', name: 'Users', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentActivity?.map(activity => (
                    <div key={activity._id} className="flex items-start space-x-3">
                      
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.description}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {activity.user?.name} • {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('pending-items')}
                    className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-blue-500 transition-colors ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Review Items
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {pendingItems.length} pending
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('pending-claims')}
                    className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-purple-500 transition-colors ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Review Claims
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {pendingClaims.length} pending
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-green-500 transition-colors ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Manage Users
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stats.users?.total || 0} total
                    </p>
                  </button>
                  
                  <button
                    onClick={() => alert('Generate Report feature coming soon!')}
                    className={`p-4 border-2 border-dashed rounded-lg text-center hover:border-orange-500 transition-colors ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      View Reports
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Analytics
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending-items' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pending Items for Review
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Review and approve/reject lost and found items
              </p>
            </div>
            <div className="p-6">
              {pendingItems.length > 0 ? (
                <div className="space-y-4">
                  {pendingItems.map(item => (
                    <PendingItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    No pending items
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All items have been reviewed
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pending-claims' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pending Claims for Review
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Review and approve/reject item claims
              </p>
            </div>
            <div className="p-6">
              {pendingClaims.length > 0 ? (
                <div className="space-y-4">
                  {pendingClaims.map(claim => (
                    <PendingClaimCard key={claim._id} claim={claim} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    No pending claims
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All claims have been reviewed
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Organization Users
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage users in your organization
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user._id} className={`flex items-center justify-between p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                      
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {user.status}
                      </span>
                      <button
                        onClick={() => alert('User management feature coming soon!')}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgAdminDashboard;