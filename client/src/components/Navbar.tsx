import React from "react";
import { Link, NavLink } from "react-router-dom";

interface NavbarProps {
  isOnline: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOnline, onLogout }) => (
  <nav className="w-full flex items-center justify-between bg-white shadow px-8 py-4 mb-8">
    <div className="flex items-center gap-6">
      <span className="text-2xl font-bold text-amber-700">Plan & Go</span>
      <Link
        to="/dashboard"
        className="text-lg text-gray-700 hover:text-amber-700 font-medium"
      >
        Home
      </Link>
      <NavLink
        to="/dashboard/archived"
        className={({ isActive }) =>
          `text-lg font-medium transition-opacity duration-200 ${
            isActive
              ? "text-amber-700 opacity-100"
              : "text-gray-400 opacity-60 hover:text-amber-700 hover:opacity-100"
          }`
        }
      >
        Archived
      </NavLink>
    </div>
    <div className="flex items-center gap-4">
      {!isOnline && (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800">
          Offline
        </span>
      )}
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Log out
      </button>
    </div>
  </nav>
);

export default Navbar;
