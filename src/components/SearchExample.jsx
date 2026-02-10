import React, { useState } from 'react';
import UniversalSearchBar, { filterItemsBySearch } from './UniversalSearchBar';

/**
 * Example component showing how to use the UniversalSearchBar
 */
const SearchExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data
  const items = [
    { id: 1, title: 'Lost iPhone', description: 'Black iPhone 12 with cracked screen' },
    { id: 2, title: 'Found Wallet', description: 'Brown leather wallet with ID cards' },
    { id: 3, title: 'Missing Keys', description: 'Set of keys with blue keychain' },
    { id: 4, title: 'Lost Laptop', description: 'MacBook Pro 13 inch silver' },
  ];

  // Filter items based on search term
  const filteredItems = filterItemsBySearch(items, searchTerm);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Search Example</h2>
      
      {/* Universal Search Bar */}
      <UniversalSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search items by title or description..."
        className="mb-6"
      />

      {/* Results */}
      <div className="space-y-4">
        <p className="text-gray-600">
          Showing {filteredItems.length} of {items.length} items
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow border">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
        
        {filteredItems.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No items found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchExample;