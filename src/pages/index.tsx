import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import Modal from '@/components/Modal';
import Kyc from '@/components/Kyc'
import "@/app/globals.css";
import { getAuth } from 'firebase/auth';
import { getAcceptedTos, updateTos } from '@/firebase';
import { useRouter } from 'next/router';
import { launchWebSdk } from '@/sumsubSdk';

export default function Home() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const response = await fetch('/api/getAccessToken', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user?.email }), 
      });

        const data = await response.json();
        setAccessToken(data.token);
      } else {
        router.push("/login");
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
        launchWebSdk(accessToken);
    }
  }, [accessToken]);

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
      <Modal
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
