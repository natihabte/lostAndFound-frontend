import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { apiListItems } from "./api";

function ItemCard({ item }) {
  return (
    <motion.article whileHover={{ y: -3 }} className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Photo</div>
        <div className="flex-1">
          <Link to={`/items/${item.id}`} className="text-lg font-semibold hover:underline">{item.title}</Link>
          <div className="text-sm text-gray-500">{item.category} • {new Date(item.createdAt).toLocaleDateString()}</div>
          <p className="mt-2 text-sm text-gray-700">{item.description}</p>
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-xs ${item.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{item.status}</div>
          <div className="mt-3 text-sm text-gray-600">{item.location}</div>
        </div>
      </div>
    </motion.article>
  );
}

function QuickList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(apiListItems().slice(0, 6));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((i) => <ItemCard key={i.id} item={i} />)}
    </div>
  );
}

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold">Find & Report lost items in your community</h1>
          <p className="text-gray-600 mt-2">Browse recent lost and found posts, report an item, or claim something that belongs to you.</p>

          <div className="mt-6 space-y-4">
            <QuickList />
          </div>
        </div>

        <aside className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="font-semibold">How it works</h3>
          <ol className="mt-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Browse items or post what you lost/found.</li>
            <li>Contact the poster to verify ownership.</li>
            <li>Mark item as resolved once returned.</li>
          </ol>
          <Link to="/add" className="mt-4 inline-block text-sm bg-teal-500 text-white px-3 py-2 rounded-md">Report an item</Link>
        </aside>
      </section>
    </main>
  );
}