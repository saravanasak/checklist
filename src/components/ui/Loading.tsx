import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export default function Loading({ message = 'Loading...', size = 'medium', fullScreen = false }: LoadingProps) {
  // Define spinner size based on the size prop
  const spinnerSizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const spinnerSize = spinnerSizes[size];
  
  // Container classes based on fullScreen prop
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50' 
    : 'flex flex-col items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full border-t-2 border-b-2 border-[#FF4F1F] ${spinnerSize}"></div>
        {message && <p className="mt-2 text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
