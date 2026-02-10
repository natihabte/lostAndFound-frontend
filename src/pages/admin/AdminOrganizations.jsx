import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Building2, CheckCircle, Clock, Ban, Edit, Trash2, Eye, Plus } from 'lucide-react';

const AdminOrganizations = ({ darkMode, currentUser }) => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const [stats, setStats] = useState({});

  // Debug state
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  const orgTypes = ['university', 'municipality', 'hospital', 'transport', 'government', 'other'];
  const statusOptions = ['all', 'pending', 'active', 'suspended', 'rejected'];

  useEffect(() => {
    fetchOrganizations();
    
    // Update debug info
    setDebugInfo({
      timestamp: new Date().toISOString(),
      localStorage: {
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        user: localStorage.getItem('user') ? 'Present' : 'Missing',
        userRole: localStorage.getItem('userRole') || 'Missing'
      },
      currentUser: currentUser || 'Not provided',
      windowLocation: window.location.href
    });

    // FALLBACK AUTHENTICATION: If no currentUser but we have localStorage data, try to authenticate
    if (!currentUser) {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          console.log('🔄 Fallback authentication: Found stored user', user);
          
          // Test if the token is still valid by making a quick API call
          fetch('http://localhost:5001/api/organizations', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              console.log('✅ Stored token is valid, user should be authenticated');
            } else {
              console.log('❌ Stored token is invalid, clearing localStorage');
              localStorage.clear();
            }
          })
          .catch(error => {
            console.log('❌ Token validation failed:', error);
          });
          
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.clear();
        }
      } else {
        console.log('⚠️ No authentication data found. User needs to login.');
      }
    }
  }, [currentUser]);

  // Recalculate stats when organizations change
  useEffect(() => {
    if (organizations.length > 0) {
      fetchStats();
    }
  }, [organizations]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      
      // Get auth token from localStorage
      let token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No auth token found in localStorage');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        
        // Try to get user data and check if we need to re-authenticate
        const userData = localStorage.getItem('user');
        if (userData) {
          console.log('User data found but no token. User may need to re-login.');
        }
        
        setOrganizations([]);
        return;
      }

      console.log('Making API request with token:', token.substring(0, 30) + '...');

      // Fetch real organizations from API
      const response = await fetch('http://localhost:5001/api/organizations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response Status:', response.status);
      console.log('API Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Organizations fetched successfully:', data);
        
        // Handle different response formats
        const orgsData = data.data || data.organizations || data;
        const organizations = Array.isArray(orgsData) ? orgsData : [];
        
        console.log('Raw organizations data:', organizations);
        console.log('Organizations count:', organizations.length);
        
        // Transform data to match component expectations
        const transformedOrgs = organizations.map(org => ({
          _id: org._id,
          name: org.name,
          organizationId: org.organizationId,
          type: org.type,
          sectorLevel: org.sectorLevel,
          status: org.isActive ? 'active' : 'pending',
          verificationStatus: org.verificationStatus,
          contact: {
            email: org.contact?.email,
            phone: org.contact?.phone
          },
          createdAt: org.createdAt || org.registrationDate,
          adminId: org.adminId
        }));
        
        console.log('Transformed organizations:', transformedOrgs);
        setOrganizations(transformedOrgs);
        
        // Force stats calculation even if organizations array is empty
        setTimeout(() => {
          fetchStats();
        }, 100);
        
      } else {
        console.error('Failed to fetch organizations:', response.status, response.statusText);
        
        // Get error details
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          
          if (response.status === 401) {
            console.error('Authentication failed - token may be expired');
            // Clear invalid token
            localStorage.removeItem('token');
          } else if (response.status === 403) {
            console.error('Access denied - user may not have permission to view organizations');
            const userData = localStorage.getItem('user');
            if (userData) {
              const user = JSON.parse(userData);
              console.error('Current user role:', user.role);
            }
          }
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check if it's a network error
      if (error.message.includes('fetch')) {
        console.error('Network error - backend server may not be running on http://localhost:5001');
      }
      
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate stats from the organizations data
      const total = organizations.length;
      const active = organizations.filter(org => org.status === 'active').length;
      const pending = organizations.filter(org => org.status === 'pending').length;
      const suspended = organizations.filter(org => org.status === 'suspended').length;
      
      const calculatedStats = {
        organizations: {
          total,
          active,
          pending,
          suspended
        }
      };
      
      console.log('Stats calculated:', calculatedStats);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Set default stats if calculation fails
      setStats({
        organizations: {
          total: 0,
          active: 0,
          pending: 0,
          suspended: 0
        }
      });
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
      await fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  const handleDeleteOrganization = async (orgId, transferData = null) => {
    try {
      // Remove from local state for demo
      setOrganizations(orgs => orgs.filter(org => org._id !== orgId));
      setShowDeleteModal(false);
      setOrgToDelete(null);
      alert('Organization deleted successfully');
      await fetchStats();
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Error deleting organization');
    }
  };

  // Filter organizations
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = 
      org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.organizationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
    const matchesType = filterType === 'all' || org.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return ;
      case 'pending': return ;
      case 'suspended': return ;
      case 'rejected': return ;
      default: return ;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = 'text-blue-600' }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{value}</p>
        </div>
        
      </div>
    </div>
  );

  const OrganizationCard = ({ org }) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {org.name}
            </h3>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            ID: {org.organizationId}
          </p>
          <div className="flex items-center space-x-2 mb-3">
            {getStatusIcon(org.status)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(org.status)}`}>
              {org.status}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              {org.type}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedOrg(org);
              setShowDetailModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            
          </button>
          
          {org.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange(org._id, 'active')}
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Approve"
              >
                
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Reason for rejection:');
                  if (reason) handleStatusChange(org._id, 'rejected', reason);
                }}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reject"
              >
                
              </button>
            </>
          )}
          
          {org.status === 'active' && (
            <button
              onClick={() => {
                const reason = prompt('Reason for suspension:');
                if (reason) handleStatusChange(org._id, 'suspended', reason);
              }}
              className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
              title="Suspend"
            >
              
            </button>
          )}
          
          {org.status === 'suspended' && (
            <button
              onClick={() => handleStatusChange(org._id, 'active')}
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Reactivate"
            >
              
            </button>
          )}
          
          <button
            onClick={() => {
              setOrgToDelete(org);
              setShowDeleteModal(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
            {org.contact?.email}
          </p>
        </div>
        <div>
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {org.contact?.phone}
          </p>
        </div>
        <div>
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sector:</span>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {org.sectorLevel}
          </p>
        </div>
        <div>
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Created:</span>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {new Date(org.createdAt).toLocaleDateString()}
          </p>
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

  // AUTHENTICATION CHECK: If no token, show login prompt
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-8 text-center max-w-md`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                🔐 Authentication Required
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                You need to be logged in as an admin to view organizations.
              </p>
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    // Auto-login as Hall Admin
                    try {
                      console.log('🔄 Attempting login...');
                      const response = await fetch('http://localhost:5001/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'admin@system.com', password: 'admin123' })
                      });
                      
                      console.log('📡 Response status:', response.status);
                      const data = await response.json();
                      console.log('📊 Response data:', data);
                      
                      if (response.ok && data.success) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        localStorage.setItem('userRole', data.user.role);
                        
                        console.log('✅ Login successful, reloading...');
                        // Refresh the page to reload with authentication
                        window.location.reload();
                      } else {
                        console.error('❌ Login failed:', data.message);
                        alert('Login failed: ' + (data.message || 'Unknown error'));
                      }
                    } catch (error) {
                      console.error('❌ Login error:', error);
                      alert('Login error: ' + error.message + '\n\nMake sure backend is running on port 5001');
                    }
                  }}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🚀 Auto-Login as Hall Admin
                </button>
                
                <button
                  onClick={() => {
                    // Manual redirect to admin login
                    window.location.href = '/admin-login';
                  }}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  🔑 Go to Admin Login
                </button>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>
                Auto-login uses admin@system.com / admin123
              </p>
            </div>
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
                Organization Management
              </h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and control all organizations in the system
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Organizations"
            value={stats.organizations?.total || 0}
            color="text-blue-600"
          />
          <StatCard
            title="Active"
            value={stats.organizations?.active || 0}
            color="text-green-600"
          />
          <StatCard
            title="Pending Approval"
            value={stats.organizations?.pending || 0}
            color="text-yellow-600"
          />
          <StatCard
            title="Suspended"
            value={stats.organizations?.suspended || 0}
            color="text-red-600"
          />
        </div>

        {/* Filters */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="all">All Types</option>
              {orgTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrgs.map(org => (
            <OrganizationCard key={org._id} org={org} />
          ))}
        </div>

        {filteredOrgs.length === 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-12 text-center`}>
            
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No organizations found
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No organizations have been registered yet'
              }
            </p>
          </div>
        )}

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
              
              <div className="space-y-4">
                <div>
                  <strong>Organization ID:</strong> {selectedOrg.organizationId}
                </div>
                <div>
                  <strong>Type:</strong> {selectedOrg.type}
                </div>
                <div>
                  <strong>Sector Level:</strong> {selectedOrg.sectorLevel}
                </div>
                <div>
                  <strong>Status:</strong> {selectedOrg.status}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrg.contact?.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedOrg.contact?.phone}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(selectedOrg.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple Delete Modal */}
        {showDeleteModal && orgToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Delete Organization
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to delete <strong>{orgToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-4 py-2 border rounded-lg ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteOrganization(orgToDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
            title="Debug Panel"
          >
            🐛 Debug
          </button>
          
          {showDebug && (
            <div className={`absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-4`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Debug Info</h3>
                <button
                  onClick={() => setShowDebug(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Organizations Count:</strong> {organizations.length}
                </div>
                <div>
                  <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Token:</strong> {debugInfo.localStorage?.token}
                </div>
                <div>
                  <strong>User Role:</strong> {debugInfo.localStorage?.userRole}
                </div>
                <div>
                  <strong>Current User:</strong> {currentUser?.name || 'None'}
                </div>
                <div>
                  <strong>Stats:</strong> T:{stats.organizations?.total || 0}, A:{stats.organizations?.active || 0}, P:{stats.organizations?.pending || 0}, S:{stats.organizations?.suspended || 0}
                </div>
                
                <button
                  onClick={() => {
                    console.log('=== MANUAL DEBUG ===');
                    console.log('Organizations:', organizations);
                    console.log('Stats:', stats);
                    console.log('Debug Info:', debugInfo);
                    console.log('localStorage token:', localStorage.getItem('token'));
                    console.log('localStorage user:', localStorage.getItem('user'));
                    console.log('Current User:', currentUser);
                    fetchOrganizations();
                  }}
                  className="w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Refresh & Log Debug
                </button>
                
                <button
                  onClick={() => {
                    // Clear localStorage and reload
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                >
                  Clear Storage & Reload
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrganizations;