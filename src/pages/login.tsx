import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Sphere from "../../public/sphere.svg";
import Google from "../../public/Google.svg";
import "../app/globals.css";
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, createUser } from "../firebase";
import { useRouter } from "next/router";

const provider = new GoogleAuthProvider();

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    const handleSignInEmailPassword = async (e: any) => {
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        router.push("/");
      } catch (error: any) {
        setError("Invalid email or password");
        return;
      }
    };

    const handleSignInGoogle = async (e: any) => {
      e.preventDefault();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(userCredential);
        if (!credential) {
          setError("No Google user credential");
          return;
        }
        const token = credential.accessToken;
        const user = userCredential.user;

        if (user && user.email) {
          await createUser(user.email)
        }
        
      } catch (error: any) {
        setError(error.message);
        return;
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
          <h1 className="text-2xl text-black font-bold mb-4">Login to your account</h1>
            <form onSubmit={handleSignInEmailPassword}>
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

              {error && <p className="text-red text-sm mt-2">{error}</p>}
              
              <div className="mt-6">
                <Button variant="secondary" onClick={handleSignInEmailPassword}>
                  Login
                </Button>
              </div>
            </form>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-gray"></div>
            <span className="flex-shrink mx-2 text-xs text-black">OR</span>
            <div className="flex-grow border-t border-gray"></div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="google" onClick={handleSignInGoogle}>
              Sign in with Google
              <Image
                src={Google}
                alt="Sphere Logo"
                className=""
                width={24}
                height={24}
                priority
              />
            </Button>
          </div>

          <div className="flex items-center justify-center mt-2">
            <a className="flex-shrink mx-2 text-xs text-blue" href='/signup'>Don't have an account?</a>
          </div>

        </div>
        
      </main>
      )
  }