import React, { useState, useEffect } from "react";
import { apiListItems } from "../api";
import ItemCard from "../components/ItemCard";
import UniversalSearchBar, { filterItemsBySearch } from "../components/UniversalSearchBar";

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    setItems(apiListItems());
  }, []);

  // First filter by search term using the universal search function
  const searchFiltered = filterItemsBySearch(items, query);
  
  // Then apply additional filters
  const filtered = searchFiltered.filter((it) => {
    if (statusFilter && it.status !== statusFilter) return false;
    if (categoryFilter && it.category !== categoryFilter) return false;
    return true;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Items</h2>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-md px-2 py-1">
            <option value="">All Status</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border rounded-md px-2 py-1">
            <option value="">All Categories</option>
            <option>Electronic</option>
            <option>Document</option>
            <option>Pet</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <UniversalSearchBar 
          value={query} 
          onChange={setQuery} 
          placeholder="Search items by title or description..."
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {filtered.map((it) => <ItemCard key={it.id} item={it} />)}
        {filtered.length === 0 && <div className="text-gray-500">No items match your filters.</div>}
      </div>
    </main>
  );
}
