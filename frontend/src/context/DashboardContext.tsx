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
import io from "socket.io-client";
import { getNotesFromDb } from "../services/noteService";

const socket = io(process.env.REACT_APP_BACKEND_URL, {
  transports: ["websocket"],
});

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
  isDeleteNoteModalOpen: boolean;
  setIsDeleteNoteModalOpen: (value: boolean) => void;
  isShareNoteModalOpen: boolean;
  setIsShareNoteModalOpen: (value: boolean) => void;
  isCreateAccountModalOpen: boolean;
  setIsCreateAccountModalOpen: (value: boolean) => void;
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
  isDeleteNoteModalOpen: false,
  setIsDeleteNoteModalOpen: () => {},
  isShareNoteModalOpen: false,
  setIsShareNoteModalOpen: () => {},
  isCreateAccountModalOpen: false,
  setIsCreateAccountModalOpen: () => {},
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
  const [isDeleteNoteModalOpen, setIsDeleteNoteModalOpen] = useState(false);
  const [isShareNoteModalOpen, setIsShareNoteModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);

  const { authenticatedUser, setToastMessageContent } = useContext(AppContext);

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
    fetchNotes();
    const onDatabaseChange = () => {
      fetchNotes();
    };

    socket.on("notes_table_updated", onDatabaseChange);

    return () => {
      socket.off("notes_table_updated", onDatabaseChange);
    };
  }, [authenticatedUser]);

  const fetchNotes = async () => {
    if (authenticatedUser) {
      setAreNotesLoading(true);
      try {
        const result: Note[] = await getNotesFromDb(authenticatedUser.id);
        setNotes([...result]);
        setAreNotesLoading(false);
      } catch (err) {
        console.error("Error getting notes from database:", err);
        setToastMessageContent({
          isError: true,
          isPersisting: true,
          actionButtonText: "",
          description: `Failed to load notes`,
          showMessage: true,
        });
        setAreNotesLoading(false);
      }
    }
  };

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
        isDeleteNoteModalOpen,
        setIsDeleteNoteModalOpen,
        isShareNoteModalOpen,
        setIsShareNoteModalOpen,
        isCreateAccountModalOpen,
        setIsCreateAccountModalOpen,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContextProvider;
