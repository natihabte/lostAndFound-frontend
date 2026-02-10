import React, { useState } from 'react';
import { Send, Mail, Phone, MessageCircle, X, CheckCircle } from 'lucide-react';

const ModernMessaging = ({ item, onClose, currentUser }) => {
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('message'); // 'message', 'email', 'phone'
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would integrate with your messaging API
      console.log('Sending message:', {
        itemId: item._id,
        to: item.owner,
        from: currentUser,
        message,
        contactMethod
      });
      
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectContact = (method) => {
    if (method === 'email' && item.contact) {
      window.location.href = `mailto:${item.contact}?subject=Regarding: ${item.title}&body=Hi, I'm contacting you about the ${item.status.toLowerCase()} item "${item.title}" that you posted on the Public Sector Lost & Found Management Platform.`;
    } else if (method === 'phone' && item.phone) {
      window.location.href = `tel:${item.phone}`;
    }
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-4">
            Your message has been sent to the item owner. They will be notified and can respond directly.
          </p>
          <p className="text-sm text-gray-500">Closing automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Contact Owner</h2>
              <p className="text-sm text-gray-600">About: {item.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            
          </button>
        </div>

        <div className="p-6">
          {/* Item Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-4">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Posted {new Date(item.createdAt || item.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.location}</p>
              </div>
            </div>
          </div>

          {/* Contact Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How would you like to contact them?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* In-App Message */}
              <button
                onClick={() => setContactMethod('message')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  contactMethod === 'message'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                
                <div className="font-medium text-gray-900">Send Message</div>
                <div className="text-sm text-gray-600">Secure in-app messaging</div>
              </button>

              {/* Email */}
              {item.contact && (
                <button
                  onClick={() => handleDirectContact('email')}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all text-left"
                >
                  
                  <div className="font-medium text-gray-900">Send Email</div>
                  <div className="text-sm text-gray-600">Direct email contact</div>
                </button>
              )}

              {/* Phone */}
              {item.phone && (
                <button
                  onClick={() => handleDirectContact('phone')}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all text-left"
                >
                  
                  <div className="font-medium text-gray-900">Call Now</div>
                  <div className="text-sm text-gray-600">Direct phone call</div>
                </button>
              )}
            </div>
          </div>

          {/* Message Form (only show if in-app messaging is selected) */}
          {contactMethod === 'message' && (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder={`Hi! I'm interested in the ${item.status.toLowerCase()} item "${item.title}". ${
                    item.status === 'Lost' 
                      ? 'I think I may have found it. Can we arrange to meet?' 
                      : 'I believe this might be mine. Can we discuss the details?'
                  }`}
                  required
                />
              </div>

              {/* Quick Message Templates */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick templates:</p>
                <div className="flex flex-wrap gap-2">
                  {item.status === 'Lost' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMessage(`Hi! I think I found your ${item.title}. Can we meet to verify it's yours?`)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                      >
                        I found it
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessage(`Hi! I saw your post about the lost ${item.title}. I have some information that might help.`)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        I have info
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setMessage(`Hi! I think the ${item.title} you found might be mine. Can we arrange to meet?`)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                      >
                        It's mine
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessage(`Hi! Can you provide more details about the ${item.title} you found? I think it might be mine.`)}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                      >
                        Need details
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Safety Reminder</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Always meet in public places. Verify ownership before returning items. 
                      Report any suspicious activity to security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center"
                >
                  
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          )}

          {/* Owner Info (if not using in-app messaging) */}
          {contactMethod !== 'message' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center">
                
                <div>
                  <p className="font-medium text-blue-900">Contact Information</p>
                  <div className="text-sm text-blue-700 mt-1">
                    {item.contact && contactMethod === 'email' && (
                      <p>Email: {item.contact}</p>
                    )}
                    {item.phone && contactMethod === 'phone' && (
                      <p>Phone: {item.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernMessaging;