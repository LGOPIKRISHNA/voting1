import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Vote, LogOut, PlusSquare } from 'lucide-react';

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Vote className="h-8 w-8 text-indigo-600" />
              <Link to="/dashboard" className="ml-2 text-xl font-semibold text-gray-900">
                VotePlatform
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <Link
                  to="/create-poll"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusSquare className="h-4 w-4 mr-2" />
                  Create Poll
                </Link>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}