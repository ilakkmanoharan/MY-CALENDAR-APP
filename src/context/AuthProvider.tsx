import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "../firebase"; // Adjust path to your firebase.ts
import {
  collection,
  getDocs,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

interface AppointmentData {
  id: string;
  [key: string]: any; // adjust based on your schema
}

interface AuthContextType {
  user: User | null;
  userData: AppointmentData[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: [],
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppointmentData[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const uid = user.uid;
          const userDataRef = collection(db, "appointments", uid, "data");
          const snapshot: QuerySnapshot<DocumentData> = await getDocs(
            userDataRef
          );
          const data: AppointmentData[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
