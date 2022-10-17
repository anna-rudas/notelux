import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  ReactNode,
} from "react";
import { emptyNote, notesKey, themeKey, defaultNoteColor } from "./constants";

interface AppContextInterface {
  search: string;
  setSearch: (value: string) => void;
  isGrid: boolean;
  setIsGrid: (value: boolean) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
  isAddNoteOpen: boolean;
  setIsAddNoteOpen: (value: boolean) => void;
  notes: Array<Note>;
  setNotes: (value: Array<Note>) => void;
  activeNote: Note;
  setActiveNote: (value: Note) => void;
  noteColor: Color;
  setNoteColor: (value: Color) => void;
  resetDefault: () => void;
  handleEdit: (id: string) => void;
  isEditing: boolean;
}

const defaultContextValue: AppContextInterface = {
  search: "",
  setSearch: () => {},
  isGrid: true,
  setIsGrid: () => {},
  theme: "light",
  setTheme: () => {},
  isAddNoteOpen: false,
  setIsAddNoteOpen: () => {},
  notes: [],
  setNotes: () => {},
  activeNote: emptyNote,
  setActiveNote: () => {},
  noteColor: "default",
  setNoteColor: () => {},
  resetDefault: () => {},
  handleEdit: () => {},
  isEditing: false,
};

export const AppContext =
  createContext<AppContextInterface>(defaultContextValue);

const getNotes: () => Array<Note> = () => {
  return JSON.parse(localStorage.getItem(notesKey) || "[]");
};

const saveNotes = (notes: Array<Note>) => {
  localStorage.setItem(notesKey, JSON.stringify(notes));
};

const getTheme: () => Theme = () => {
  const temp = localStorage.getItem(themeKey);
  if (temp === "light" || temp === "dark") {
    return temp;
  }
  return "light";
};

const saveTheme = (theme: Theme) => {
  localStorage.setItem(themeKey, theme);
};

type AppContextProviderProps = {
  children?: ReactNode;
};

function AppContextProvider({ children }: AppContextProviderProps) {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState(getNotes());
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState(emptyNote);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(getTheme());
  const [noteColor, setNoteColor] = useState(defaultNoteColor[theme]);
  const [isGrid, setIsGrid] = useState(true);

  const handleEdit = (id: string) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    const tempNote = notes.find((currentNote) => currentNote.id === id);
    if (tempNote) {
      setActiveNote(tempNote);
      setNoteColor(tempNote.color);
    }
  };

  const resetDefault = useCallback(() => {
    setActiveNote(emptyNote);
    setIsAddNoteOpen(false);
    setIsEditing(false);
    setNoteColor(defaultNoteColor[theme]);
  }, [theme]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    setNoteColor(defaultNoteColor[theme]);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetDefault();
      }
    };
    window.removeEventListener("keydown", close);
    window.addEventListener("keydown", close);
  }, [resetDefault]);

  return (
    <AppContext.Provider
      value={{
        search,
        setSearch,
        isGrid,
        setIsGrid,
        theme,
        setTheme,
        isAddNoteOpen,
        setIsAddNoteOpen,
        notes,
        setNotes,
        activeNote,
        setActiveNote,
        noteColor,
        setNoteColor,
        resetDefault,
        handleEdit,
        isEditing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
