import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminPosts = ({ items = [], darkMode, onUpdateItem, onDeleteItem, onApproveItem, onRejectItem }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewingItem, setViewingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['electronic', 'document', 'clothing', 'accessory', 'other'];

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesApproval = filterApproval === 'all' || 
                             (filterApproval === 'pending' && !item.approved && !item.rejected) ||
                             (filterApproval === 'approved' && item.approved) ||
                             (filterApproval === 'rejected' && item.rejected);
      
      return matchesSearch && matchesStatus && matchesCategory && matchesApproval;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        case 'oldest':
          return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item._id || item.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;
    
    try {
      switch (action) {
        case 'approve':
          selectedItems.forEach(id => onApproveItem?.(id));
          break;
        case 'reject':
          selectedItems.forEach(id => onRejectItem?.(id));
          break;
        case 'delete':
          if (window.confirm(`Delete ${selectedItems.length} items?`)) {
            selectedItems.forEach(id => onDeleteItem?.(id));
          }
          break;
      }
      setSelectedItems([]);
    } catch (error) {
      alert('Failed to perform bulk action: ' + error.message);
    }
  };

  const ItemDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.title}
              </h2>
              <button
                onClick={onClose}
                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                
              </button>
            </div>

            {item.imageUrl && (
              <div className="mb-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('admin.posts.itemDetails')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className={`font-medium mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('common.status')}:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Lost' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-medium mr-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t('common.category')}:
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {new Date(item.createdAt || item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t('admin.posts.ownerDetails')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {item.owner?.name || 'Unknown User'}
                    </span>
                  </div>
                  {item.contact && (
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('common.email')}: {item.contact}
                    </div>
                  )}
                  {item.phone && (
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('common.phone')}: {item.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('common.description')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.description}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              {!item.approved && !item.rejected && (
                <>
                  <button
                    onClick={() => {
                      onRejectItem?.(item._id || item.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    {t('admin.posts.reject')}
                  </button>
                  <button
                    onClick={() => {
                      onApproveItem?.(item._id || item.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {t('admin.posts.approve')}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setItemToDelete(item);
                  setShowDeleteModal(true);
                  onClose();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                {t('common.delete')}
              </button>
            </div>
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
            {t('admin.posts.title')}
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('admin.posts.subtitle')}
          </p>
        </div>

        {/* Controls */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('admin.posts.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">{t('admin.posts.allStatuses')}</option>
                  <option value="Lost">{t('common.lost')}</option>
                  <option value="Found">{t('common.found')}</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">{t('admin.posts.allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                  ))}
                </select>

                <select
                  value={filterApproval}
                  onChange={(e) => setFilterApproval(e.target.value)}
                  className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">{t('admin.posts.allApproval')}</option>
                  <option value="pending">{t('admin.posts.pending')}</option>
                  <option value="approved">{t('admin.posts.approved')}</option>
                  <option value="rejected">{t('admin.posts.rejected')}</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="newest">{t('admin.posts.sortNewest')}</option>
                  <option value="oldest">{t('admin.posts.sortOldest')}</option>
                  <option value="title">{t('admin.posts.sortTitle')}</option>
                  <option value="location">{t('admin.posts.sortLocation')}</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    {t('admin.posts.approve')} ({selectedItems.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                  >
                    {t('admin.posts.reject')} ({selectedItems.length})
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    {t('common.delete')} ({selectedItems.length})
                  </button>
                </div>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className={`flex items-center px-4 py-2 border rounded-md ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                
                {t('common.refresh')}
              </button>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('admin.posts.item')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('admin.posts.owner')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('common.status')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('admin.posts.approval')}
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('common.date')}
                  </th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredItems.map((item) => (
                  <tr key={item._id || item.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id || item.id)}
                        onChange={() => handleSelectItem(item._id || item.id)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={item.imageUrl || `https://placehold.co/100x100/gray/white?text=${item.title.charAt(0)}`}
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.title}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} flex items-center`}>
                            
                            {item.location}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {item.owner?.name || 'Unknown User'}
                      </div>
                      {item.contact && (
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.contact}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Lost' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status === 'Lost' ? '' : ''}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.approved 
                          ? 'bg-green-100 text-green-800' 
                          : item.rejected
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.approved ? t('admin.posts.approved') : item.rejected ? t('admin.posts.rejected') : t('admin.posts.pending')}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      <div className="flex items-center">
                        
                        {new Date(item.createdAt || item.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewingItem(item)}
                          className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {!item.approved && !item.rejected && (
                          <>
                            <button
                              onClick={() => onApproveItem?.(item._id || item.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onRejectItem?.(item._id || item.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              
              <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {t('admin.posts.noPosts')}
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {t('admin.posts.noPostsDesc')}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('admin.posts.totalPosts')}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {items.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('admin.posts.pendingApproval')}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {items.filter(i => !i.approved && !i.rejected).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('admin.posts.lostItems')}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {items.filter(i => i.status === 'Lost').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4`}>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('admin.posts.foundItems')}
                </p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {items.filter(i => i.status === 'Found').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {viewingItem && (
        <ItemDetailModal
          item={viewingItem}
          onClose={() => setViewingItem(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6 mx-4`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('admin.posts.deletePost')}
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('admin.posts.deletePostConfirm', { title: itemToDelete.title })}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className={`px-4 py-2 border rounded-md ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => {
                  onDeleteItem?.(itemToDelete._id || itemToDelete.id);
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts;