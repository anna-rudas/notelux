import {
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { User } from "../types/types";
import { db } from "./firestoreConfig";
import { notesColKey, usersColKey } from "../data/constants";

const notesColRef = collection(db, notesColKey);
const usersColRef = collection(db, usersColKey);

export const addUserInDb = async (userToAdd: User): Promise<void> => {
  const userRef = doc(db, usersColKey, userToAdd.id);
  const docSnapshot = await getDoc(userRef);

  if (!docSnapshot.exists()) {
    await setDoc(userRef, userToAdd);
    return;
  }
  throw "user already exists";
};

export const updateUserInDb = async (userToUpdate: User): Promise<void> => {
  const userRef = doc(db, usersColKey, userToUpdate.id);
  await updateDoc(userRef, userToUpdate);
};

export const deleteUserDataInDb = async (userId: string): Promise<void> => {
  const userRef = doc(db, usersColKey, userId);

  //delete user document
  await deleteDoc(userRef);

  //delete notes
  const q = query(notesColRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length !== 0) {
    querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
};

export const getUserEmailFromId = async (userId: string): Promise<string> => {
  const q = query(usersColRef, where("id", "==", userId));
  const querySnapshot = await getDocs(q);
  const resolvedUser: User[] = [];
  if (querySnapshot.docs.length === 0) {
    return "";
  }
  querySnapshot.docs.forEach((doc) => {
    resolvedUser.push({
      id: doc.id,
      email: doc.data().email,
      theme: doc.data().theme,
      username: doc.data().username,
      layout: doc.data().layout,
    });
  });
  return resolvedUser[0].email;
};

export const getUserIdFromEmail = async (
  userEmail: string
): Promise<string> => {
  const q = query(usersColRef, where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);
  const resolvedUser: User[] = [];
  if (querySnapshot.docs.length === 0) {
    return "";
  }
  querySnapshot.docs.forEach((doc) => {
    resolvedUser.push({
      id: doc.id,
      email: doc.data().email,
      theme: doc.data().theme,
      username: doc.data().username,
      layout: doc.data().layout,
    });
  });
  return resolvedUser[0].id;
};
