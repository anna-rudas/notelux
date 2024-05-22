import React, { useState, createContext, ReactNode, useEffect } from "react";
import { defaultTheme, notesColKey, usersColKey } from "./constants";
import {
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firestore";

interface AppContextInterface {
  search: string;
  setSearch: (value: string) => void;
  isGrid: boolean;
  setIsGrid: (value: boolean) => void;
  isAddNoteOpen: boolean;
  setIsAddNoteOpen: (value: boolean) => void;
  notes: Array<Note>;
  setNotes: (value: Array<Note>) => void;
  activeNote: Note | null;
  setActiveNote: (value: Note) => void;
  user: User | null;
  setUser: (value: User) => void;
  isEditing: boolean;
  resetDefault: () => void;
  handleEdit: (id: Note) => void;
  loadNotesFromDb: () => Promise<void>;
  addNoteInDb: (value: Note) => Promise<void>;
  updateNoteInDb: (value: Note) => Promise<void>;
  deleteNoteInDb: (value: Note) => Promise<void>;
  loadUserFromDb: () => Promise<void>;
  updateUserInDb: (value: User) => Promise<void>;
  setActiveNoteValue: (field: string, value: string) => void;
}

const defaultContextValue: AppContextInterface = {
  search: "",
  setSearch: () => {},
  isGrid: true,
  setIsGrid: () => {},
  isAddNoteOpen: false,
  setIsAddNoteOpen: () => {},
  notes: [],
  setNotes: () => {},
  activeNote: null,
  setActiveNote: () => {},
  user: null,
  setUser: async () => {},
  isEditing: false,
  resetDefault: () => {},
  handleEdit: () => {},
  loadNotesFromDb: async () => {},
  addNoteInDb: async () => {},
  updateNoteInDb: async () => {},
  deleteNoteInDb: async () => {},
  loadUserFromDb: async () => {},
  updateUserInDb: async () => {},
  setActiveNoteValue: () => {},
};

export const AppContext =
  createContext<AppContextInterface>(defaultContextValue);

type AppContextProviderProps = {
  children?: ReactNode;
};

function AppContextProvider({ children }: AppContextProviderProps) {
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(true);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  //collection refs
  const notesColRef = collection(db, notesColKey);
  const usersColRef = collection(db, usersColKey);

  //users

  const loadUserFromDb = async (): Promise<void> => {
    const q = query(usersColRef, where("name", "==", "John Smith"));
    const querySnapshot = await getDocs(q);
    const resolvedUser: User[] = [];
    querySnapshot.docs.map((doc) =>
      resolvedUser.push({
        ...doc.data(),
        id: doc.id,
        userId: doc.data().userId,
      })
    );
    if (!Object.hasOwn(resolvedUser[0], "theme")) {
      setUser({ ...resolvedUser[0], theme: defaultTheme });
    } else setUser(resolvedUser[0]);
  };

  const addUserInDb = async (userToAdd: User): Promise<void> => {
    try {
      await addDoc(usersColRef, userToAdd);
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserInDb = async (userToUpdate: User): Promise<void> => {
    const userRef = doc(db, usersColKey, userToUpdate.id);
    try {
      await updateDoc(userRef, userToUpdate);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUserInDb = async (userToDelete: User): Promise<void> => {
    const userRef = doc(db, usersColKey, userToDelete.id);
    try {
      await deleteDoc(userRef);
    } catch (err) {
      console.error(err);
    }
  };

  //notes

  const loadNotesFromDb = async (): Promise<void> => {
    const querySnapshot = await getDocs(notesColRef);
    const resolvedNotes: Note[] = [];
    querySnapshot.docs.map((doc) => {
      resolvedNotes.push({
        id: doc.id,
        title: doc.data().title,
        color: doc.data().color,
        body: doc.data().body,
        date: doc.data().date,
      });
    });
    setNotes(resolvedNotes);
  };

  const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
    try {
      await addDoc(notesColRef, noteToAdd);
    } catch (err) {
      console.error(err);
    }
  };

  const updateNoteInDb = async (noteToUpdate: Note): Promise<void> => {
    const noteRef = doc(db, notesColKey, noteToUpdate.id);
    try {
      await updateDoc(noteRef, noteToUpdate);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNoteInDb = async (noteToDelete: Note): Promise<void> => {
    const noteRef = doc(db, notesColKey, noteToDelete.id);
    try {
      await deleteDoc(noteRef);
    } catch (err) {
      console.error(err);
    }
  };

  const setActiveNoteValue = (field: string, value: string) => {
    if (activeNote) {
      setActiveNote({
        ...activeNote,
        [field]: value,
      });
    }
  };

  const handleEdit = (note: Note) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    setActiveNote(note);
  };

  const resetDefault = () => {
    setActiveNote(null);
    setIsAddNoteOpen(false);
    setIsEditing(false);
  };

  useEffect(() => {
    if (user) {
      updateUserInDb(user);
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        search,
        setSearch,
        isGrid,
        setIsGrid,
        isAddNoteOpen,
        setIsAddNoteOpen,
        notes,
        setNotes,
        isEditing,
        loadNotesFromDb,
        addNoteInDb,
        updateNoteInDb,
        deleteNoteInDb,
        loadUserFromDb,
        updateUserInDb,
        user,
        setUser,
        activeNote,
        setActiveNote,
        setActiveNoteValue,
        resetDefault,
        handleEdit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
