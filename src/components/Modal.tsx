import React from 'react';
import Button from './Button';
import { updateTos } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { terms } from '@/components/Terms';
import { useRouter } from 'next/router';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;
  const router = useRouter();

  const handleDeny = async () => {
    router.push("/login");
  };

  const handleAccept = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) {
      const success = await updateTos(user.email);
      if (success) {
        onAccept();
      } else {
        console.error("Failed to update user.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white flex flex-col rounded-lg w-3/4 h-3/4 max-w-3xl p-6">
        <h2 className="text-xl font-bold mb-4">Accept Terms of Service</h2>
        <div className="h-full overflow-y-auto border border-dark-gray rounded-md p-4 mb-4">
          <div dangerouslySetInnerHTML={{ __html: terms }} />
        </div>
        <div className="flex justify-center gap-12">
          <Button variant="tertiary" onClick={handleDeny}>
              Deny
          </Button>
          <Button variant="primary" onClick={handleAccept}>
              Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
