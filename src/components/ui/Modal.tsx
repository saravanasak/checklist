"use client";

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium'
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Define size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use createPortal to render the modal at the end of the document body
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOutsideClick}>
      <div className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]}`} ref={modalRef}>
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-[#0F1941]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
