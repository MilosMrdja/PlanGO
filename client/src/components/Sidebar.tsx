import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <span className="text-2xl font-bold text-blue-600">PlanGo</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 ${location.pathname === '/dashboard' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
        >
          Home
        </Link>
        <Link
          to="/dashboard/my-trips"
          className={`block px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 ${location.pathname === '/dashboard/my-trips' ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
        >
          Moja putovanja
        </Link>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 