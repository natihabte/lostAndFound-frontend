# UniversalSearchBar Component

A reusable, accessible search input component for the MERN Lost and Found project.

## Features

- ✅ **Controlled Input**: Uses React state for controlled input behavior
- ✅ **Case-insensitive Search**: Searches both title and description fields
- ✅ **Instant Results**: Updates results as you type (no submit required)
- ✅ **Clear Functionality**: Easy-to-use clear button when search has content
- ✅ **Accessible Design**: Proper ARIA labels and keyboard navigation
- ✅ **Responsive**: Works on all screen sizes
- ✅ **Clean UI**: Modern design with search icon and clear button
- ✅ **Empty Search Handling**: Shows all items when search is empty

## Usage

### Basic Usage

```jsx
import React, { useState } from 'react';
import UniversalSearchBar, { filterItemsBySearch } from './components/UniversalSearchBar';

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items] = useState([
    { id: 1, title: 'Lost Phone', description: 'Black iPhone with cracked screen' },
    { id: 2, title: 'Found Wallet', description: 'Brown leather wallet' }
  ]);

  const filteredItems = filterItemsBySearch(items, searchTerm);

  return (
    <div>
      <UniversalSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search items..."
      />
      
      {filteredItems.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Advanced Usage with Custom Styling

```jsx
<UniversalSearchBar
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search by title or description..."
  className="max-w-2xl mx-auto shadow-lg"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Current search term (controlled input) |
| `onChange` | `function` | Required | Callback when search term changes |
| `placeholder` | `string` | `'Search by title or description...'` | Placeholder text |
| `className` | `string` | `''` | Additional CSS classes |

## Helper Function

### `filterItemsBySearch(items, searchTerm)`

Filters an array of items based on the search term.

**Parameters:**
- `items` (Array): Array of items to filter
- `searchTerm` (string): Search term to filter by

**Returns:** Array of filtered items

**Search Logic:**
- Case-insensitive search
- Searches in `title` and `description` fields
- Returns all items if search term is empty
- Handles null/undefined values gracefully

## Integration Examples

### ItemsList Page
```jsx
// Before
import SearchBar from "../components/SearchBar";

// After  
import UniversalSearchBar, { filterItemsBySearch } from "../components/UniversalSearchBar";

// Usage
const searchFiltered = filterItemsBySearch(items, query);
```

### BrowseItemsPage
```jsx
const [localSearchTerm, setLocalSearchTerm] = useState('');

// In render
<UniversalSearchBar
  value={localSearchTerm}
  onChange={setLocalSearchTerm}
  placeholder="Search items by title or description..."
  className="max-w-2xl mx-auto"
/>
```

## Accessibility Features

- **ARIA Labels**: Proper `aria-label` attributes for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear button is properly focusable
- **Screen Reader Support**: Icons are marked as `aria-hidden="true"`

## Styling

The component uses Tailwind CSS classes and is fully responsive:

- **Mobile**: Full width with proper touch targets
- **Desktop**: Maintains aspect ratio with hover states
- **Focus States**: Blue ring focus indicator
- **Icons**: Lucide React icons for consistency

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance

- **Lightweight**: Minimal dependencies (only Lucide React for icons)
- **Efficient**: Uses controlled inputs for optimal React performance
- **No Debouncing**: Immediate search results (add debouncing if needed for API calls)

## Migration Guide

### From SearchBar Component

```jsx
// Old
<SearchBar 
  value={query} 
  onChange={setQuery} 
  onSubmit={() => {}} 
/>

// New
<UniversalSearchBar 
  value={query} 
  onChange={setQuery} 
  placeholder="Search items..."
/>
```

### From ModernSearchBar Component

The ModernSearchBar is more complex with advanced filters. Use UniversalSearchBar for simple search, keep ModernSearchBar for advanced filtering needs.

## Testing

```jsx
// Test the filter function
import { filterItemsBySearch } from './UniversalSearchBar';

const items = [
  { title: 'Lost Phone', description: 'Black iPhone' },
  { title: 'Found Keys', description: 'Set of keys' }
];

// Should return items matching "phone"
const result = filterItemsBySearch(items, 'phone');
expect(result).toHaveLength(1);
```