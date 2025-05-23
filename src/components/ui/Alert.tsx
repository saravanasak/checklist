import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  // Define styles based on alert type
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className={`${styles[type]} border px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <span 
          className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
          onClick={onClose}
        >
          <svg 
            className="fill-current h-6 w-6" 
            role="button" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      )}
    </div>
  );
}
