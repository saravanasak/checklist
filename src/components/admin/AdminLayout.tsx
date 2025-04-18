"use client";

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState('Admin User');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0F1941] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 150 150" 
              className="h-10 w-10"
            >
              <g fill="#FF4F1F">
                <circle cx="75" cy="30" r="25"/>
                <rect x="25" y="70" width="100" height="40" rx="20" ry="20"/>
                <rect x="40" y="120" width="70" height="30" rx="15" ry="15"/>
              </g>
            </svg>
            <div>
              <h1 className="text-xl font-bold">ITS AMER Employee Checklist</h1>
              <p className="text-sm opacity-80">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{currentUser}</span>
            <button className="border border-white/50 px-3 py-1 rounded hover:bg-white/10 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <nav className="w-56 bg-[#0F1941] text-white p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin" 
                className={`block p-3 rounded ${pathname === '/admin' ? 'bg-white/20 border-l-4 border-[#FF4F1F]' : 'hover:bg-white/10'}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/submissions" 
                className={`block p-3 rounded ${pathname === '/admin/submissions' ? 'bg-white/20 border-l-4 border-[#FF4F1F]' : 'hover:bg-white/10'}`}
              >
                Submissions
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/reports" 
                className={`block p-3 rounded ${pathname === '/admin/reports' ? 'bg-white/20 border-l-4 border-[#FF4F1F]' : 'hover:bg-white/10'}`}
              >
                Reports
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className={`block p-3 rounded ${pathname === '/admin/settings' ? 'bg-white/20 border-l-4 border-[#FF4F1F]' : 'hover:bg-white/10'}`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>

        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
