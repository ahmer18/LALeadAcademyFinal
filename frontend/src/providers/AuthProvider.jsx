import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, provider } from "../../firebase.config";
 
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const dbUser = await fetchMongoUser(currentUser.email);
          setUser({ uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName || dbUser?.displayName || dbUser?.name,
    photoURL: currentUser.photoURL || dbUser?.photoURL,
    role: dbUser?.role || "student", // Get role from DB, default to student
    ...dbUser, });
        } catch (error) {
          console.error("Failed to fetch Mongo user:", error);
          setUser(currentUser);
        } finally {
          setIsUserLoading(false);
        }
      } else {
        setUser(null);
        setIsUserLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchMongoUser = async (email) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${email}`
    );
    return res.data;
  } catch (error) {
    // If it's a 404, just return null instead of throwing an error
    if (error.response && error.response.status === 404) {
      return null; 
    }
    throw error; // Rethrow other actual errors (like server down)
  }
};

  const userSignup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  const updateUserProfile = (name, photoURL) => {
  // auth.currentUser is the "Internal" user instance Firebase needs
  if (!auth.currentUser) return Promise.reject("No user logged in");
  
  return updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL,
  });
};

  const userLogout = () => {
    return signOut(auth);
  };

  const authInfo = {
    user,
    setUser,
    firebaseUser,
    isUserLoading,
    userSignup,
    userLogin,
    userLogout,
    loginWithGoogle,
    updateUserProfile,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export { AuthContext, AuthProvider };
