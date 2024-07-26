import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Modal from './../components/Modal';
import "../app/globals.css";
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
      if (user) {
        const acceptedTos = await getAcceptedTos(user.uid);
        if (!acceptedTos) {
          setIsModalOpen(true);
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
    if (user) {
      await updateTos(user.uid);
      setIsModalOpen(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAccept={handleAcceptTerms}
      />
    </main>
  );
}
