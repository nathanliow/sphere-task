import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import TosModal from '@/components/TosModal';
import Kyc from '@/components/Kyc'
import "@/app/globals.css";
import { getAuth } from 'firebase/auth';
import { getAcceptedTos, updateTos } from '@/firebase';
import { useRouter } from 'next/router';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAcceptedTos = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && user.email) {
        const acceptedTos = await getAcceptedTos(user.email);
        if (!acceptedTos) {
          setIsModalOpen(true);
        } else {
          setIsModalOpen(false);
        }
      } else {
        router.push("/login");
      }

      setLoading(false);
    };

    checkAcceptedTos();
  }, []);
  
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleAcceptTerms = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.email) {
      await updateTos(user.email);
      setIsModalOpen(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6">
      <Navbar/>
      <TosModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptTerms}
      />

      <div className="flex justify-center w-3/4">
        <Kyc/>
      </div>
    </main>
  );
}
