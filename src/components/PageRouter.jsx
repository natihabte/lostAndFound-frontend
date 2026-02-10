import React from 'react';
import ModernLandingPage from './ModernLandingPage';
import ModernAuth from './ModernAuth';
import BrowseItemsPage from '../pages/BrowseItemsPage';
import ItemDetailPage from '../pages/ItemDetailPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import ModernAddItem from './ModernAddItem';
import AdminDashboard from '../pages/AdminDashboard';

const PageRouter = ({ 
  currentPage,
  setCurrentPage,
  isLoggedIn,
  userRole,
  currentUser,
  items,
  users,
  loading,
  selectedItemId,
  editingItem,
  // Handlers
  handleLogin,
  handleLogout,
  handleAddItem,
  handleUpdateItem,
  handleUpdateProfile,
  handleClaimItem,
  handleDeleteItem,
  handleContactOwner,
  handleViewDetails,
  handleEditItem,
  // State setters
  setShowAddModal,
  setEditingItem,
  // Other props
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  language,
  t
}) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <ModernLandingPage 
            items={items}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setCurrentPage={setCurrentPage}
            isLoggedIn={isLoggedIn}
          />
        );

      case 'login':
        return (
          <ModernAuth 
            handleLogin={handleLogin}
            setCurrentPage={setCurrentPage}
            language={language}
            t={t}
          />
        );

      case 'home':
        return (
          <BrowseItemsPage 
            items={items}
            loading={loading}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onClaimItem={handleClaimItem}
            onDeleteItem={handleDeleteItem}
            onContactOwner={handleContactOwner}
            onViewDetails={handleViewDetails}
          />
        );

      case 'item-detail':
        return selectedItemId ? (
          <ItemDetailPage 
            itemId={selectedItemId}
            items={items}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onBack={() => setCurrentPage('home')}
            onClaim={handleClaimItem}
            onContact={handleContactOwner}
          />
        ) : null;

      case 'profile':
        return (
          <UserDashboardPage 
            currentUser={currentUser}
            userItems={items.filter(item => {
              const ownerId = item.owner?._id || item.owner || item.userId;
              const currentUserId = currentUser?._id || currentUser?.id;
              return ownerId === currentUserId;
            })}
            userClaims={[]} // TODO: Implement claims API
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onCreatePost={() => setCurrentPage('add-item')}
          />
        );

      case 'add-item':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <ModernAddItem 
              onClose={() => setCurrentPage('home')}
              onSubmit={handleAddItem}
              currentUser={currentUser}
            />
          </div>
        );

      case 'admin':
        return userRole === 'admin' ? (
          <AdminDashboard 
            items={items}
            users={users}
            handleDeleteItem={handleDeleteItem}
            setSelectedItem={() => {}} // TODO: Implement if needed
          />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <button
                onClick={() => setCurrentPage(isLoggedIn ? 'home' : 'landing')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default PageRouter;