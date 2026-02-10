import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, MapPin, Tag, FileText, Save, X, Image as ImageIcon } from 'lucide-react';

const ModernAddItem = ({ onClose, onSubmit, currentUser, editingItem, selectedOrganization }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: editingItem?.title || '',
    description: editingItem?.description || '',
    category: editingItem?.category || 'electronic',
    status: editingItem?.status || 'Lost',
    location: editingItem?.location || '',
    contact: editingItem?.contact || currentUser?.email || '',
    phone: editingItem?.phone || currentUser?.phone || '',
    imageUrl: editingItem?.imageUrl || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingItem?.imageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'electronic', label: t('categories.electronic') },
    { value: 'clothing', label: t('categories.clothing') },
    { value: 'accessory', label: t('categories.accessory') },
    { value: 'document', label: t('categories.document') },
    { value: 'book', label: t('categories.book') },
    { value: 'other', label: t('categories.other') }
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('addItem.errors.imageSizeLimit'));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('addItem.errors.invalidImageType'));
      return;
    }

    setImageFile(file);
    setError('');

    // Show preview immediately and store it
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
      
      // Try to upload to server (optional - don't block if it fails)
      setUploading(true);
      
      // Upload in background
      (async () => {
        try {
          const { uploadAPI } = await import('../services/api');
          const response = await uploadAPI.uploadImage(file);
          setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
          console.log('✅ Image uploaded successfully:', response.data.url);
        } catch (error) {
          console.warn('⚠️ Image upload failed, using local preview:', error);
          // Store the base64 preview as the imageUrl for offline use
          setFormData(prev => ({ ...prev, imageUrl: base64Image }));
        } finally {
          setUploading(false);
        }
      })();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError(t('addItem.errors.requiredFields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        ...(selectedOrganization && { organizationId: selectedOrganization.id })
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setError(error.message || t('addItem.errors.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? t('addItem.editTitle') : t('addItem.postTitle')}
            </h2>
            <p className="text-gray-600 mt-1">
              {editingItem ? t('addItem.editSubtitle') : t('addItem.postSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('addItem.whatHappened')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'Lost' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.status === 'Lost'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="text-2xl mb-2">😢</div>
                <div className="font-medium">{t('addItem.lostSomething')}</div>
                <div className="text-sm text-gray-600">{t('addItem.reportLost')}</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'Found' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.status === 'Found'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-medium">{t('addItem.foundSomething')}</div>
                <div className="text-sm text-gray-600">{t('addItem.reportFound')}</div>
              </button>
            </div>
          </div>

          {/* Organization Selection (if not pre-selected) */}
          {!selectedOrganization && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                {t('addItem.selectOrganization')} (Optional)
              </label>
              <select
                value={formData.organizationId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, organizationId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('addItem.noOrganization')}</option>
                {/* TODO: Load organizations from API */}
                <option value="org_1">Addis Ababa University</option>
                <option value="org_2">Hawassa University</option>
                <option value="org_3">Black Lion Hospital</option>
              </select>
            </div>
          )}

          {/* Show selected organization */}
          {selectedOrganization && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center">
                <img 
                  src={selectedOrganization.logo} 
                  alt={selectedOrganization.name}
                  className="w-12 h-12 rounded-lg object-cover mr-3"
                />
                <div>
                  <p className="font-medium text-blue-900">
                    {t('addItem.postingTo')}: {selectedOrganization.name}
                  </p>
                  <p className="text-sm text-blue-600">{selectedOrganization.location}</p>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('addItem.itemTitle')} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('addItem.titlePlaceholder')}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              {t('items.category')} *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    formData.category === cat.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xl mb-1"></div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {t('items.location')} *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('addItem.locationPlaceholder')}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              {t('items.description')} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t('addItem.descriptionPlaceholder')}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              {t('addItem.photo')} (Optional)
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                    <div className="text-white text-sm">{t('addItem.uploading')}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-blue-600">{t('addItem.clickToUpload')}</span> {t('addItem.orDragDrop')}
                  </p>
                  <p className="text-xs text-gray-500">{t('addItem.imageFormats')}</p>
                  <p className="text-xs text-green-600 mt-1">Upload works with local preview</p>
                </label>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                
                {t('addItem.contactEmail')}
              </label>
              <input
                type="email"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                
                {t('addItem.phoneNumber')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.phoneNumberPlaceholder')}
              />
            </div>
          </div>

          {/* Error Message - Only show non-upload errors */}
          {error && !error.includes('upload') && !error.includes('Upload') && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
              
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              {t('items.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center ${
                formData.status === 'Lost'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50`}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading 
                ? (editingItem ? t('addItem.updating') : t('addItem.posting')) 
                : (editingItem ? t('addItem.updateButton') : t('addItem.postButton', { status: formData.status }))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernAddItem;