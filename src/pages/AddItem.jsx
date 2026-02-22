import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCreateItem } from "../api";
import { useAuth } from "../AuthContext";

export default function AddItem() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Other");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Lost");
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to post an item");
      navigate("/login");
      return;
    }
    
    const item = {
      id: `${Date.now()}`,
      title,
      category,
      description: desc,
      photo: null,
      location,
      contact: contact || user.email,
      status,
      createdAt: Date.now(),
      ownerId: user.id,
    };
    apiCreateItem(item);
    navigate(`/items/${item.id}`);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Report Lost / Found Item</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title *</label>
            <input 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Lost iPhone 13" 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <option>Electronic</option>
              <option>Document</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
            <textarea 
              required 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              placeholder="Provide detailed description..." 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
              rows={4} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
            <input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Where was it lost/found?" 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Contact Number</label>
            <input 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              placeholder="Phone or email" 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="radio" checked={status==='Lost'} onChange={() => setStatus('Lost')} />
                <span>Lost</span>
              </label>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="radio" checked={status==='Found'} onChange={() => setStatus('Found')} />
                <span>Found</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Publish</button>
            <Link to="/items" className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
