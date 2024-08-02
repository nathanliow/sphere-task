import React from 'react';

type ButtonProps = {
  variant: 'primary' | 'secondary' | 'tertiary' | 'google' | 'inv-secondary';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  let className = '';

  switch (variant) {
    case 'primary':
      className = 'bg-gradient-to-r from-gradient-start-blue to-gradient-end-blue text-white py-2 px-4 rounded-[20px]';
      break;
    case 'secondary':
      className = 'w-full bg-blue text-white py-2 px-4 rounded-[10px] hover:bg-dark-blue transition-colors duration-200';
      break;
    case 'tertiary':
      className = 'bg-white text-black py-2 px-4 border-2 border-gray rounded-[20px]';
      break;
    case 'google':
      className = 'bg-white flex flex-horizontal justify-between w-full text-dark-gray text-sm text-bold py-2 px-4 border border-gray rounded-[10px] hover:bg-hover-white transition-colors duration-200';
      break;
    case 'inv-secondary':
      className = 'w-full bg-white text-blue border-2 border-blue py-2 px-4 rounded-[10px] hover:bg-hover-white transition-colors duration-200';
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
