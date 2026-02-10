import React, { useState } from 'react';
import { usersAPI, authHelpers } from '../services/api';

const ProfileUpdateTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testProfileUpdate = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const testData = {
        name: 'Test User Updated',
        email: 'test@example.com',
        phone: '+1234567890'
      };
      
      console.log('Testing profile update with data:', testData);
      const response = await usersAPI.updateProfile(testData);
      console.log('Profile update response:', response);
      
      setResult(`Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.error('Profile update test error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Profile Update Test</h3>
      <button
        onClick={testProfileUpdate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Profile Update'}
      </button>
      {result && (
        <pre className="mt-4 p-3 bg-white border rounded text-sm overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
};

export default ProfileUpdateTest;