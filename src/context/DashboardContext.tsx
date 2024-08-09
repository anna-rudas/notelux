import React, {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useRef,
  RefObject,
  useContext,
} from "react";
import { Note } from "../types/types";
import { AppContext } from "./AppContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { notesColKey } from "../data/constants";
import { db } from "../firestore/firestoreConfig";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../utilities/helpers";

interface DashboardContextInterface {
  activeNote: Note | null;
  setActiveNote: (value: Note | null) => void;
  setActiveNoteValue: (field: string, value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isMoreNoteOptionsOpen: boolean;
  setIsMoreNoteOptionsOpen: (value: boolean) => void;
  moreNoteOptionsRef: RefObject<HTMLDivElement> | null;
  moreNoteOptionsButtonRef: RefObject<HTMLButtonElement> | null;
  isAddNoteOpen: boolean;
  setIsAddNoteOpen: (value: boolean) => void;
  resetDefaultNoteState: () => void;
  notes: Array<Note>;
  setNotes: (value: Array<Note>) => void;
  areNotesLoading: boolean;
  setAreNotesLoading: (value: boolean) => void;
}

const defaultContextValue: DashboardContextInterface = {
  activeNote: null,
  setActiveNote: () => {},
  setActiveNoteValue: () => {},
  isEditing: false,
  setIsEditing: () => {},
  isMoreNoteOptionsOpen: false,
  setIsMoreNoteOptionsOpen: () => {},
  moreNoteOptionsRef: null,
  moreNoteOptionsButtonRef: null,
  isAddNoteOpen: false,
  setIsAddNoteOpen: () => {},
  resetDefaultNoteState: () => {},
  notes: [],
  setNotes: () => {},
  areNotesLoading: true,
  setAreNotesLoading: () => {},
};

export const DashboardContext =
  createContext<DashboardContextInterface>(defaultContextValue);

type DashboardContextProviderProps = {
  children?: ReactNode;
};

function DashboardContextProvider({ children }: DashboardContextProviderProps) {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isMoreNoteOptionsOpen, setIsMoreNoteOptionsOpen] = useState(false);
  const moreNoteOptionsRef = useRef(null);
  const moreNoteOptionsButtonRef = useRef(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [areNotesLoading, setAreNotesLoading] = useState(true);

  const notesColRef = collection(db, notesColKey);

  const { userId, setInfoMessage } = useContext(AppContext);

  const setActiveNoteValue = (field: string, value: string) => {
    if (activeNote) {
      setActiveNote({
        ...activeNote,
        [field]: value,
      });
    }
  };

  const resetDefaultNoteState = () => {
    setActiveNote(null);
    setIsAddNoteOpen(false);
    setIsEditing(false);
  };

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

  return (
    <DashboardContext.Provider
      value={{
        isEditing,
        setIsEditing,
        activeNote,
        setActiveNote,
        isMoreNoteOptionsOpen,
        setIsMoreNoteOptionsOpen,
        moreNoteOptionsRef,
        moreNoteOptionsButtonRef,
        setActiveNoteValue,
        isAddNoteOpen,
        setIsAddNoteOpen,
        resetDefaultNoteState,
        notes,
        setNotes,
        areNotesLoading,
        setAreNotesLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContextProvider;