"use client";

import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AppProvider>
  );
}
