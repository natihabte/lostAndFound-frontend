import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const SuperAdminDashboard = ({ darkMode, currentUser }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const mockStats = {
        organizations: {
          total: 15,
          active: 8,
          pending: 4,
          suspended: 3
        },
        users: {
          totalUsers: 1250,
          totalOrgAdmins: 15,
          totalPublicUsers: 1235
        },
        items: {
          totalLostItems: 450,
          totalFoundItems: 320,
          totalClaims: 180,
          resolutionRate: 40
        },
        recentRegistrations: [
          {
            _id: '1',
            name: 'Bahir Dar University',
            organizationId: 'BDU001',
            type: 'university',
            createdAt: new Date().toISOString(),
            contact: { email: 'admin@bdu.edu.et' },
            adminId: { name: 'Dr. Alemayehu Tadesse', email: 'alemayehu@bdu.edu.et' }
          },
          {
            _id: '2',
            name: 'Hawassa City Administration',
            organizationId: 'HCA001',
            type: 'municipality',
            createdAt: new Date().toISOString(),
            contact: { email: 'admin@hawassa.gov.et' },
            adminId: { name: 'Ato Bekele Molla', email: 'bekele@hawassa.gov.et' }
          }
        ]
      };

      const mockOrganizations = [
        {
          _id: '1',
          name: 'Addis Ababa University',
          organizationId: 'AAU001',
          type: 'university',
          status: 'approved',
          createdAt: new Date().toISOString(),
          adminId: { name: 'Dr. Teshome Kebede', email: 'teshome@aau.edu.et', status: 'active' },
          stats: { totalUsers: 450, totalLostItems: 120, totalFoundItems: 85, totalClaims: 45 }
        },
        {
          _id: '2',
          name: 'Addis Ababa City Administration',
          organizationId: 'AACA001',
          type: 'municipality',
          status: 'pending',
          createdAt: new Date().toISOString(),
          adminId: { name: 'Ato Girma Wolde', email: 'girma@addisababa.gov.et', status: 'pending' },
          stats: { totalUsers: 0, totalLostItems: 0, totalFoundItems: 0, totalClaims: 0 }
        },
        {
          _id: '3',
          name: 'Black Lion Hospital',
          organizationId: 'BLH001',
          type: 'hospital',
          status: 'suspended',
          createdAt: new Date().toISOString(),
          adminId: { name: 'Dr. Meron Teshome', email: 'meron@blacklion.gov.et', status: 'inactive' },
          stats: { totalUsers: 180, totalLostItems: 25, totalFoundItems: 30, totalClaims: 12 }
        }
      ];

      setStats(mockStats);
      setOrganizations(mockOrganizations);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orgId, newStatus, reason = '') => {
    try {
      // Update local state for demo
      setOrganizations(orgs => 
        orgs.map(org => 
          org._id === orgId ? { ...org, status: newStatus } : org
        )
      );
      alert(`Organization status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  // Filter organizations
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = 
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.organizationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.adminId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return ;
      case 'pending': return ;
      case 'suspended': return ;
      case 'rejected': return ;
      default: return ;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'text-blue-600', subtitle }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
          {subtitle && (
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{subtitle}</p>
          )}
        </div>
        
      </div>
    </div>
  );

  const OrganizationRow = ({ org }) => (
    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          
          <div>
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {org.name}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {org.organizationId}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${org.type === 'university' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
          org.type === 'municipality' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          org.type === 'hospital' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
          {org.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          {getStatusIcon(org.status)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(org.status)}`}>
            {org.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {org.adminId?.name}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {org.adminId?.email}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {org.stats?.totalUsers || 0} users
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {(org.stats?.totalLostItems || 0) + (org.stats?.totalFoundItems || 0)} items
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedOrg(org);
              setShowDetailModal(true);
            }}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            
          </button>
          
          {org.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange(org._id, 'approved')}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                title="Approve"
              >
                
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Reason for rejection:');
                  if (reason) handleStatusChange(org._id, 'rejected', reason);
                }}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Reject"
              >
                
              </button>
            </>
          )}
          
          {org.status === 'approved' && (
            <button
              onClick={() => {
                const reason = prompt('Reason for suspension:');
                if (reason) handleStatusChange(org._id, 'suspended', reason);
              }}
              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
              title="Suspend"
            >
              
            </button>
          )}
          
          <button
            onClick={() => alert('Edit organization feature coming soon!')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            title="Edit"
          >
            
          </button>
        </div>
      </td>
    </tr>
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
                🛡️ Super Admin Dashboard
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Global system management and organization control
              </p>
            </div>
            <button
              onClick={() => alert('Create Organization feature coming soon!')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              
              <span>Create Organization</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Organizations"
            value={stats.organizations?.total || 0}
            icon={Building2}
            color="text-blue-600"
            subtitle={`${stats.organizations?.active || 0} active`}
          />
          <StatCard
            title="Platform Users"
            value={stats.users?.totalUsers || 0}
            icon={Users}
            color="text-green-600"
            subtitle={`${stats.users?.totalOrgAdmins || 0} org admins`}
          />
          <StatCard
            title="Total Items"
            value={(stats.items?.totalLostItems || 0) + (stats.items?.totalFoundItems || 0)}
            icon={FileText}
            color="text-purple-600"
            subtitle={`${stats.items?.totalClaims || 0} claims`}
          />
          <StatCard
            title="Resolution Rate"
            value={`${stats.items?.resolutionRate || 0}%`}
            icon={TrendingUp}
            color="text-orange-600"
            subtitle="Items resolved"
          />
        </div>

        {/* Organization Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Pending Approval"
            value={stats.organizations?.pending || 0}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatCard
            title="Active Organizations"
            value={stats.organizations?.active || 0}
            icon={CheckCircle}
            color="text-green-600"
          />
          <StatCard
            title="Suspended"
            value={stats.organizations?.suspended || 0}
            icon={Ban}
            color="text-red-600"
          />
          <StatCard
            title="System Health"
            value="Excellent"
            icon={Activity}
            color="text-blue-600"
          />
        </div>

        {/* Recent Registrations */}
        {stats.recentRegistrations && stats.recentRegistrations.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow mb-8`}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Recent Organization Registrations
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentRegistrations.map(org => (
                  <div key={org._id} className={`flex items-center justify-between p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-4">
                      
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {org.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {org.adminId?.name} • {org.contact?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        org.type === 'university' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {org.type}
                      </span>
                      <button
                        onClick={() => handleStatusChange(org._id, 'approved')}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Organizations Table */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                All Organizations
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Organization
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Type
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Admin
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Stats
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {filteredOrgs.map(org => (
                  <OrganizationRow key={org._id} org={org} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrgs.length === 0 && (
            <div className="p-12 text-center">
              
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                No organizations found
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No organizations have been registered yet'
                }
              </p>
            </div>
          )}
        </div>

        {/* Simple Detail Modal */}
        {showDetailModal && selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full p-6`}>
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedOrg.name}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Organization ID:</strong> {selectedOrg.organizationId}
                </div>
                <div>
                  <strong>Type:</strong> {selectedOrg.type}
                </div>
                <div>
                  <strong>Status:</strong> {selectedOrg.status}
                </div>
                <div>
                  <strong>Admin:</strong> {selectedOrg.adminId?.name}
                </div>
                <div>
                  <strong>Admin Email:</strong> {selectedOrg.adminId?.email}
                </div>
                <div>
                  <strong>Users:</strong> {selectedOrg.stats?.totalUsers || 0}
                </div>
                <div>
                  <strong>Lost Items:</strong> {selectedOrg.stats?.totalLostItems || 0}
                </div>
                <div>
                  <strong>Found Items:</strong> {selectedOrg.stats?.totalFoundItems || 0}
                </div>
                <div className="col-span-2">
                  <strong>Created:</strong> {new Date(selectedOrg.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;