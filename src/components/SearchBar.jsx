import React from "react";

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex gap-2">
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="Search by title, description, or location..." 
        className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
      />
      <button 
        type="submit" 
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
