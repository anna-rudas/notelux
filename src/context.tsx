import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import {
  defaultInfoMsg,
  defaultTheme,
  notesColKey,
  usersColKey,
} from "./constants";
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
import { db } from "./firestoreConfig";
import { FirebaseError } from "firebase/app";
import { InfoMsg, Note, User } from "./types";

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
  setActiveNote: (value: Note | null) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isEditing: boolean;
  resetDefault: () => void;
  handleEdit: (id: Note) => void;
  loadNotesFromDb: () => Promise<void>;
  addNoteInDb: (value: Note) => Promise<void>;
  updateNoteInDb: (value: Note) => Promise<void>;
  deleteNoteInDb: (value: Note) => Promise<void>;
  loadUserFromDb: (value: string) => Promise<void>;
  addUserInDb: (value: User) => Promise<void>;
  updateUserInDb: (value: User) => Promise<void>;
  deleteUserInDb: (value: User) => Promise<void>;
  setActiveNoteValue: (field: string, value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isPageLoading: boolean;
  setIsPageLoading: (value: boolean) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement> | null;
  dropdownButtonRef: RefObject<HTMLButtonElement> | null;
  infoMessage: InfoMsg;
  setInfoMessage: (value: InfoMsg) => void;
  error: Error | null;
  setError: (value: Error | null) => void;
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
  addUserInDb: async () => {},
  updateUserInDb: async () => {},
  deleteUserInDb: async () => {},
  setActiveNoteValue: () => {},
  isLoading: true,
  setIsLoading: () => {},
  isPageLoading: true,
  setIsPageLoading: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  dropdownRef: null,
  dropdownButtonRef: null,
  infoMessage: defaultInfoMsg,
  setInfoMessage: () => {},
  error: null,
  setError: () => {},
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
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [infoMessage, setInfoMessage] = useState<InfoMsg>(defaultInfoMsg);
  const [error, setError] = useState<Error | null>(null);

  //collection refs
  const notesColRef = collection(db, notesColKey);
  const usersColRef = collection(db, usersColKey);

  //users

  const loadUserFromDb = async (userId: string): Promise<void> => {
    const q = query(usersColRef, where("id", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      const resolvedUser: User[] = [];
      if (querySnapshot.docs.length === 0) {
        setError(new Error("Failed to load user from database"));
      } else {
        querySnapshot.docs.map((doc) =>
          resolvedUser.push({
            ...doc.data(),
            id: doc.id,
            email: doc.data().email,
            username: doc.data().username,
          })
        );
        if (!Object.hasOwn(resolvedUser[0], "theme")) {
          setUser({ ...resolvedUser[0], theme: defaultTheme });
        } else setUser(resolvedUser[0]);
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to load user: ", error.code);
      }
    }
  };

  const addUserInDb = async (userToAdd: User): Promise<void> => {
    try {
      await setDoc(doc(db, usersColKey, userToAdd.id), userToAdd);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to add user: ", error.code);
      }
    }
  };

  const updateUserInDb = async (userToUpdate: User): Promise<void> => {
    const userRef = doc(db, usersColKey, userToUpdate.id);
    try {
      await updateDoc(userRef, userToUpdate);
      setInfoMessage({
        ...infoMessage,
        isPersisting: false,
        isError: false,
        desc: "User updated successfully",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to update user: ", error.code);
        setInfoMessage({
          ...infoMessage,
          isPersisting: false,
          isError: true,
          desc: "User update failed",
        });
      }
    }
  };

  const deleteUserInDb = async (userToDelete: User): Promise<void> => {
    const userRef = doc(db, usersColKey, userToDelete.id);
    try {
      await deleteDoc(userRef);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to delete user: ", error.code);
      }
    }
  };

  //notes

  const loadNotesFromDb = async (): Promise<void> => {
    if (user) {
      const q = query(notesColRef, where("userId", "==", user.id));
      try {
        const querySnapshot = await getDocs(q);
        const resolvedNotes: Note[] = [];
        querySnapshot.docs.map((doc) => {
          resolvedNotes.push({
            id: doc.id,
            title: doc.data().title,
            color: doc.data().color,
            body: doc.data().body,
            date: doc.data().date,
            userId: doc.data().userId,
          });
        });
        setNotes(resolvedNotes);
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to load notes: ", error.code);
          setInfoMessage({
            isPersisting: true,
            showMsg: true,
            isError: true,
            desc: "Failed to load notes",
          });
        }
      }
    }
  };

  const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
    try {
      await setDoc(doc(db, notesColKey, noteToAdd.id), noteToAdd);
      setInfoMessage({
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Note added",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to add note: ", error.code);
        setInfoMessage({
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: "Failed to add note",
        });
      }
    }
  };

  const updateNoteInDb = async (noteToUpdate: Note): Promise<void> => {
    const noteRef = doc(db, notesColKey, noteToUpdate.id);
    try {
      await updateDoc(noteRef, noteToUpdate);
      setInfoMessage({
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Note updated",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to update note: ", error.code);
        setInfoMessage({
          showMsg: true,
          isPersisting: false,
          isError: true,
          desc: "Failed to update note",
        });
      }
    }
  };

  const deleteNoteInDb = async (noteToDelete: Note): Promise<void> => {
    const noteRef = doc(db, notesColKey, noteToDelete.id);
    try {
      await deleteDoc(noteRef);
      setInfoMessage({
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Note deleted successfully",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setInfoMessage({
          isPersisting: false,
          showMsg: true,
          isError: true,
          desc: "Failed to delete note",
        });
      }
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

  useEffect(() => {
    if (infoMessage.showMsg && !infoMessage.isPersisting) {
      setTimeout(() => {
        setInfoMessage({
          ...infoMessage,
          showMsg: false,
        });
      }, 5000);
    }
  }, [infoMessage]);

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
        addUserInDb,
        updateUserInDb,
        deleteUserInDb,
        user,
        setUser,
        activeNote,
        setActiveNote,
        setActiveNoteValue,
        resetDefault,
        handleEdit,
        isLoading,
        setIsLoading,
        isPageLoading,
        setIsPageLoading,
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        dropdownButtonRef,
        infoMessage,
        setInfoMessage,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
