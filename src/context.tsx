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
  notesColKey,
  usersColKey,
  themeKey,
  defaultTheme,
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
  activeNoteCollaborators: string[] | null;
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
  setCollaborators: (owner: string, coOwners: string[]) => Promise<void>;
  getUserIdByEmail: (value: string) => Promise<string>;
  getNoUserTheme: () => void;
  noUserTheme: string;
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
  activeNoteCollaborators: null,
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
  setCollaborators: async () => {},
  getUserIdByEmail: async () => "",
  getNoUserTheme: () => {},
  noUserTheme: defaultTheme,
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
  const [activeNoteCollaborators, setActiveNoteCollaborators] = useState<
    string[] | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [infoMessage, setInfoMessage] = useState<InfoMsg>(defaultInfoMsg);
  const [error, setError] = useState<Error | null>(null);
  const [msgTimeoutId, setMsgTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [noUserTheme, setNoUserTheme] = useState(defaultTheme);

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
            id: doc.id,
            email: doc.data().email,
            theme: doc.data().theme,
            username: doc.data().username,
          })
        );
        setUser(resolvedUser[0]);
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

  const getUserEmailById = async (userId: string): Promise<string> => {
    const q = query(usersColRef, where("id", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      const resolvedUser: User[] = [];
      querySnapshot.docs.map((doc) => {
        resolvedUser.push({
          id: doc.id,
          email: doc.data().email,
          theme: doc.data().theme,
          username: doc.data().username,
        });
      });
      return resolvedUser[0].email;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to load user by email: ", error.code);
      }
      return "";
    }
  };

  const getUserIdByEmail = async (userEmail: string): Promise<string> => {
    const q = query(usersColRef, where("email", "==", userEmail));
    try {
      const querySnapshot = await getDocs(q);
      const resolvedUser: User[] = [];
      if (querySnapshot.docs.length === 0) {
        setInfoMessage({
          showMsg: true,
          isPersisting: false,
          isError: true,
          desc: "No user with this email address",
        });
      }
      querySnapshot.docs.map((doc) => {
        resolvedUser.push({
          id: doc.id,
          email: doc.data().email,
          theme: doc.data().theme,
          username: doc.data().username,
        });
      });
      return resolvedUser[0].id;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to load user by email: ", error.code);
      }
      return "";
    }
  };

  const setCollaborators = async (
    ownerId: string,
    coUserIds: string[]
  ): Promise<void> => {
    const ownerEmail = await getUserEmailById(ownerId);
    const collaborators = await Promise.all(
      coUserIds.map(async (currentUserId) => {
        const temp = await getUserEmailById(currentUserId);
        return temp;
      })
    );
    const temp = collaborators.map((curr) => {
      if (curr === ownerEmail) {
        return `${ownerEmail} (owner)`;
      }
      return curr;
    });
    setActiveNoteCollaborators(temp);
  };

  //notes

  const loadNotesFromDb = async (): Promise<void> => {
    if (user) {
      const q = query(notesColRef, where("coUsers", "array-contains", user.id));
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
            coUsers: doc.data().coUsers,
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

  const getNoUserTheme = () => {
    const theme = JSON.parse(localStorage.getItem(themeKey) || "{}");
    if (Object.keys(theme).length === 0) {
      setNoUserTheme(defaultTheme);
    } else setNoUserTheme(theme);
  };

  const saveNoUserTheme = (user: User) => {
    localStorage.setItem(themeKey, JSON.stringify(user.theme));
    setNoUserTheme(user.theme);
  };

  const handleEdit = (note: Note) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    setActiveNote(note);
    setCollaborators(note.userId, note.coUsers);
  };

  const resetDefault = () => {
    setActiveNoteCollaborators(null);
    setActiveNote(null);
    setIsAddNoteOpen(false);
    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (user) {
      updateUserInDb(user);
      saveNoUserTheme(user);
    }
  }, [user]);

  useEffect(() => {
    if (msgTimeoutId) {
      clearTimeout(msgTimeoutId);
    }
    if (infoMessage.showMsg && !infoMessage.isPersisting) {
      const timeoutId = setTimeout(() => {
        setInfoMessage({
          ...infoMessage,
          showMsg: false,
        });
      }, 5000);
      setMsgTimeoutId(timeoutId);
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
        deleteUserInDb,
        user,
        setUser,
        activeNote,
        setActiveNote,
        activeNoteCollaborators,
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
        setCollaborators,
        getUserIdByEmail,
        getNoUserTheme,
        noUserTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
