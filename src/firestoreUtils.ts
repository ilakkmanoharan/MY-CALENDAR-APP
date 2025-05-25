// firestoreUtils.ts



import { db } from './firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Saves an entry under the 'entries/{uid}/data' path.
 * Automatically creates the path and adds a `type` to the entry.
 */
export const saveEntryToUserEntries = async (
  entry: Record<string, any>
): Promise<void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const uid = user.uid;

    // Ensure the user profile exists
    const userProfileRef = doc(db, 'userProfile', uid);
    await setDoc(userProfileRef, { createdAt: serverTimestamp() }, { merge: true });

    const entryType = entry.type ?? 'general';
    const entriesDataRef = collection(db, 'entries', uid, 'data');

    await addDoc(entriesDataRef, {
      ...entry,
      type: entryType,
      createdAt: serverTimestamp()
    });

    console.log(`Entry of type '${entryType}' saved under entries/${uid}/data`);
  } catch (error) {
    console.error('Error saving entry:', error);
  }
};

/**
 * General-purpose function to save an entry under any collection
 * like 'appointments/{uid}/data' or 'goals/{uid}/data'.
 */
export const saveUserScopedEntry = async (
  collectionName: string,
  data: Record<string, any>
): Promise<void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const uid = user.uid;

    // Ensure the user profile exists
    const userProfileRef = doc(db, 'userProfile', uid);
    await setDoc(userProfileRef, { createdAt: serverTimestamp() }, { merge: true });

    const entryType = data.type ?? 'general';
    const dataRef = collection(db, collectionName, uid, 'data');

    await addDoc(dataRef, {
      ...data,
      type: entryType,
      createdAt: serverTimestamp()
    });

    console.log(`Entry of type '${entryType}' saved under ${collectionName}/${uid}/data`);
  } catch (error) {
    console.error(`Error saving entry to ${collectionName}:`, error);
  }
};

/**
 * Fetches all appointment entries for the current user,
 * ordered by createdAt in descending order.
 */
export const fetchUserAppointments = async (): Promise<any[] | void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const uid = user.uid;
    const appointmentsRef = collection(db, 'appointments', uid, 'data');

    // Optional: order results by timestamp
    const q = query(appointmentsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Fetched appointments:', appointments);
    return appointments;

  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


/**
 * Fetches entries from a user-scoped collection like:
 * - appointments/{uid}/data
 * - entries/{uid}/data
 * - goals/{uid}/data
 *
 * @param collectionName Top-level collection name (e.g., 'appointments')
 * @returns Array of entries or undefined
 */
export const fetchUserScopedEntries = async (
  collectionName: string
): Promise<any[] | void> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const uid = user.uid;
    const dataRef = collection(db, collectionName, uid, 'data');

    const q = query(dataRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Fetched ${entries.length} entries from ${collectionName}/${uid}/data`);
    return entries;
  } catch (error) {
    console.error(`Error fetching entries from ${collectionName}:`, error);
  }
};





