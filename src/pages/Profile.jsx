import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { apiListItems } from "../api";
import ItemCard from "../components/ItemCard";
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) {
      const all = apiListItems();
      setItems(all.filter((i) => i.ownerId === user.id));
    }
  }, [user]);

  if (!user) return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-gray-500">Please login to view your profile.</div>
    </main>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>

        <h3 className="mt-6 font-medium">{t('pages.yourItems')} ({items.length})</h3>
        <div className="mt-3 space-y-3">
          {items.length === 0 && <div className="text-gray-500">{t('emptyStates.noPosts.title')}</div>}
          {items.map((it) => <ItemCard key={it.id} item={it} />)}
        </div>
      </div>
    </main>
  );
}
