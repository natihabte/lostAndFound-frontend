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
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h2 className="text-xl font-semibold">{isRegister ? "Create Account" : "Login"}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {isRegister ? "Join our community" : "Welcome back"}
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              required 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your@email.com" 
              className="w-full border rounded-md px-3 py-2" 
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                className="w-full border rounded-md px-3 py-2" 
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              {isRegister ? "Register" : "Login"}
            </button>
            <Link to="/" className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</Link>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-indigo-600 hover:underline"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>

        {/* PROMINENT ADMIN LOGIN BUTTON */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3 font-medium">🛡️ Administrative Access 🛡️</p>
            <button 
              onClick={() => navigate('/admin-login')} 
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors font-bold flex items-center justify-center"
            >
              <span className="mr-2">🛡️</span>
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
