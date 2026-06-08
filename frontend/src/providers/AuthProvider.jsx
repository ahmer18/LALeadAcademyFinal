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
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("lalead_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isUserLoading, setIsUserLoading] = useState(() => !user);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("lalead_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("lalead_user");
    }
  }, [user]);

  const fetchMongoUser = async (email) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/${email}`
      );
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);

        // Pre-populate with Firebase details if cache is empty or doesn't match
        setUser((prevUser) => {
          if (prevUser && prevUser.email === currentUser.email) {
            return prevUser;
          }
          return {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: "student",
          };
        });

        // Background sync MongoDB profile details
        fetchMongoUser(currentUser.email)
          .then((dbUser) => {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || dbUser?.displayName || dbUser?.name,
              photoURL: currentUser.photoURL || dbUser?.photoURL,
              role: dbUser?.role || "student",
              ...dbUser,
            });
            setIsUserLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch Mongo user in background:", error);
            setIsUserLoading(false);
          });
      } else {
        setFirebaseUser(null);
        setUser(null);
        setIsUserLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

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
