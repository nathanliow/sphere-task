import Image from "next/image";
import Button from "@/components/Button";
import Sphere from "../../public/sphere.svg";
import "../app/globals.css";

export default function Login() {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <Image
          src={Sphere}
          alt="Sphere Logo"
          className=""
          width={100}
          height={100}
          priority
        />
        <div className="p-4 w-full max-w-xs">
          <h1 className="text-2xl font-bold mb-4">Login to your account</h1>
          
          {/* Email: input field */}
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          
          {/* Password: input field */}
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 border border-gray rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          
          <div className="mt-6">
            <Button variant="secondary" onClick={() => alert('Secondary Button Clicked')}>
              Login
            </Button>
          </div>
        </div>
        
      </main>
      )
  }