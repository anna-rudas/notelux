import { updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Note } from "../types/types";
import { db } from "./firestoreConfig";
import { notesColKey } from "../data/constants";

export const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
  await setDoc(doc(db, notesColKey, noteToAdd.id), noteToAdd);
};

export const updateNoteInDb = async (noteToUpdate: Note): Promise<void> => {
  const noteRef = doc(db, notesColKey, noteToUpdate.id);
  await updateDoc(noteRef, noteToUpdate);
};

export const deleteNoteInDb = async (noteToDelete: Note): Promise<void> => {
  const noteRef = doc(db, notesColKey, noteToDelete.id);
  await deleteDoc(noteRef);
};
