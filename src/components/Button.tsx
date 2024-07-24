import React from 'react';

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary';
  onClick: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  let className = '';

  switch (variant) {
    case 'primary':
      className = 'bg-gradient-to-r from-gradient-start-blue to-gradient-end-blue text-white py-2 px-4 rounded-[20px]';
      break;
    case 'secondary':
      className = 'w-full bg-blue text-white py-2 px-4 rounded-[10px]';
      break;
    case 'tertiary':
      className = 'bg-white text-black py-2 px-4 border-2 border-gray rounded-[20px]';
      break;
    default:
      className = 'bg-white text-black py-2 px-4 border-1 border-gray rounded-[20px]';
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
