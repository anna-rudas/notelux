import {
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { User } from "../types/types";
import { db } from "./firestoreConfig";
import { usersColKey } from "../data/constants";

const usersColRef = collection(db, usersColKey);

export const addUserInDb = async (userToAdd: User): Promise<void> => {
  await setDoc(doc(db, usersColKey, userToAdd.id), userToAdd);
};

export const updateUserInDb = async (userToUpdate: User): Promise<void> => {
  const userRef = doc(db, usersColKey, userToUpdate.id);
  await updateDoc(userRef, userToUpdate);
};

export const deleteUserDataInDb = async (userId: string): Promise<void> => {
  const userRef = doc(db, usersColKey, userId);

  //delete user document
  await deleteDoc(userRef);
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
