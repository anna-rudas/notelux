import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import { defaultTheme, notesColKey, usersColKey } from "./constants";
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
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isPageLoading: boolean;
  setIsPageLoading: (value: boolean) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement> | null;
  dropdownButtonRef: RefObject<HTMLButtonElement> | null;
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
  email: "",
  setEmail: () => {},
  password: "",
  setPassword: () => {},
  isLoading: true,
  setIsLoading: () => {},
  isPageLoading: true,
  setIsPageLoading: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  dropdownRef: null,
  dropdownButtonRef: null,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  //collection refs
  const notesColRef = collection(db, notesColKey);
  const usersColRef = collection(db, usersColKey);

  //users

  const loadUserFromDb = async (userId: string): Promise<void> => {
    const q = query(usersColRef, where("id", "==", userId));
    const querySnapshot = await getDocs(q);
    const resolvedUser: User[] = [];
    querySnapshot.docs.map((doc) =>
      resolvedUser.push({
        ...doc.data(),
        id: doc.id,
        email: doc.data().email,
      })
    );
    if (!Object.hasOwn(resolvedUser[0], "theme")) {
      setUser({ ...resolvedUser[0], theme: defaultTheme });
    } else setUser(resolvedUser[0]);
  };

  const addUserInDb = async (userToAdd: User): Promise<void> => {
    try {
      await setDoc(doc(db, usersColKey, userToAdd.id), userToAdd);
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
    if (user) {
      const q = query(notesColRef, where("userId", "==", user.id));
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
    }
  };

  const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
    try {
      await setDoc(doc(db, notesColKey, noteToAdd.id), noteToAdd);
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
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        setIsLoading,
        isPageLoading,
        setIsPageLoading,
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        dropdownButtonRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
