import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ItemCard({ item }) {
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