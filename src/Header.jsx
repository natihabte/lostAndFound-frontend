import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
            LF
          </div>
          <div>
            <div className="font-semibold">Lost & Found</div>
            <div className="text-xs text-gray-500">Community items</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/items" className="text-sm hover:underline">Browse</Link>
          <Link to="/add" className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm hover:brightness-90">
            Report
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/profile")} className="text-sm hover:underline">
                {user.name}
              </button>
              <button onClick={logout} className="text-sm text-red-500 hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm hover:underline">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
