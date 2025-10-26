import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, UserIcon, LockIcon } from './Icons';

interface LoginPageProps {
  onLogin: (rememberMe: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load remembered username from localStorage on component mount
    const savedUsername = localStorage.getItem('newslenss-remembered-username');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true); // If username is saved, assume 'remember me' was checked
    } else {
      setRememberMe(false); // If no username is saved, default 'remember me' to false
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    // This is a mock login. In a real app, you would validate credentials.
    // For this demo, any non-empty username/password will "log in".
    setError('');
    onLogin(rememberMe);

    // Persist username based on rememberMe preference
    if (rememberMe) {
      localStorage.setItem('newslenss-remembered-username', username);
    } else {
      localStorage.removeItem('newslenss-remembered-username');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">
              <ShieldCheckIcon className="text-indigo-600 mr-2 h-8 w-8 animate-float" />
              NEWS lenss
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Please sign in to continue</p>
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all duration-300 ease-in-out hover:shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username (Email)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                    id="username"
                    name="username"
                    type="email"
                    autoComplete="email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-slate-600 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200"
                    placeholder="user@example.com"
                 />
              </div>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                 </div>
                 <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-slate-600 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200"
                    placeholder="********"
                 />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-px disabled:transform-none"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};