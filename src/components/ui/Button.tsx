import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  className = ''
}: ButtonProps) {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-[#FF4F1F] hover:bg-[#e63900] text-white',
    secondary: 'bg-[#0F1941] hover:bg-[#1a2456] text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-transparent border border-[#FF4F1F] text-[#FF4F1F] hover:bg-[#FF4F1F] hover:text-white'
  };

  // Define size styles
  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg'
  };

  // Combine all styles
  const buttonStyles = [
    'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4F1F] transition-colors',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
