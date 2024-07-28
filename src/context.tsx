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
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firestoreConfig";
import { FirebaseError } from "firebase/app";
import { InfoMsg, Note, User } from "./types";
import { evalErrorCode } from "./helpers";

interface AppContextInterface {
  search: string;
  setSearch: (value: string) => void;
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
  addNoteInDb: (value: Note) => Promise<void>;
  updateNoteInDb: (value: Note) => Promise<void>;
  deleteNoteInDb: (value: Note) => Promise<void>;
  addUserInDb: (value: User) => Promise<void>;
  deleteUserDataInDb: (value: string) => Promise<void>;
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
  areNotesLoading: boolean;
  userId: string | null;
  setUserId: (value: string | null) => void;
  isMoreNoteOptionsOpen: boolean;
  setIsMoreNoteOptionsOpen: (value: boolean) => void;
  moreNoteOptionsRef: RefObject<HTMLDivElement> | null;
  moreNoteOptionsButtonRef: RefObject<HTMLButtonElement> | null;
}

const defaultContextValue: AppContextInterface = {
  search: "",
  setSearch: () => {},
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
  addNoteInDb: async () => {},
  updateNoteInDb: async () => {},
  deleteNoteInDb: async () => {},
  addUserInDb: async () => {},
  deleteUserDataInDb: async () => {},
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
  areNotesLoading: true,
  userId: null,
  setUserId: async () => {},
  isMoreNoteOptionsOpen: false,
  setIsMoreNoteOptionsOpen: () => {},
  moreNoteOptionsRef: null,
  moreNoteOptionsButtonRef: null,
};

export const AppContext =
  createContext<AppContextInterface>(defaultContextValue);

type AppContextProviderProps = {
  children?: ReactNode;
};

function AppContextProvider({ children }: AppContextProviderProps) {
  const [search, setSearch] = useState("");
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
  const [areNotesLoading, setAreNotesLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isMoreNoteOptionsOpen, setIsMoreNoteOptionsOpen] = useState(false);
  const moreNoteOptionsRef = useRef(null);
  const moreNoteOptionsButtonRef = useRef(null);

  //collection refs
  const notesColRef = collection(db, notesColKey);
  const usersColRef = collection(db, usersColKey);

  //users

  const addUserInDb = async (userToAdd: User): Promise<void> => {
    const userRef = doc(db, usersColKey, userToAdd.id);

    const docSnapshot = await getDoc(userRef);
    if (!docSnapshot.exists()) {
      try {
        await setDoc(userRef, userToAdd);
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to add user: ", error.code);
        }
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
          actionButtonText: "",
          isPersisting: false,
          isError: true,
          desc: "User update failed",
        });
      }
    }
  };

  const deleteUserDataInDb = async (userId: string): Promise<void> => {
    const userRef = doc(db, usersColKey, userId);
    //delete user doc
    try {
      await deleteDoc(userRef);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to delete user: ", error.code);
      }
    }
    //delete users notes
    const q = query(notesColRef, where("userId", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      try {
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            await deleteDoc(doc.ref);
          })
        );
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          console.error("Failed to delete notes: ", error.code);
        }
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to query notes: ", error.code);
      }
    }
  };

  const getUserEmailById = async (userId: string): Promise<string> => {
    const q = query(usersColRef, where("id", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      const resolvedUser: User[] = [];
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
          actionButtonText: "",
          isPersisting: false,
          isError: true,
          desc: "No user with this email address",
        });
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

  const addNoteInDb = async (noteToAdd: Note): Promise<void> => {
    try {
      await setDoc(doc(db, notesColKey, noteToAdd.id), noteToAdd);
      setInfoMessage({
        actionButtonText: "",
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Note added",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to add note: ", error.code);
        setInfoMessage({
          actionButtonText: "",
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
        actionButtonText: "",
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
          actionButtonText: "",
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
        actionButtonText: "",
        isPersisting: false,
        showMsg: true,
        isError: false,
        desc: "Note deleted successfully",
      });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setInfoMessage({
          actionButtonText: "",
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
      resetDefault();
      getNoUserTheme();
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      const userRef = doc(db, usersColKey, userId);
      const unSubscribe = onSnapshot(
        userRef,
        (doc) => {
          const userResult = doc.data();
          if (userResult) {
            setUser({
              email: userResult.email,
              id: userResult.id,
              username: userResult.username,
              theme: userResult.theme,
              layout: userResult.layout,
            });
            setIsLoading(false);
          }
        },
        (error: unknown) => {
          console.error(error);
          if (error instanceof FirebaseError) {
            setInfoMessage({
              isError: true,
              isPersisting: true,
              actionButtonText: "",
              desc: `Failed to load user id: ${evalErrorCode(error.code)}`,
              showMsg: true,
            });
          }
        }
      );

      return unSubscribe;
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const q = query(notesColRef, where("coUsers", "array-contains", userId));
      const unSubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const resolvedNotes: Note[] = [];
          querySnapshot.forEach((doc) => {
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
          setAreNotesLoading(false);
        },
        (error: unknown) => {
          console.error(error);
          if (error instanceof FirebaseError) {
            setInfoMessage({
              isError: true,
              isPersisting: true,
              actionButtonText: "",
              desc: `Failed to load notes: ${evalErrorCode(error.code)}`,
              showMsg: true,
            });
          }
        }
      );
      return unSubscribe;
    }
  }, [userId]);

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
        isAddNoteOpen,
        setIsAddNoteOpen,
        notes,
        setNotes,
        isEditing,
        addNoteInDb,
        updateNoteInDb,
        deleteNoteInDb,
        addUserInDb,
        deleteUserDataInDb,
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
        areNotesLoading,
        userId,
        setUserId,
        isMoreNoteOptionsOpen,
        setIsMoreNoteOptionsOpen,
        moreNoteOptionsRef,
        moreNoteOptionsButtonRef,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
