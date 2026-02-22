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
    <main className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-gray-500 dark:text-gray-400">Item not found.</div>
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
    <main className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500">
            {item.photo ? <img src={item.photo} alt={item.title} className="w-full h-full object-cover rounded-md" /> : "Photo"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.category} • {item.location}</div>
            <div className="mt-4 text-gray-700 dark:text-gray-300">{item.description}</div>

            <div className="mt-6 flex items-center gap-3">
              <a className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" href={`tel:${item.contact}`}>Call: {item.contact}</a>
              <button onClick={onClaim} className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">This is mine / I claim</button>
              {user && user.id === item.ownerId && (
                <button onClick={onResolve} className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800">Mark Resolved</button>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="font-medium text-gray-900 dark:text-gray-100">{item.status}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Posted: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
