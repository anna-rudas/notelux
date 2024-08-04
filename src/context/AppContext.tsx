import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import { defaultInfoMsg, notesColKey, usersColKey } from "../data/constants";
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
import { db } from "../firestore/firestoreConfig";
import { FirebaseError } from "firebase/app";
import { InfoMsg, Note, User } from "../types/types";
import { evalErrorCode } from "../utilities/helpers";

interface AppContextInterface {
  search: string;
  setSearch: (value: string) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement> | null;
  dropdownButtonRef: RefObject<HTMLButtonElement> | null;
  infoMessage: InfoMsg;
  setInfoMessage: (value: InfoMsg) => void;
  userId: string | null;
  setUserId: (value: string | null) => void;
  error: Error | null;
  setError: (value: Error | null) => void;

  addNoteInDb: (value: Note) => Promise<void>;
  updateNoteInDb: (value: Note) => Promise<void>;
  deleteNoteInDb: (value: Note) => Promise<void>;
  addUserInDb: (value: User) => Promise<void>;
  deleteUserDataInDb: (value: string) => Promise<void>;
  getUserIdByEmail: (value: string) => Promise<string>;
  updateUserInDb: (value: User) => void;
  getUserEmailById: (value: string) => Promise<string>;
}

const defaultContextValue: AppContextInterface = {
  search: "",
  setSearch: () => {},
  user: null,
  setUser: async () => {},
  isLoading: true,
  setIsLoading: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  dropdownRef: null,
  dropdownButtonRef: null,
  infoMessage: defaultInfoMsg,
  setInfoMessage: () => {},
  userId: null,
  setUserId: async () => {},
  error: null,
  setError: () => {},

  addNoteInDb: async () => {},
  updateNoteInDb: async () => {},
  deleteNoteInDb: async () => {},
  addUserInDb: async () => {},
  deleteUserDataInDb: async () => {},
  getUserIdByEmail: async () => "",
  updateUserInDb: () => {},
  getUserEmailById: async () => "",
};

export const AppContext =
  createContext<AppContextInterface>(defaultContextValue);

type AppContextProviderProps = {
  children?: ReactNode;
};

function AppContextProvider({ children }: AppContextProviderProps) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [infoMessage, setInfoMessage] = useState<InfoMsg>(defaultInfoMsg);
  const [msgTimeoutId, setMsgTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  //---
  const notesColRef = collection(db, notesColKey);
  const usersColRef = collection(db, usersColKey);

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

  //-----

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
        user,
        setUser,
        isLoading,
        setIsLoading,
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        dropdownButtonRef,
        infoMessage,
        setInfoMessage,
        userId,
        setUserId,
        error,
        setError,

        addNoteInDb,
        updateNoteInDb,
        deleteNoteInDb,
        addUserInDb,
        deleteUserDataInDb,
        getUserIdByEmail,
        updateUserInDb,
        getUserEmailById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
