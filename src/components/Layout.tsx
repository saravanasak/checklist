import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Genesys Logo"
              width={180}
              height={40}
              priority
            />
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-bold text-[#0F1941]">{title}</h1>}
            {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
          </div>
        )}
        
        {children}
      </main>
      
      <footer className="bg-[#0F1941] text-white py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Genesys. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
