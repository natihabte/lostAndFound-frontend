import React, { useRef, useEffect, useState } from 'react';
const StableSearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "",
  items = [],
  ...props 
}) => {
  const inputRef = useRef(null);
  const previousValue = useRef(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved).slice(0, 5)); // Keep last 5 searches
    }
  }, []);

  // Generate suggestions from items
  useEffect(() => {
    if (value && value.length > 0) {
      const itemSuggestions = items
        .filter(item => 
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
        .map(item => ({
          type: 'item',
          text: item.title,
          category: item.category,
          status: item.status
        }));
      
      setSuggestions(itemSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value, items]);

  // Keep track of previous value for cursor position
  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion.text;
    
    // Add to search history
    const newHistory = [searchText, ...searchHistory.filter(h => h !== searchText)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // Update search value
    if (onChange) {
      onChange({ target: { value: searchText } });
    }
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        ref={inputRef}
        type="search"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className} ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        autoComplete="off"
        spellCheck="false"
        aria-label="Search items"
        {...props}
      />
      
      {/* Search Suggestions Dropdown */}
      {showSuggestions && (searchHistory.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                >
                  
                  Clear
                </button>
              </div>
              {searchHistory.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick({ text: search })}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center text-sm"
                >
                  
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Item Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              <span className="text-sm font-medium text-gray-700 mb-2 block">Suggested Items</span>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    
                    <span className="text-gray-700">{suggestion.text}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      suggestion.status === 'Lost' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {suggestion.status}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{suggestion.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* No suggestions */}
          {searchHistory.length === 0 && suggestions.length === 0 && value && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StableSearchInput;