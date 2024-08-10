import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'error', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(onClose, 500); 
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg text-white text-center z-50
      ${type === 'error' ? 'bg-red' : 'bg-green'}
      ${isVisible ? 'opacity-100' : 'opacity-0'}
      transition-opacity duration-500 ease-in-out`} 
    >
      {message}
    </div>
  );
};

export default Toast;
