import Image from "next/image";
import SphereLogo from "../../public/sphere-logo.svg";
import Link from "next/link";
import Button from "@/components/Button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white w-full p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
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
          </div>

          <div className="flex ml-6 gap-10">
              <Link href="/" className="text-black hover:text-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/customers" className="text-black hover:text-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Customers
              </Link>
              <Link href="/company" className="text-black hover:text-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Company
              </Link>
              <Link href="/developers" className="text-black hover:text-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200">
                Developers
              </Link>
            </div>


          <div className="flex ml-6 items-center">
            <Button variant="primary" onClick={() => alert('Navigating to Dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
