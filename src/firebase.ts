import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export async function userExists(email: string) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return false;
    }

    return true;
}

export async function createUser(email: string) {
    try {
        const userData = {
            email: email,
            acceptedTos: false,
        }

        await addDoc(collection(firestore, 'users'), userData);

        return true;
        
    } catch (error) {
        return false;
    }
}

export async function getAcceptedTos(email: string) {
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // No user found with the given email
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        return userDoc.data().acceptedTos;
        
    } catch (error) {
        return false;
    }
}

export async function updateTos(email: string) {
    try {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // No user found with the given email
            return false;
        }

        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(firestore, 'users', userDoc.id);
        
        await updateDoc(userDocRef, {
            acceptedTos: true,
        });

        return true;
        
    } catch (error) {
        return false;
    }
}

export { auth, firestore };
