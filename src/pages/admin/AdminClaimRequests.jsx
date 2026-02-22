import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';

const AdminClaimRequests = () => {
  const { t } = useTranslation();
  const { darkMode } = useApp();
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter claims
  const filteredClaims = claims.filter(claim => {
    const item = items.find(i => i._id === claim.itemId || i.id === claim.itemId);
    const claimant = users.find(u => u._id === claim.userId || u.id === claim.userId);
    
    const matchesSearch = 
      item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claimant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claimant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || claim.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const ClaimDetailModal = ({ claim, onClose }) => {
    if (!claim) return null;

    const item = items.find(i => i._id === claim.itemId || i.id === claim.itemId);
    const claimant = users.find(u => u._id === claim.userId || u.id === claim.userId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Claim Request Details
              </h2>
              <button
                onClick={onClose}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                
              </button>
            </div>

            {/* Item Information */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Item Information
              </h3>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                {item?.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex items-center">
                    
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item?.title || 'Unknown Item'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item?.location || 'Unknown Location'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item?.date ? new Date(item.date).toLocaleDateString() : 'Unknown Date'}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                    {item?.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Claimant Information */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Claimant Information
              </h3>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 space-y-2`}>
                <div className="flex items-center">
                  
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {claimant?.name || 'Unknown User'}
                  </span>
                </div>
                <div className="flex items-center">
                  
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {claimant?.email || 'No email'}
                  </span>
                </div>
                {claimant?.phone && (
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {claimant.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Claim Details */}
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Claim Details
              </h3>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Claim Date:
                  </span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {new Date(claim.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status:
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    claim.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : claim.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {claim.status || 'pending'}
                  </span>
                </div>
                {claim.message && (
                  <div className="mt-3">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Claimant Message:
                    </span>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {claim.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {claim.status === 'pending' && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    onRejectClaim?.(claim._id || claim.id);
                    onClose();
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Reject Claim
                </button>
                <button
                  onClick={() => {
                    onApproveClaim?.(claim._id || claim.id);
                    onClose();
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve Claim
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Claim Requests
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Review and manage item claim requests from users
          </p>
        </div>

        {/* Controls */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              
              <input
                type="text"
                placeholder="Search by item or claimant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Claims List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredClaims.length > 0 ? (
            filteredClaims.map((claim) => {
              const item = items.find(i => i._id === claim.itemId || i.id === claim.itemId);
              const claimant = users.find(u => u._id === claim.userId || u.id === claim.userId);

              return (
                <div
                  key={claim._id || claim.id}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Item Image */}
                      {item?.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}

                      {/* Claim Info */}
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {item?.title || 'Unknown Item'}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {claimant?.name || 'Unknown User'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {claimant?.email || 'No email'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {new Date(claim.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : claim.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.status || 'pending'}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setShowDetailModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          
                        </button>

                        {claim.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onRejectClaim?.(claim._id || claim.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              
                            </button>
                            <button
                              onClick={() => onApproveClaim?.(claim._id || claim.id)}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-12 text-center`}>
              
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                No Claim Requests
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                There are no claim requests matching your filters.
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pending Claims
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {claims.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Approved Claims
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {claims.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Rejected Claims
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {claims.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedClaim(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminClaimRequests;
