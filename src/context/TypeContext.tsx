


import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebase';

// System-defined types (static, no IDs)
export const systemTypes = [
  { label: 'appointment', color: '#ffe0f0' },
  { label: 'note', color: '#e1f5fe' },
  { label: 'task', color: '#e8f5e9' },
  { label: 'income', color: '#f1f8e9' },
  { label: 'expense', color: '#fff8e1' },
  { label: 'savings', color: '#ede7f6' },
  { label: 'reminder', color: '#fce4ec' },
  { label: 'todo', color: '#f3e5f5' },
  { label: 'default', color: '#e3f2fd' },
];

export interface Type {
  id?: string; // Firestore doc ID for custom types, undefined for system types
  label: string;
  color: string;
  label_lower?: string; // For indexing/search
}

interface TypeContextType {
  types: Type[];
  addType: (newLabel: string, color?: string) => Promise<boolean>;
  deleteType: (id: string) => Promise<void>;
}

const TypeContext = createContext<TypeContextType | undefined>(undefined);

export const TypeContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [types, setTypes] = useState<Type[]>(systemTypes);

  // Store current user so we don’t query repeatedly inside add/delete
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    console.log("🔥 Firebase Auth State Changed. User:", user);

    setCurrentUser(user);

    if (!user) {
      console.log("👤 No user is logged in. Showing system types only.");
      setTypes(systemTypes);
      return;
    }

    try {
      console.log(`✅ Logged in as: ${user.uid}. Fetching custom types...`);

      const typesColRef = collection(db, 'userTypes', user.uid, 'types');
      const snapshot = await getDocs(typesColRef);

      const userTypes: Type[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Type, 'id'>),
      }));

      console.log("📦 Fetched user types:", userTypes);

      setTypes([...systemTypes, ...userTypes]);
    } catch (error) {
      console.error('❌ Error loading user types:', error);
      setTypes(systemTypes);
    }
  });

  return () => unsubscribeAuth();
}, []);


 

const addType = async (label: string, color: string = '#9c4dcc'): Promise<boolean> => {
  const trimmedLabel = label.trim().toLowerCase();
  const duplicate = types.some(
    (type) => type.label.toLowerCase() === trimmedLabel
  );

  if (!trimmedLabel || duplicate || types.filter(t => t.id).length >= 10) {
    return false;
  }

  if (!currentUser) {
    console.warn("⚠️ No authenticated user. Can't add type.");
    return false;
  }

  try {
    const newType = { label: trimmedLabel, color };
    const docRef = await addDoc(collection(db, 'userTypes', currentUser.uid, 'types'), newType);
    const added = { id: docRef.id, ...newType };
    setTypes([...types, added]); // Update state manually
    return true;
  } catch (error) {
    console.error('❌ Error adding type:', error);
    return false;
  }
};

  const deleteType = async (id: string): Promise<void> => {
    if (!currentUser) return;

    try {
      const docRef = doc(db, 'userTypes', currentUser.uid, 'types', id);
      await deleteDoc(docRef);

      setTypes((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting type:', error);
    }
  };

  return (
    <TypeContext.Provider value={{ types, addType, deleteType }}>
      {children}
    </TypeContext.Provider>
  );
};

export const useTypeContext = (): TypeContextType => {
  const context = useContext(TypeContext);
  if (!context) {
    throw new Error('useTypeContext must be used within a TypeContextProvider');
  }
  return context;
};






