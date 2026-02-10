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
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold">Report Lost / Found Item</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Lost iPhone 13" 
              className="w-full border rounded-md px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2">
              <option>Electronic</option>
              <option>Document</option>
              <option>Pet</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea 
              required 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
              placeholder="Provide detailed description..." 
              className="w-full border rounded-md px-3 py-2" 
              rows={4} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Where was it lost/found?" 
              className="w-full border rounded-md px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <input 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              placeholder="Phone or email" 
              className="w-full border rounded-md px-3 py-2" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={status==='Lost'} onChange={() => setStatus('Lost')} />
                <span>Lost</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={status==='Found'} onChange={() => setStatus('Found')} />
                <span>Found</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Publish</button>
            <Link to="/items" className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
