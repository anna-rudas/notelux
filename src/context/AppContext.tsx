import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import { defaultInfoMsg, usersColKey } from "../data/constants";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firestore/firestoreConfig";
import { FirebaseError } from "firebase/app";
import { InfoMsg, User } from "../types/types";
import { evalErrorCode } from "../utilities/helpers";
import { updateUserInDb } from "../firestore/userService";

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
  authenticatedUserId: string | null;
  setAuthenticatedUserId: (value: string | null) => void;
  error: Error | null;
  setError: (value: Error | null) => void;
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
  authenticatedUserId: null,
  setAuthenticatedUserId: async () => {},
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [infoMessage, setInfoMessage] = useState<InfoMsg>(defaultInfoMsg);
  const [msgTimeoutId, setMsgTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [authenticatedUserId, setAuthenticatedUserId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authenticatedUserId) {
      const userRef = doc(db, usersColKey, authenticatedUserId);
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
  }, [authenticatedUserId]);

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
        authenticatedUserId,
        setAuthenticatedUserId,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
