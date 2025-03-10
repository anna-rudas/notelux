import React, {
  useState,
  createContext,
  ReactNode,
  useEffect,
  useRef,
  RefObject,
} from "react";
import {
  defaultAnonymousUsername,
  defaultToastMessage,
  usersColKey,
} from "../data/constants";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firestore/firestoreConfig";
import { FirebaseError } from "firebase/app";
import { AuthUser, ToastMessage, User } from "../types/types";
import { evalErrorCode } from "../utilities/helpers";
import { updateUserInDb } from "../firestore/userService";
import { defaultLayout, defaultTheme } from "../data/constants";
import { addUserInDb } from "../firestore/userService";
import { useErrorBoundary } from "react-error-boundary";

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
    if (authenticatedUser && !authenticatedUser.isAnonymous) {
      const userRef = doc(db, usersColKey, authenticatedUser.id);
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
            setToastMessageContent({
              isError: true,
              isPersisting: true,
              actionButtonText: "",
              description: `Failed to load user with id: ${evalErrorCode(
                error.code
              )}`,
              showMessage: true,
            });
          }
        }
      );

      return unSubscribe;
    } else if (authenticatedUser && authenticatedUser.isAnonymous) {
      const userRef = doc(db, usersColKey, authenticatedUser.id);
      const unSubscribe = onSnapshot(
        userRef,
        (doc) => {
          const userResult = doc.data();
          //if user exists in db
          if (userResult) {
            setUser({
              email: userResult.email,
              id: userResult.id,
              username: userResult.username,
              theme: userResult.theme,
              layout: userResult.layout,
            });
            setIsLoading(false);
          } else {
            const addAnonymousUser = async () => {
              try {
                await addUserInDb({
                  id: authenticatedUser.id,
                  email: "",
                  theme: defaultTheme,
                  username: defaultAnonymousUsername,
                  layout: defaultLayout,
                });
              } catch (error) {
                console.error("Failed to add user: ", error);
                showBoundary(error);
              }
            };
            addAnonymousUser();
          }
        },
        (error: unknown) => {
          console.error(error);
          if (error instanceof FirebaseError) {
            setToastMessageContent({
              isError: true,
              isPersisting: true,
              actionButtonText: "",
              description: `Failed to load user with id: ${evalErrorCode(
                error.code
              )}`,
              showMessage: true,
            });
          }
        }
      );

      return unSubscribe;
    }
  }, [authenticatedUser]);

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

  useEffect(() => {
    if (user) {
      try {
        updateUserInDb(user);
      } catch (error: unknown) {
        console.error("Failed to update user in database: ", error);
        if (error instanceof FirebaseError) {
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Failed to save changes: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  }, [user]);

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
