import React from 'react';

type ButtonVariant = 'submit' | 'cancel' | 'info';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

const getButtonStyle = (variant: ButtonVariant) => {
  switch (variant) {
    case 'submit':
      return 'bg-amber-900 hover:bg-amber-700 text-white';
    case 'cancel':
      return 'bg-red-600 hover:bg-red-500 text-white';
    case 'info':
      return 'bg-blue-500 hover:bg-blue-400 text-white';
    default:
      return '';
  }
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'submit',
  className = '',
  disabled = false,
}) => {
  const variantClasses = getButtonStyle(variant);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full py-2 rounded-lg transition-colors duration-200 
        ${variantClasses} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
