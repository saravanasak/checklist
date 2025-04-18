"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state (light/dark mode)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference if no saved theme
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Close menu on window resize (responsive design)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint in Tailwind
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <AppContext.Provider value={{ theme, toggleTheme, isMenuOpen, toggleMenu, closeMenu }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}
