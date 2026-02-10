import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetItem, apiUpdateItem } from "../api";
import { useAuth } from "../AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const got = apiGetItem(id);
    if (!got) {
      setItem(null);
    } else setItem(got);
  }, [id]);

  if (!item) return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-gray-500">Item not found.</div>
    </main>
  );

  const onClaim = () => {
    if (!user) return navigate('/login');
    apiUpdateItem(item.id, { status: 'Claimed' });
    setItem(apiGetItem(item.id));
  };

  const onResolve = () => {
    apiUpdateItem(item.id, { status: 'Resolved' });
    setItem(apiGetItem(item.id));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <div className="flex gap-6">
          <div className="w-48 h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
            {item.photo ? <img src={item.photo} alt={item.title} className="w-full h-full object-cover rounded-md" /> : "Photo"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <div className="text-sm text-gray-500">{item.category} • {item.location}</div>
            <div className="mt-4 text-gray-700">{item.description}</div>

            <div className="mt-6 flex items-center gap-3">
              <a className="px-4 py-2 bg-indigo-600 text-white rounded-md" href={`tel:${item.contact}`}>Call: {item.contact}</a>
              <button onClick={onClaim} className="px-4 py-2 border rounded-md hover:bg-gray-50">This is mine / I claim</button>
              {user && user.id === item.ownerId && (
                <button onClick={onResolve} className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">Mark Resolved</button>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Status: <span className="font-medium">{item.status}</span>
            </div>
            <div className="text-sm text-gray-500">
              Posted: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
