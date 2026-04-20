import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cold-950 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="bg-cold-accent p-2 rounded-xl">
          <Video className="w-6 h-6 text-cold-950" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">ColdTube</span>
      </Link>

      <div className="w-full max-w-sm bg-cold-900 border border-cold-800 rounded-2xl p-8 shadow-2xl shadow-cold-accent/5">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-cold-950 border border-cold-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cold-accent focus:ring-1 focus:ring-cold-accent transition-all placeholder:text-slate-600"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300 ml-1 flex justify-between">
              <span>Password</span>
              <a href="#" className="text-cold-accent hover:underline">Forgot?</a>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-cold-950 border border-cold-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cold-accent focus:ring-1 focus:ring-cold-accent transition-all placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-cold-accent hover:bg-cold-accent-hover text-cold-950 disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cold-accent hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
