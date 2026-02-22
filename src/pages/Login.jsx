import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, name || undefined);
    navigate('/');
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{isRegister ? "Create Account" : "Login"}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {isRegister ? "Join our community" : "Welcome back"}
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email *</label>
            <input 
              required 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your@email.com" 
              className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                className="w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" 
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              {isRegister ? "Register" : "Login"}
            </button>
            <Link to="/" className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Cancel</Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </main>
  );
}
