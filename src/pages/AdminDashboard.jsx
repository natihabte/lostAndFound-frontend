import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiListItems, apiDeleteItem } from "../api";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0 });

  useEffect(() => {
    const all = apiListItems();
    setItems(all);
    
    const lost = all.filter(i => i.status === 'Lost').length;
    const found = all.filter(i => i.status === 'Found').length;
    const resolved = all.filter(i => i.status === 'Resolved').length;
    
    setStats({ total: all.length, lost, found, resolved });
  }, []);

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      apiDeleteItem(id);
      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      
      const lost = updated.filter(i => i.status === 'Lost').length;
      const found = updated.filter(i => i.status === 'Found').length;
      const resolved = updated.filter(i => i.status === 'Resolved').length;
      setStats({ total: updated.length, lost, found, resolved });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md shadow-sm border border-red-100 dark:border-red-800">
          <div className="text-sm text-red-600 dark:text-red-400">Lost Items</div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.lost}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md shadow-sm border border-green-100 dark:border-green-800">
          <div className="text-sm text-green-600 dark:text-green-400">Found Items</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.found}</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md shadow-sm border border-blue-100 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400">Resolved</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.resolved}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">All Posts</h3>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border rounded-md p-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">{it.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {it.category} • {it.location} • {it.status}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/items/${it.id}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View</Link>
                <button onClick={() => onDelete(it.id)} className="text-sm text-red-500 dark:text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
