import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ItemCard({ item }) {
  return (
    <motion.article 
      whileHover={{ y: -3 }} 
      className="border rounded-lg p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500 flex-shrink-0">
          {item.photo ? (
            <img src={item.photo} alt={item.title} className="w-full h-full object-cover rounded-md" />
          ) : (
            "Photo"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/items/${item.id}`} className="text-lg font-semibold hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-900 dark:text-gray-100">
            {item.title}
          </Link>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{item.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.status === 'Lost' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 
            item.status === 'Found' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
            item.status === 'Claimed' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
            'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
          }`}>
            {item.status}
          </div>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">{item.location}</div>
        </div>
      </div>
    </motion.article>
  );
}
