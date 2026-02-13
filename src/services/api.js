// API service for handling HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get authentication token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Handle API response
export const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Authentication API
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: createHeaders(false),
    body: JSON.stringify({ email, password })
  });
  
  return handleResponse(response);
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: createHeaders(false),
    body: JSON.stringify(userData)
  });
  
  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

// Items API
export const getItems = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE_URL}/items?${queryString}` : `${API_BASE_URL}/items`;
  
  const response = await fetch(url, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

export const getItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

export const createItem = async (itemData) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(itemData)
  });
  
  return handleResponse(response);
};

export const updateItem = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify(updateData)
  });
  
  return handleResponse(response);
};

export const deleteItem = async (id) => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: 'DELETE',
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

// Claims API
export const getClaims = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE_URL}/claims?${queryString}` : `${API_BASE_URL}/claims`;
  
  const response = await fetch(url, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

export const submitClaim = async (claimData) => {
  const response = await fetch(`${API_BASE_URL}/claims`, {
    method: 'POST',
    headers: createHeaders(),
    body: JSON.stringify(claimData)
  });
  
  return handleResponse(response);
};

export const updateClaim = async (id, updateData) => {
  const response = await fetch(`${API_BASE_URL}/claims/${id}`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify(updateData)
  });
  
  return handleResponse(response);
};

// Users API
export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: createHeaders(),
    body: JSON.stringify(profileData)
  });
  
  return handleResponse(response);
};

// Organizations API
export const getOrganizations = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE_URL}/organizations?${queryString}` : `${API_BASE_URL}/organizations`;
  
  const response = await fetch(url, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

export const getOrganization = async (id) => {
  const response = await fetch(`${API_BASE_URL}/organizations/${id}`, {
    headers: createHeaders()
  });
  
  return handleResponse(response);
};

// File Upload API
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = getAuthToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData
  });
  
  return handleResponse(response);
};