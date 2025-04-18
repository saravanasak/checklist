import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
}

export default function Card({ children, title, subtitle, footer, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="p-6 border-b">
          {title && <h3 className="text-lg font-semibold text-[#0F1941]">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
}
