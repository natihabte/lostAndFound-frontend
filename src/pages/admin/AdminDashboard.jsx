import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Users, Package, CheckCircle, AlertCircle, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const AdminDashboard = ({ 
  items = [], 
  users = []
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, darkMode } = useApp();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Calculate stats
    const totalItems = items.length;
    const lostItems = items.filter(item => item.status === 'Lost').length;
    const foundItems = items.filter(item => item.status === 'Found').length;
    const claimedItems = items.filter(item => item.claimed).length;
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.lastActive && 
      new Date(user.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    setStats({
      totalItems,
      lostItems,
      foundItems,
      claimedItems,
      totalUsers,
      activeUsers,
      resolutionRate: totalItems > 0 ? Math.round((claimedItems / totalItems) * 100) : 0
    });

    // Generate recent activity
    const recent = items
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 5)
      .map(item => ({
        id: item._id || item.id,
        type: 'item_posted',
        title: item.title,
        status: item.status,
        user: item.owner?.name || 'Unknown User',
        time: item.createdAt || item.date,
        location: item.location
      }));

    setRecentActivity(recent);
  }, [items, users]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              
              <span className={`text-sm ${color}`}>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-red-600' ? 'bg-red-100' : color === 'text-blue-600' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          {Icon && <Icon className={`h-6 w-6 ${color}`} />}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-xl p-6 shadow-sm transition-colors text-left w-full`}
    >
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg ${
          color === 'text-blue-600' ? 'bg-blue-100' : 
          color === 'text-green-600' ? 'bg-green-100' : 
          color === 'text-purple-600' ? 'bg-purple-100' : 
          color === 'text-red-600' ? 'bg-red-100' :
          color === 'text-indigo-600' ? 'bg-indigo-100' :
          color === 'text-orange-600' ? 'bg-orange-100' :
          'bg-gray-100'
        }`}>
          {Icon && <Icon className={`h-5 w-5 ${color}`} />}
        </div>
        <h3 className={`ml-3 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      </div>
      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </button>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {t('admin.dashboard.title')}
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('admin.dashboard.subtitle')}
              </p>
            </div>
            
            {/* Admin Settings Button */}
            <button
              onClick={() => {
                console.log('Admin Settings button clicked!');
                navigate(ROUTES.ADMIN_SETTINGS);
              }}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg"
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin Settings
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('stats.totalItems')}
            value={stats.totalItems || 0}
            icon={Package}
            color="text-blue-600"
            trend="+12% this week"
          />
          <StatCard
            title={t('stats.totalLost')}
            value={stats.lostItems || 0}
            icon={AlertCircle}
            color="text-red-600"
            trend="+5% this week"
          />
          <StatCard
            title={t('stats.totalFound')}
            value={stats.foundItems || 0}
            icon={CheckCircle}
            color="text-green-600"
            trend="+8% this week"
          />
          <StatCard
            title={t('stats.totalUsers')}
            value={stats.totalUsers || 0}
            icon={Users}
            color="text-purple-600"
            trend="+3% this week"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <TrendingUp className="h-6 w-6 mr-2" />
            Quick Actions
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title={t('admin.quickActions.manageUsers')}
            description={t('admin.quickActions.manageUsersDesc')}
            icon={Users}
            color="text-blue-600"
            onClick={() => navigate(ROUTES.ADMIN_USERS)}
          />
          <QuickActionCard
            title={t('admin.quickActions.managePosts')}
            description={t('admin.quickActions.managePostsDesc')}
            icon={Package}
            color="text-green-600"
            onClick={() => navigate(ROUTES.ADMIN_POSTS)}
          />
          <QuickActionCard
            title="User Activity Log"
            description="Monitor user registrations, logins, and all system activities"
            color="text-purple-600"
            onClick={() => navigate(ROUTES.ADMIN_ACTIVITY_LOG)}
          />
          <QuickActionCard
            title={t('admin.quickActions.viewReports')}
            description={t('admin.quickActions.viewReportsDesc')}
            color="text-red-600"
            onClick={() => navigate(ROUTES.ADMIN_REPORTS)}
          />
          <QuickActionCard
            title="Manage Organizations"
            description="Control organization access, permissions, and subscription plans"
            color="text-blue-600"
            onClick={() => navigate(ROUTES.ADMIN_ORGANIZATIONS)}
          />
          <QuickActionCard
            title={t('admin.quickActions.systemSettings')}
            description={t('admin.quickActions.systemSettingsDesc')}
            icon={Settings}
            color="text-orange-600"
            onClick={() => {
              console.log('System Settings clicked!');
              navigate(ROUTES.ADMIN_SETTINGS);
            }}
          />
          <QuickActionCard
            title={t('admin.quickActions.analytics')}
            description={t('admin.quickActions.analyticsDesc')}
            icon={BarChart3}
            color="text-indigo-600"
            onClick={() => navigate(ROUTES.ADMIN_ANALYTICS)}
          />
          <QuickActionCard
            title={t('admin.quickActions.backToSite')}
            description={t('admin.quickActions.backToSiteDesc')}
            color="text-gray-600"
            onClick={() => navigate(ROUTES.HOME)}
          />
        </div>

        {/* Recent Activity */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-sm`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <TrendingUp className="h-5 w-5 mr-2" />
              {t('admin.dashboard.recentActivity')}
            </h2>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${activity.status === 'Lost' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.status} by {activity.user}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        
                        {activity.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        
                        {new Date(activity.time).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} py-8`}>
                {t('admin.dashboard.noRecentActivity')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;