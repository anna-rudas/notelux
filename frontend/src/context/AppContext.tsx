import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import "../firestore/firestoreConfig";
import {
  defaultAnonymousUsername,
  defaultToastMessage,
} from "../data/constants";
import { AuthUser, ToastMessage, User } from "../types/types";
import { defaultLayout, defaultTheme } from "../data/constants";
import { addUserInDb, getUserFromDb } from "../services/userService";
import { useErrorBoundary } from "react-error-boundary";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 3,
});

interface AppContextInterface {
  termToSearch: string;
  setTermToSearch: (value: string) => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement> | null;
  dropdownButtonRef: RefObject<HTMLButtonElement> | null;
  toastMessageContent: ToastMessage;
  setToastMessageContent: (value: ToastMessage) => void;
  authenticatedUser: AuthUser | null;
  setAuthenticatedUser: (value: AuthUser | null) => void;
  error: Error | null;
  setError: (value: Error | null) => void;
}

const defaultContextValue: AppContextInterface = {
  termToSearch: "",
  setTermToSearch: () => {},
  user: null,
  setUser: async () => {},
  isLoading: true,
  setIsLoading: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  dropdownRef: null,
  dropdownButtonRef: null,
  toastMessageContent: defaultToastMessage,
  setToastMessageContent: () => {},
  authenticatedUser: null,
  setAuthenticatedUser: () => {},
  error: null,
  setError: () => {},
};

export const AppContext =
  createContext<AppContextInterface>(defaultContextValue);

type AppContextProviderProps = {
  children?: ReactNode;
};

function AppContextProvider({ children }: AppContextProviderProps) {
  const [termToSearch, setTermToSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);
  const [toastMessageContent, setToastMessageContent] =
    useState<ToastMessage>(defaultToastMessage);
  const [msgTimeoutId, setMsgTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    fetchUserData();
    const onDatabaseChange = () => {
      fetchUserData();
    };

    socket.on("users_updates", onDatabaseChange);

    return () => {
      socket.off("users_updates", onDatabaseChange);
    };
  }, [authenticatedUser]);

  const fetchUserData = async () => {
    if (authenticatedUser) {
      try {
        setIsLoading(true);
        const result = await getUserFromDb(authenticatedUser.id);
        if (result) {
          setUser(result);
        }
        if (!result && authenticatedUser.isAnonymous) {
          try {
            await addUserInDb({
              userId: authenticatedUser.id,
              email: "",
              theme: defaultTheme,
              username: defaultAnonymousUsername,
              layout: defaultLayout,
            });
          } catch (error) {
            console.error("Failed to add user: ", error);
            showBoundary(error);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error getting user from database:", err);
        setToastMessageContent({
          isError: true,
          isPersisting: true,
          actionButtonText: "",
          description: `Failed to load user`,
          showMessage: true,
        });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (msgTimeoutId) {
      clearTimeout(msgTimeoutId);
    }
    if (toastMessageContent.showMessage && !toastMessageContent.isPersisting) {
      const timeoutId = setTimeout(() => {
        setToastMessageContent({
          ...toastMessageContent,
          showMessage: false,
        });
      }, 5000);
      setMsgTimeoutId(timeoutId);
    }
  }, [toastMessageContent]);

  return (
    <AppContext.Provider
      value={{
        termToSearch,
        setTermToSearch,
        user,
        setUser,
        isLoading,
        setIsLoading,
        isDropdownOpen,
        setIsDropdownOpen,
        dropdownRef,
        dropdownButtonRef,
        toastMessageContent,
        setToastMessageContent,
        authenticatedUser,
        setAuthenticatedUser,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
