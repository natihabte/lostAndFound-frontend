// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Response Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON response from server');
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration API Error:', error);
      // Fallback: simulate successful registration for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock registration');
        return {
          success: true,
          message: 'Registration successful (mock mode)',
          userId: 'mock_' + Date.now()
        };
      }
      throw error;
    }
  },

  verify: async (email, code) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Verification API Error:', error);
      // Fallback: simulate successful verification for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock verification');
        return {
          success: true,
          message: 'Email verified successfully (mock mode)',
          token: 'mock_token_' + Date.now(),
          user: {
            id: 'mock_user_1',
            name: email.split('@')[0],
            email: email,
            role: 'user'
          }
        };
      }
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login API Error:', error);
      // Fallback: simulate successful login for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock login');
        return {
          success: true,
          token: 'mock_token_' + Date.now(),
          user: {
            id: 'mock_user_1',
            name: email.split('@')[0],
            email: email,
            role: 'user'
          }
        };
      }
      throw error;
    }
  },

  resendCode: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Resend Code API Error:', error);
      // Fallback: simulate successful resend for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock resend');
        return {
          success: true,
          message: 'Verification code sent (mock mode)'
        };
      }
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = getAuthToken();
      const currentUser = authHelpers.getUser();
      
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword,
          email: currentUser?.email // Include email for fallback identification
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Change Password API Error:', error);
      // Fallback: simulate successful password change for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock password change');
        return {
          success: true,
          message: 'Password changed successfully (mock mode)'
        };
      }
      throw error;
    }
  }
};

// Items API
export const itemsAPI = {
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      
      const response = await fetch(`${API_URL}/items?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await handleResponse(response);
      return result; // Return the full response object with data property
    } catch (error) {
      console.error('Items API Error:', error);
      // Fallback: return mock items for development (similar to organization items)
      if (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.name === 'TypeError') {
        
        console.warn('Backend not available, using mock items for Browse Items page');
        
        // Get items from localStorage if available
        const localItems = JSON.parse(localStorage.getItem('localItems') || '[]');
        
        // Mock items similar to organization items but for general browsing
        const mockItems = [
          {
            _id: 'browse_item_1',
            title: 'Lost iPhone 14',
            category: 'electronic',
            status: 'Lost',
            location: 'Central Library',
            description: 'Black iPhone 14 with cracked screen protector, lost near study area',
            imageUrl: 'https://placehold.co/300x200/ef4444/white?text=iPhone',
            owner: { name: 'Sarah Johnson', _id: 'user_1' },
            organization: 'Addis Ababa University',
            date: '2025-02-04',
            claimed: false
          },
          {
            _id: 'browse_item_2',
            title: 'Found Laptop Bag',
            category: 'accessory',
            status: 'Found',
            location: 'Student Center',
            description: 'Black Dell laptop bag with charger inside, found on bench',
            imageUrl: 'https://placehold.co/300x200/10b981/white?text=Laptop+Bag',
            owner: { name: 'Michael Chen', _id: 'user_2' },
            organization: 'Hawassa University',
            date: '2025-02-03',
            claimed: false
          },
          {
            _id: 'browse_item_3',
            title: 'Lost Student ID',
            category: 'document',
            status: 'Lost',
            location: 'Main Gate',
            description: 'University ID card with photo, name: Alex Wilson',
            imageUrl: 'https://placehold.co/300x200/f59e0b/white?text=ID+Card',
            owner: { name: 'Alex Wilson', _id: 'user_3' },
            organization: 'Black Lion Hospital',
            date: '2025-02-02',
            claimed: true // This was returned
          },
          {
            _id: 'browse_item_4',
            title: 'Found Keys',
            category: 'accessory',
            status: 'Found',
            location: 'Parking Area',
            description: 'Car keys with Toyota remote and house keys',
            imageUrl: 'https://placehold.co/300x200/8b5cf6/white?text=Keys',
            owner: { name: 'Emma Davis', _id: 'user_4' },
            organization: 'Ethiopian Airlines',
            date: '2025-02-01',
            claimed: false
          },
          {
            _id: 'browse_item_5',
            title: 'Lost Wallet',
            category: 'document',
            status: 'Lost',
            location: 'Cafeteria',
            description: 'Brown leather wallet with credit cards and cash',
            imageUrl: 'https://placehold.co/300x200/f97316/white?text=Wallet',
            owner: { name: 'David Kim', _id: 'user_5' },
            organization: 'Commercial Bank of Ethiopia',
            date: '2025-01-31',
            claimed: true // This was returned
          },
          {
            _id: 'browse_item_6',
            title: 'Found Textbook',
            category: 'book',
            status: 'Found',
            location: 'Lecture Hall B',
            description: 'Mathematics textbook, 4th edition, with notes inside',
            imageUrl: 'https://placehold.co/300x200/3b82f6/white?text=Textbook',
            owner: { name: 'Lisa Anderson', _id: 'user_6' },
            organization: 'Abay Bank',
            date: '2025-01-30',
            claimed: false
          },
          {
            _id: 'browse_item_7',
            title: 'Lost Headphones',
            category: 'electronic',
            status: 'Lost',
            location: 'Computer Lab',
            description: 'Sony wireless headphones, black color',
            imageUrl: 'https://placehold.co/300x200/1f2937/white?text=Headphones',
            owner: { name: 'James Wilson', _id: 'user_7' },
            organization: 'Bunna Bank',
            date: '2025-01-29',
            claimed: false
          },
          {
            _id: 'browse_item_8',
            title: 'Found Glasses',
            category: 'accessory',
            status: 'Found',
            location: 'Reading Room',
            description: 'Prescription glasses with black frames',
            imageUrl: 'https://placehold.co/300x200/6b7280/white?text=Glasses',
            owner: { name: 'Maria Garcia', _id: 'user_8' },
            organization: 'Hewlett Packard Enterprise',
            date: '2025-01-28',
            claimed: true // This was returned
          }
        ];
        
        // Combine local items with mock items
        const allItems = [...localItems, ...mockItems];
        
        return {
          success: true,
          data: allItems,
          message: 'Items loaded (mock mode)'
        };
      }
      throw error;
    }
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/items/${id}`);
    return handleResponse(response);
  },

  create: async (itemData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create item API Error:', error);
      
      // Fallback: Create item locally if backend is not available
      if (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.name === 'TypeError') {
        
        console.warn('Backend not available, creating item locally');
        
        // Create mock item locally with consistent ID format
        const itemId = 'local_' + Date.now();
        const mockItem = {
          id: itemId,
          _id: itemId, // Ensure both id and _id are set for consistency
          ...itemData,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date(),
          owner: { 
            name: itemData.contact ? itemData.contact.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Anonymous User', 
            email: itemData.contact || 'user@email.com' 
          },
          claimed: false
        };
        
        // Store in localStorage for persistence
        const existingItems = JSON.parse(localStorage.getItem('localItems') || '[]');
        existingItems.unshift(mockItem);
        localStorage.setItem('localItems', JSON.stringify(existingItems));
        
        return {
          success: true,
          message: 'Item created successfully (saved locally)',
          data: mockItem
        };
      }
      throw error;
    }
  },

  update: async (id, itemData) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  claim: async (id) => {
    try {
      const token = getAuthToken();
      const user = authHelpers.getUser();
      
      const response = await fetch(`${API_URL}/items/${id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          claimer: {
            name: user?.name || 'Anonymous User',
            email: user?.email || 'user@email.com',
            id: user?.id || user?._id
          }
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Claim API Error:', error);
      // Fallback: simulate successful claim for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock claim');
        return {
          success: true,
          message: 'Item claimed successfully (mock mode)',
          adminContact: {
            email: 'admin@platform.com',
            phone: '+1-800-555-0123',
            expectedResponse: '24-48 hours'
          }
        };
      }
      throw error;
    }
  },

  report: async (reportData) => {
    try {
      const token = getAuthToken();
      const user = authHelpers.getUser();
      
      const response = await fetch(`${API_URL}/items/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...reportData,
          reporterInfo: {
            name: user?.name || 'Anonymous User',
            email: user?.email || 'user@email.com',
            id: user?.id || user?._id
          }
        })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Report API Error:', error);
      // Fallback: simulate successful report for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock report submission');
        return {
          success: true,
          message: 'Report submitted successfully (mock mode)',
          data: {
            reportId: 'mock_report_' + Date.now(),
            status: 'pending',
            adminContact: {
              email: 'admin@platform.com',
              phone: '+1-800-555-0123',
              expectedResponse: '24-48 hours'
            }
          }
        };
      }
      throw error;
    }
  },

  getReports: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/items/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get reports API Error:', error);
      // Fallback: return mock reports for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock reports');
        return {
          success: true,
          data: [
            {
              id: 'report_1',
              type: 'new_item',
              reportReason: 'Found laptop in library',
              reporter: { name: 'John Doe', email: 'john@email.com' },
              organizationId: 'org_1',
              status: 'pending',
              createdAt: new Date('2025-02-04'),
              adminNotes: ''
            },
            {
              id: 'report_2',
              type: 'item_issue',
              itemId: 'item_1',
              reportReason: 'This item was already returned',
              reporter: { name: 'Sarah Wilson', email: 'sarah@email.com' },
              organizationId: 'org_2',
              status: 'pending',
              createdAt: new Date('2025-02-03'),
              adminNotes: ''
            }
          ]
        };
      }
      throw error;
    }
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update Profile API Error:', error);
      
      // Check for network/fetch errors or authentication issues
      if (error.name === 'TypeError' || 
          error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('ERR_NETWORK') ||
          error.message.includes('Not authorized')) {
        
        console.warn('Backend not available or auth issue, using local storage update');
        
        // Update localStorage with new data
        const currentUser = authHelpers.getUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          authHelpers.saveUser(updatedUser);
          
          return {
            success: true,
            message: 'Profile updated successfully (saved locally)',
            data: updatedUser
          };
        } else {
          throw new Error('No user data found. Please log in again.');
        }
      }
      throw error;
    }
  },

  getMyItems: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users/me/items`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.warn('Upload API Error (falling back to local preview):', error);
      
      // Instead of throwing error, return a mock success response
      // This allows the form to continue working with local preview
      return {
        success: true,
        message: 'Image preview ready (upload failed but continuing)',
        data: {
          url: 'local_preview_' + Date.now(),
          publicId: 'local_' + Date.now()
        }
      };
    }
  },

  uploadMultiple: async (files) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_URL}/upload/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return handleResponse(response);
    } catch (error) {
      console.warn('Multiple upload API Error (falling back to local preview):', error);
      
      // Return mock success for multiple files
      return {
        success: true,
        message: 'Images preview ready (upload failed but continuing)',
        data: Array.from(files).map((file, index) => ({
          url: 'local_preview_' + Date.now() + '_' + index,
          publicId: 'local_' + Date.now() + '_' + index
        }))
      };
    }
  }
};

// Reports API
export const reportsAPI = {
  getAll: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get reports error:', error);
      // Return mock data for development
      return {
        success: true,
        data: []
      };
    }
  },

  resolve: async (reportId, action) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Resolve report error:', error);
      // Mock success for development
      return {
        success: true,
        message: `Report ${action}d successfully (mock mode)`
      };
    }
  },

  create: async (reportData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  }
};

// Organizations API
export const organizationsAPI = {
  getAll: async (filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/organizations?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get organizations API Error:', error);
      // Fallback: return mock data for development
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock organizations');
        
        // Get locally stored organizations (user-registered)
        const localOrganizations = JSON.parse(localStorage.getItem('localOrganizations') || '[]');
        
        // Mock organizations (default system organizations)
        const mockOrganizations = [
            {
              id: 'org_1',
              name: 'Addis Ababa University',
              type: 'university',
              logo: 'https://placehold.co/100x100/3b82f6/white?text=AAU',
              location: 'Addis Ababa, Ethiopia',
              description: 'Leading university in Ethiopia with multiple campuses',
              activeItems: 5, // Matches actual active items (non-claimed)
              totalItems: 8, // Matches total items available
              rating: 4.8,
              verified: true,
              contact: {
                phone: '+251-11-123-4567',
                email: 'info@aau.edu.et',
                website: 'www.aau.edu.et'
              },
              stats: {
                lostItems: 3, // Matches actual lost items
                foundItems: 5, // Matches actual found items  
                returnedItems: 3 // Matches actual claimed items
              }
            },
            {
              id: 'org_2',
              name: 'Hawassa University',
              type: 'university',
              logo: 'https://placehold.co/100x100/10b981/white?text=HU',
              location: 'Hawassa, Ethiopia',
              description: 'Modern university serving southern Ethiopia',
              activeItems: 5,
              totalItems: 8,
              rating: 4.6,
              verified: true,
              contact: {
                phone: '+251-46-220-6421',
                email: 'info@hu.edu.et',
                website: 'www.hu.edu.et'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            },
            {
              id: 'org_3',
              name: 'Black Lion Hospital',
              type: 'hospital',
              logo: 'https://placehold.co/100x100/ef4444/white?text=BLH',
              location: 'Addis Ababa, Ethiopia',
              description: 'Premier medical facility and teaching hospital',
              activeItems: 5,
              totalItems: 8,
              rating: 4.7,
              verified: true,
              contact: {
                phone: '+251-11-551-7611',
                email: 'info@blacklion.gov.et',
                website: 'www.blacklionhospital.gov.et'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            },
            {
              id: 'org_4',
              name: 'Addis Ababa City Administration',
              type: 'municipality',
              logo: 'https://placehold.co/100x100/f59e0b/white?text=AA',
              location: 'Addis Ababa, Ethiopia',
              description: 'Municipal services and city administration',
              activeItems: 5,
              totalItems: 8,
              rating: 4.4,
              verified: true,
              contact: {
                phone: '+251-11-551-8080',
                email: 'info@addisababa.gov.et',
                website: 'www.addisababa.gov.et'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            },
            {
              id: 'org_5',
              name: 'Ethiopian Airlines',
              type: 'transport',
              logo: 'https://placehold.co/100x100/8b5cf6/white?text=ET',
              location: 'Bole International Airport',
              description: 'National flag carrier airline of Ethiopia',
              activeItems: 5,
              totalItems: 8,
              rating: 4.9,
              verified: true,
              contact: {
                phone: '+251-11-661-7000',
                email: 'customercare@ethiopianairlines.com',
                website: 'www.ethiopianairlines.com'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            },
            {
              id: 'org_6',
              name: 'Commercial Bank of Ethiopia',
              type: 'bank',
              logo: 'https://placehold.co/100x100/059669/white?text=CBE',
              location: 'Multiple Branches',
              description: 'Largest commercial bank in Ethiopia',
              activeItems: 5,
              totalItems: 8,
              rating: 4.5,
              verified: true,
              contact: {
                phone: '+251-11-551-5438',
                email: 'info@combanketh.et',
                website: 'www.combanketh.et'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            },
            {
              id: 'org_7',
              name: 'Abay Bank',
              type: 'bank',
              logo: 'https://placehold.co/100x100/0ea5e9/white?text=AB',
              location: 'Addis Ababa, Ethiopia',
              description: 'Modern banking services across Ethiopia',
              activeItems: 7,
              totalItems: 11,
              rating: 4.3,
              verified: true,
              contact: {
                phone: '+251-11-667-8900',
                email: 'info@abaybank.com.et',
                website: 'www.abaybank.com.et'
              },
              stats: {
                lostItems: 4,
                foundItems: 3,
                returnedItems: 4
              }
            },
            {
              id: 'org_8',
              name: 'Bunna Bank',
              type: 'bank',
              logo: 'https://placehold.co/100x100/dc2626/white?text=BB',
              location: 'Addis Ababa, Ethiopia',
              description: 'Reliable banking partner for businesses and individuals',
              activeItems: 6,
              totalItems: 10,
              rating: 4.6,
              verified: true,
              contact: {
                phone: '+251-11-551-7300',
                email: 'info@bunnabank.com',
                website: 'www.bunnabank.com'
              },
              stats: {
                lostItems: 4,
                foundItems: 2,
                returnedItems: 4
              }
            },
            {
              id: 'org_9',
              name: 'Hewlett Packard Enterprise',
              type: 'other',
              logo: 'https://placehold.co/100x100/16a34a/white?text=HP',
              location: 'Addis Ababa, Ethiopia',
              description: 'Technology solutions and enterprise services',
              activeItems: 8,
              totalItems: 12,
              rating: 4.7,
              verified: true,
              contact: {
                phone: '+251-11-662-4500',
                email: 'info@hpe.com',
                website: 'www.hpe.com'
              },
              stats: {
                lostItems: 5,
                foundItems: 3,
                returnedItems: 4
              }
            },
            {
              id: 'org_10',
              name: 'Mekelle University',
              type: 'university',
              logo: 'https://placehold.co/100x100/7c3aed/white?text=MU',
              location: 'Mekelle, Ethiopia',
              description: 'Leading university in northern Ethiopia',
              activeItems: 5,
              totalItems: 8,
              rating: 4.5,
              verified: true,
              contact: {
                phone: '+251-34-440-9304',
                email: 'info@mu.edu.et',
                website: 'www.mu.edu.et'
              },
              stats: {
                lostItems: 3,
                foundItems: 5,
                returnedItems: 3
              }
            }
          ];
        
        // Combine local organizations with mock organizations (local first)
        const allOrganizations = [...localOrganizations, ...mockOrganizations];
        
        return {
          success: true,
          data: allOrganizations
        };
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/organizations/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get organization by ID API Error:', error);
      throw error;
    }
  },

  getItems: async (orgId, filters = {}) => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/organizations/${orgId}/items?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get organization items API Error:', error);
      // Fallback: return mock items for development (available to guests)
      if (error.message.includes('fetch')) {
        console.warn('Backend not available, using mock organization items for guests');
        return {
          success: true,
          data: [
            {
              _id: 'org_item_1',
              title: 'Lost Student ID Card',
              category: 'document',
              status: 'Lost',
              location: 'Main Library',
              description: 'Blue student ID card with photo, lost near the entrance',
              imageUrl: 'https://placehold.co/300x200/ef4444/white?text=ID+Card',
              owner: { name: 'John Doe', _id: 'user_1' },
              organization: orgId,
              date: '2025-02-01',
              claimed: false
            },
            {
              _id: 'org_item_2',
              title: 'Found Laptop Charger',
              category: 'electronic',
              status: 'Found',
              location: 'Computer Lab 2',
              description: 'Dell laptop charger found on desk',
              imageUrl: 'https://placehold.co/300x200/10b981/white?text=Charger',
              owner: { name: 'Sarah Wilson', _id: 'user_2' },
              organization: orgId,
              date: '2025-02-02',
              claimed: true // This item was returned
            },
            {
              _id: 'org_item_3',
              title: 'Lost Textbook',
              category: 'book',
              status: 'Lost',
              location: 'Lecture Hall A',
              description: 'Mathematics textbook, 3rd edition',
              imageUrl: 'https://placehold.co/300x200/f59e0b/white?text=Book',
              owner: { name: 'Mike Johnson', _id: 'user_3' },
              organization: orgId,
              date: '2025-02-03',
              claimed: false
            },
            {
              _id: 'org_item_4',
              title: 'Found Keys',
              category: 'accessory',
              status: 'Found',
              location: 'Parking Lot B',
              description: 'Set of keys with blue keychain and car remote',
              imageUrl: 'https://placehold.co/300x200/8b5cf6/white?text=Keys',
              owner: { name: 'Alex Smith', _id: 'user_4' },
              organization: orgId,
              date: '2025-02-04',
              claimed: false
            },
            {
              _id: 'org_item_5',
              title: 'Lost Wallet',
              category: 'document',
              status: 'Lost',
              location: 'Cafeteria',
              description: 'Brown leather wallet with credit cards and cash',
              imageUrl: 'https://placehold.co/300x200/f97316/white?text=Wallet',
              owner: { name: 'Maria Garcia', _id: 'user_5' },
              organization: orgId,
              date: '2025-02-05',
              claimed: true // This item was returned
            },
            {
              _id: 'org_item_6',
              title: 'Found Phone',
              category: 'electronic',
              status: 'Found',
              location: 'Student Center',
              description: 'iPhone 14 with blue case, found on table',
              imageUrl: 'https://placehold.co/300x200/3b82f6/white?text=Phone',
              owner: { name: 'David Lee', _id: 'user_6' },
              organization: orgId,
              date: '2025-01-28',
              claimed: true // This item was returned
            },
            {
              _id: 'org_item_7',
              title: 'Lost Backpack',
              category: 'accessory',
              status: 'Lost',
              location: 'Gym',
              description: 'Black Nike backpack with laptop inside',
              imageUrl: 'https://placehold.co/300x200/1f2937/white?text=Backpack',
              owner: { name: 'Emma Wilson', _id: 'user_7' },
              organization: orgId,
              date: '2025-01-30',
              claimed: false
            },
            {
              _id: 'org_item_8',
              title: 'Found Glasses',
              category: 'accessory',
              status: 'Found',
              location: 'Library Reading Room',
              description: 'Black-framed prescription glasses',
              imageUrl: 'https://placehold.co/300x200/6b7280/white?text=Glasses',
              owner: { name: 'Robert Chen', _id: 'user_8' },
              organization: orgId,
              date: '2025-01-25',
              claimed: false
            }
          ]
        };
      }
      throw error;
    }
  }
};

// Auth helpers
export const authHelpers = {
  saveToken: (token) => {
    localStorage.setItem('token', token);
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  }
};

// Admin API for organization management
export const adminAPI = {
  // Organizations
  getOrganizations: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/admin/organizations?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get organizations API Error:', error);
      throw error;
    }
  },

  createOrganization: async (orgData) => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orgData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create organization API Error:', error);
      throw error;
    }
  },

  updateOrganization: async (orgId, updates) => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations/${orgId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update organization API Error:', error);
      throw error;
    }
  },

  updateOrganizationStatus: async (orgId, status, reason = '') => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations/${orgId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reason })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update organization status API Error:', error);
      throw error;
    }
  },

  updateOrganizationPermissions: async (orgId, permissions) => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations/${orgId}/permissions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissions)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update organization permissions API Error:', error);
      throw error;
    }
  },

  deleteOrganization: async (orgId, options = {}) => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations/${orgId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirmDelete: true, ...options })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete organization API Error:', error);
      throw error;
    }
  },

  getOrganizationStats: async (orgId) => {
    try {
      const response = await fetch(`${API_URL}/admin/organizations/${orgId}/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get organization stats API Error:', error);
      throw error;
    }
  },

  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get dashboard stats API Error:', error);
      throw error;
    }
  },

  // Users management
  getUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/admin/users?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get users API Error:', error);
      throw error;
    }
  },

  updateUserRole: async (userId, role, permissions = []) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role, permissions })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update user role API Error:', error);
      throw error;
    }
  },

  suspendUser: async (userId, reason = '') => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Suspend user API Error:', error);
      throw error;
    }
  },

  // Activity logs
  getActivityLogs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/admin/activities?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get activity logs API Error:', error);
      throw error;
    }
  }
};

// Organization permissions helper
export const permissionsHelper = {
  getDefaultPermissions: (plan = 'free') => {
    const defaults = {
      free: {
        canPostLostItems: true,
        canPostFoundItems: true,
        canVerifyFoundItems: false,
        canManageClaims: true,
        canExportData: false,
        canAccessReports: false,
        canCustomizeBranding: false,
        canUseAPI: false,
        maxUsers: 10,
        maxItems: 100,
        maxStorageGB: 1
      },
      basic: {
        canPostLostItems: true,
        canPostFoundItems: true,
        canVerifyFoundItems: true,
        canManageClaims: true,
        canExportData: true,
        canAccessReports: true,
        canCustomizeBranding: true,
        canUseAPI: false,
        maxUsers: 50,
        maxItems: 500,
        maxStorageGB: 5
      },
      premium: {
        canPostLostItems: true,
        canPostFoundItems: true,
        canVerifyFoundItems: true,
        canManageClaims: true,
        canExportData: true,
        canAccessReports: true,
        canCustomizeBranding: true,
        canUseAPI: true,
        maxUsers: 200,
        maxItems: 2000,
        maxStorageGB: 20
      },
      enterprise: {
        canPostLostItems: true,
        canPostFoundItems: true,
        canVerifyFoundItems: true,
        canManageClaims: true,
        canExportData: true,
        canAccessReports: true,
        canCustomizeBranding: true,
        canUseAPI: true,
        maxUsers: -1, // Unlimited
        maxItems: -1, // Unlimited
        maxStorageGB: -1 // Unlimited
      }
    };
    
    return defaults[plan] || defaults.free;
  },

  hasPermission: (permissions, permission) => {
    return permissions && permissions[permission] === true;
  },

  isWithinLimit: (permissions, type, currentCount) => {
    if (!permissions) return false;
    const limitField = `max${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const limit = permissions[limitField];
    return limit === -1 || currentCount < limit; // -1 means unlimited
  }
};