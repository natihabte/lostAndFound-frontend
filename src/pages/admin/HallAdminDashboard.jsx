import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Building2, Users, FileText, Search } from 'lucide-react';

const HallAdminDashboard = ({ currentUser, darkMode, setCurrentPage }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      },
      recentRegistrations: [
        {
          _id: '1',
          name: 'Addis Ababa University',
          organizationId: 'AAU001',
          type: 'university',
          createdAt: new Date().toISOString(),
          contact: { email: 'admin@aau.edu.et' },
          adminId: { name: 'Dr. Teshome Kebede', email: 'admin@aau.edu.et' }
        },
        {
          _id: '2',
          name: 'Hawassa University',
          organizationId: 'HU001',
          type: 'university',
          createdAt: new Date().toISOString(),
          contact: { email: 'admin@hu.edu.et' },
          adminId: { name: 'Dr. Alemayehu Tadesse', email: 'admin@hu.edu.et' }
        }
      ]
    };

    const mockOrganizations = [
      {
        _id: '1',
        name: 'Addis Ababa University',
        organizationId: 'AAU001',
        type: 'university',
        verificationStatus: 'verified',
        isActive: true,
        createdAt: new Date().toISOString(),
        adminId: { name: 'Dr. Teshome Kebede', email: 'admin@aau.edu.et', status: 'active' },
        stats: { totalUsers: 450, totalLostItems: 120, totalFoundItems: 85, totalClaims: 45 }
      },
      {
        _id: '2',
        name: 'Hawassa University',
        organizationId: 'HU001',
        type: 'university',
        verificationStatus: 'verified',
        isActive: true,
        createdAt: new Date().toISOString(),
        adminId: { name: 'Dr. Alemayehu Tadesse', email: 'admin@hu.edu.et', status: 'active' },
        stats: { totalUsers: 320, totalLostItems: 89, totalFoundItems: 67, totalClaims: 34 }
      },
      {
        _id: '3',
        name: 'Addis Ababa City Administration',
        organizationId: 'AACA001',
        type: 'municipality',
        verificationStatus: 'pending',
        isActive: false,
        createdAt: new Date().toISOString(),
        adminId: { name: 'Ato Girma Wolde', email: 'admin@addisababa.gov.et', status: 'pending' },
        stats: { totalUsers: 0, totalLostItems: 0, totalFoundItems: 0, totalClaims: 0 }
      }
    ];

    const mockUsers = [
      {
        _id: '1',
        name: 'Dr. Teshome Kebede',
        email: 'admin@aau.edu.et',
        role: 'orgAdmin',
        status: 'active',
        organization: { name: 'Addis Ababa University', organizationId: 'AAU001' },
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        name: 'Dr. Alemayehu Tadesse',
        email: 'admin@hu.edu.et',
        role: 'orgAdmin',
        status: 'active',
        organization: { name: 'Hawassa University', organizationId: 'HU001' },
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setStats(mockStats);
    setOrganizations(mockOrganizations);
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleApproveOrganization = (orgId, action) => {
    setOrganizations(prev => 
      prev.map(org => 
        org._id === orgId 
          ? { 
              ...org, 
              verificationStatus: action === 'approve' ? 'verified' : 'rejected',
              isActive: action === 'approve'
            }
          : org
      )
    );
    alert(`Organization ${action}d successfully!`);
  };

  const handleDeleteOrganization = (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      setOrganizations(prev => prev.filter(org => org._id !== orgId));
      alert('Organization deleted successfully!');
    }
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.organizationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || org.verificationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'System Overview' },
              { id: 'organizations', name: 'Organizations' },
              { id: 'users', name: 'Users' },
              { id: 'reports', name: 'System Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
                <div className="flex items-center">
                  
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
                  
                  <span className="text-yellow-600">{stats.organizations.pending} Pending</span>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
                <div className="flex items-center">
                  
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

            {/* Recent Registrations */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Organization Registrations
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentRegistrations.map((org) => (
                    <div key={org._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {org.name}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {org.organizationId} • {org.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveOrganization(org._id, 'approve')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveOrganization(org._id, 'reject')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organizations' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button
                onClick={() => alert('Create Organization functionality would be implemented here')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                
                Create Organization
              </button>
            </div>

            {/* Organizations Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Organization
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Admin
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Stats
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredOrganizations.map((org) => (
                    <tr key={org._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          
                          <div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {org.name}
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {org.organizationId} • {org.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {org.adminId.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {org.adminId.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          org.verificationStatus === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : org.verificationStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {org.verificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                          {org.stats.totalUsers} users • {org.stats.totalLostItems + org.stats.totalFoundItems} items
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            
                          </button>
                          <button 
                            onClick={() => handleDeleteOrganization(org._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                System Users Management
              </h3>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        
                      </div>
                      <div>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.email} • {user.role} • {user.organization.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-900">
                        
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                System Reports & Analytics
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive system-wide reports and analytics would be displayed here.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500">
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Organization Performance Report
                  </p>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500">
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    System Usage Analytics
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallAdminDashboard;