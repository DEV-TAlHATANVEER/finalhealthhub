import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/lab/dashboard', label: 'Dashboard' },
  { path: '/lab/test-management', label: 'Test Management' },
  { path: '/lab/reports', label: 'Reports' },
  { path: '/lab/payments', label: 'Payments' },
  { path: '/lab/profile', label: 'Profile' },
];

export default function SideNav() {
  const location = useLocation();

  return (
    <div className="bg-white h-full shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Lab Panel</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors ${
              location.pathname === item.path ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : ''
            }`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
