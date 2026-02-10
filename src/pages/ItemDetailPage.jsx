import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Tag, User, Mail, Share2, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import { ErrorMessage, SuccessMessage, InfoMessage, LoginRequired } from '../components/EmptyStates';

const ItemDetailPage = ({ itemId, items, isLoggedIn, currentUser, onBack, onClaim, onContact, onReport }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log('🔍 ItemDetailPage: Looking for item with ID:', itemId);
    console.log('🔍 ItemDetailPage: Available items:', items);
    
    // Find item by ID
    const foundItem = items.find(i => (i._id || i.id) === itemId);
    console.log('🔍 ItemDetailPage: Found item:', foundItem);
    
    if (!foundItem && items.length > 0) {
      // Try to find by string comparison
      const foundByString = items.find(i => String(i._id || i.id) === String(itemId));
      console.log('🔍 ItemDetailPage: Found by string comparison:', foundByString);
      setItem(foundByString);
    } else {
      setItem(foundItem);
    }
    
    setLoading(false);
  }, [itemId, items]);

  const handleClaim = async () => {
    if (!isLoggedIn) {
      setError('Please login to claim items');
      return;
    }

    setClaiming(true);
    try {
      await onClaim(item._id || item.id);
      setSuccess('Claim submitted successfully! The owner and admin will be notified.');
      
      // Show admin contact information after successful claim
      setTimeout(() => {
        setSuccess(`✅ Claim Submitted Successfully!

📧 Admin Contact Information:
• Email: admin@platform.com
• Phone: +1-800-555-0123
• Organization Admin: ${item.organization || 'Platform Admin'}

📋 Next Steps:
1. Admin will verify your claim
2. You'll receive confirmation email
3. Arrange pickup with item owner
4. Contact admin if you need assistance

⏰ Expected Response Time: 24-48 hours`);
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to claim item');
    } finally {
      setClaiming(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `${item.status} item: ${item.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSuccess('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Browse
        </button>

        {/* Messages */}
        {error && (
          <ErrorMessage
            title="Error"
            message={error}
            onDismiss={() => setError('')}
          />
        )}
        {success && (
          <SuccessMessage
            title="Success"
            message={success}
            onDismiss={() => setSuccess('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {item.imageUrl && item.imageUrl !== 'local_preview' ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    // If image fails to load, show fallback
                    console.warn('Image failed to load:', item.imageUrl);
                    e.target.style.display = 'none';
                    const fallback = e.target.parentNode.querySelector('.image-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                  onLoad={(e) => {
                    // If image loads successfully, hide fallback
                    const fallback = e.target.parentNode.querySelector('.image-fallback');
                    if (fallback) fallback.style.display = 'none';
                  }}
                />
              ) : null}
              
              {/* Fallback placeholder - shown if no image or image fails to load */}
              <div 
                className={`image-fallback w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${
                  item.imageUrl && item.imageUrl !== 'local_preview' ? 'hidden' : 'flex'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4"></div>
                  <p className="text-gray-500 text-lg font-medium">{item.category}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {item.imageUrl && item.imageUrl !== 'local_preview' ? 'Image not available' : 'No image provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${
                  item.status === 'Lost' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {item.status === 'Lost' ? <AlertCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  {item.status}
                </span>
                
                {item.claimed && (
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Claimed
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

              {/* Meta Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Tag className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="font-medium capitalize">{item.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Posted</p>
                    <p className="font-medium">
                      {(() => {
                        const date = new Date(item.createdAt || item.date);
                        const now = new Date();
                        const diffTime = Math.abs(now - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) return 'Today';
                        if (diffDays === 2) return 'Yesterday';
                        if (diffDays <= 7) return `${diffDays} days ago`;
                        return date.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Posted By</h2>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {item.owner?.name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(item.owner?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
              
              {isLoggedIn ? (
                <div className="space-y-3">
                  {!item.claimed && (
                    <button
                      onClick={handleClaim}
                      disabled={claiming}
                      className={`w-full py-3 px-4 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        item.status === 'Lost'
                          ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                      } disabled:opacity-50`}
                    >
                      {claiming ? 'Processing...' : (
                        item.status === 'Lost' ? 'I Found This Item' : 'This Is My Item'
                      )}
                    </button>
                  )}

                  {/* Show admin contact after claiming */}
                  {item.claimed && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-900">Item Claimed</span>
                      </div>
                      <p className="text-sm text-green-800 mb-3">
                        Your claim has been submitted. Contact admin for assistance.
                      </p>
                      <button
                        onClick={() => {
                          window.location.href = 'mailto:admin@platform.com?subject=Item Claim Assistance&body=Hello Admin,%0D%0A%0D%0AI have claimed an item and need assistance:%0D%0A%0D%0AItem: ' + encodeURIComponent(item.title) + '%0D%0AItem ID: ' + encodeURIComponent(item._id || item.id) + '%0D%0ALocation: ' + encodeURIComponent(item.location) + '%0D%0A%0D%0APlease help me with the next steps.%0D%0A%0D%0AThank you!';
                        }}
                        className="w-full py-2 px-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        📧 Contact Admin Now
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onContact(item)}
                    className="w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Owner
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share Item
                  </button>
                  
                  <button
                    onClick={() => onReport && onReport(item)}
                    className="w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <Flag className="h-5 w-5 mr-2" />
                    Report Issue
                  </button>
                </div>
              ) : (
                <LoginRequired 
                  onLogin={() => window.location.href = '/login'}
                  message="Sign in to contact the owner and claim items"
                />
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Safety Tips</h3>
                  <ul className="text-sm text-yellow-800 space-y-2">
                    <li>• Meet in public, well-lit locations</li>
                    <li>• Verify ownership before returning items</li>
                    <li>• Don't share sensitive personal information</li>
                    <li>• Report suspicious activity to security immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Admin */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Contact Admin</h3>
              <p className="text-sm text-blue-800 mb-3">
                Need help with claims, verification, or item pickup? Contact the admin directly.
              </p>
              <div className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-blue-900">
                    
                    <span>+1-800-555-0123</span>
                  </div>
                  <div className="flex items-center text-blue-900">
                    
                    <span>admin@platform.com</span>
                  </div>
                </div>
                
                {/* Quick contact buttons */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => {
                      window.location.href = 'tel:+18005550123';
                    }}
                    className="py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    📞 Call Admin
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = 'mailto:admin@platform.com?subject=Item Inquiry&body=Hello Admin,%0D%0A%0D%0AI need assistance with this item:%0D%0A%0D%0AItem: ' + encodeURIComponent(item.title) + '%0D%0AItem ID: ' + encodeURIComponent(item._id || item.id) + '%0D%0ALocation: ' + encodeURIComponent(item.location) + '%0D%0A%0D%0APlease contact me.%0D%0A%0D%0AThank you!';
                    }}
                    className="py-2 px-3 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    📧 Email Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;