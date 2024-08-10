import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronRight } from 'react-icons/fa';
import { IoIosMenu } from "react-icons/io";
import Button from "@/components/Button";
import SphereLogo from "../../public/sphere-logo.svg";

const Navbar: React.FC = () => {
  const MD_PIXELS = 768;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MD_PIXELS) {
        setIsOpen(false); 
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="bg-white w-full p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={SphereLogo}
              alt="Sphere Logo"
              width={102}
              height={24}
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex ml-6 gap-10">
          <Link href="/" className="text-black hover:text-blue text-sm font-medium">
            Home
          </Link>
          <Link href="/customers" className="text-black hover:text-blue text-sm font-medium">
            Customers
          </Link>
          <Link href="/company" className="text-black hover:text-blue text-sm font-medium">
            Company
          </Link>
          <Link href="/developers" className="text-black hover:text-blue text-sm font-medium">
            Developers
          </Link>
        </div>

        <div className="flex items-center md:hidden z-30">
          <button onClick={toggleDrawer} className="text-black focus:outline-none">
            {isOpen ? <FaChevronRight className="w-6 h-6" /> : <IoIosMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dashboard Button for Desktop */}
        <div className="hidden md:flex items-center">
          <Button variant="primary" onClick={() => alert('Navigating to Dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="md:hidden absolute top-0 right-0 z-50 w-3/5 h-full bg-white">
            <div className="flex flex-col items-center px-2 pt-20 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block text-black hover:text-blue px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link href="/customers" className="block text-black hover:text-blue px-3 py-2 rounded-md text-base font-medium">
                Customers
              </Link>
              <Link href="/company" className="block text-black hover:text-blue px-3 py-2 rounded-md text-base font-medium">
                Company
              </Link>
              <Link href="/developers" className="block text-black hover:text-blue px-3 py-2 rounded-md text-base font-medium">
                Developers
              </Link>
              <Button variant="primary" onClick={() => alert('Navigating to Dashboard')}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
