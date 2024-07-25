import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Sphere from "../../public/sphere.svg";
import Google from "../../public/Google.svg";
import "../app/globals.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e: any) => {
      e.preventDefault();
      try {
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }

        if (password != confirmPassword) {
          setError("Passwords don't match");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      } catch (error: any) {
        setError(error.message);
      }
    };

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
        <div className="flex flex-col w-full max-w-xs justify-center gap-2 mt-6">  
          <div>
          <h1 className="text-2xl text-black font-bold mb-4">Create an account</h1>
            <form onSubmit={handleSignUp}>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray rounded-[10px] shadow-sm focus:outline-none focus:ring-blue focus:border-blue hover:border-dark-gray text-sm transition-colors duration-200"
                required
              />
              
              <label htmlFor="password" className="block text-sm font-medium text-black mt-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray rounded-[10px] shadow-sm focus:outline-none focus:ring-blue focus:border-blue hover:border-dark-gray text-sm transition-colors duration-200"
                required
              />

              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mt-4">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray rounded-[10px] shadow-sm focus:outline-none focus:ring-blue focus:border-blue hover:border-dark-gray text-sm transition-colors duration-200"
                required
              />

              {error && <p className="text-red text-sm mt-2">{error}</p>}
              
              <div className="mt-6">
                <Button variant="secondary" onClick={() => handleSignUp}>
                  Create account
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center mt-2">
            <a className="flex-shrink mx-2 text-xs text-blue" href='/login'>Already have an account?</a>
          </div>

        </div>
        
      </main>
      )
  }