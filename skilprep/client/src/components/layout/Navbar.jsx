import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-indigo-600 no-underline">
            SkilPrep
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/workspace" className="text-teal-700 hover:text-teal-800 no-underline text-sm font-semibold">
              All-in-One
            </Link>
            <Link to="/problems" className="text-gray-600 hover:text-gray-900 no-underline text-sm font-medium">
              Problems
            </Link>
            <Link to="/code-executor" className="text-gray-600 hover:text-gray-900 no-underline text-sm font-medium">
              Code Executor
            </Link>
            <Link to="/learning-tracks" className="text-gray-600 hover:text-gray-900 no-underline text-sm font-medium">
              Learning Tracks
            </Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-gray-900 no-underline text-sm font-medium">
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-indigo-600 hover:text-indigo-800 no-underline font-medium">
                  Admin
                </Link>
              )}
              <Link to={`/profile/${user.username}`} className="text-sm text-gray-700 hover:text-gray-900 no-underline font-medium">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 no-underline font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md no-underline transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
