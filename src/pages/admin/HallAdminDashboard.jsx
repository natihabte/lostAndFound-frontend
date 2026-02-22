import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, Building2, Users, FileText } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const HallAdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, darkMode } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockStats = {
      organizations: {
        total: 12,
        active: 8,
        pending: 3,
        suspended: 1
      },
      users: {
        totalUsers: 1245,
        totalOrgAdmins: 12,
        totalPublicUsers: 1233
      },
      items: {
        totalLostItems: 456,
        totalFoundItems: 234,
        totalClaims: 123,
        resolutionRate: 65
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading Hall Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Hall Admin Dashboard
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  System-wide administration and control
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Welcome, {currentUser?.name}
              </span>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {currentUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Organizations
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.organizations.total}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600">{stats.organizations.active} Active</span>
                <span className="text-yellow-600 ml-4">{stats.organizations.pending} Pending</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Users
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.users.totalUsers}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600">{stats.users.totalOrgAdmins} Org Admins</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total Items
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.items.totalLostItems + stats.items.totalFoundItems}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600">{stats.items.totalLostItems} Lost</span>
                <span className="text-green-600 ml-4">{stats.items.totalFoundItems} Found</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Resolution Rate
                  </p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stats.items.resolutionRate}%
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600">{stats.items.totalClaims} Claims Processed</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-6 rounded-lg shadow border-2 border-transparent hover:border-blue-500 transition-all text-left`}
              >
                <Users className="h-8 w-8 text-blue-600 mb-3" />
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Manage Users
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  View, edit, and manage all platform users
                </p>
              </button>

              <button
                onClick={() => navigate(ROUTES.ADMIN_ORGANIZATIONS)}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-6 rounded-lg shadow border-2 border-transparent hover:border-green-500 transition-all text-left`}
              >
                <Building2 className="h-8 w-8 text-green-600 mb-3" />
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Manage Organizations
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Approve, manage, and monitor organizations
                </p>
              </button>

              <button
                onClick={() => navigate(ROUTES.ADMIN_POSTS)}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-6 rounded-lg shadow border-2 border-transparent hover:border-purple-500 transition-all text-left`}
              >
                <FileText className="h-8 w-8 text-purple-600 mb-3" />
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Manage Posts
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Review and moderate lost/found items
                </p>
              </button>

              <button
                onClick={() => navigate(ROUTES.ADMIN_SETTINGS)}
                className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} p-6 rounded-lg shadow border-2 border-transparent hover:border-red-500 transition-all text-left`}
              >
                <TrendingUp className="h-8 w-8 text-red-600 mb-3" />
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Platform Settings
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Configure platform-wide settings
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HallAdminDashboard;