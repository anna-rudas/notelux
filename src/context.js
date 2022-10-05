import React, { useState, useEffect, useCallback, createContext } from "react";
import { emptyNote, notesKey, themeKey, defaultNoteColor } from "./constants";

const getNotes = () => {
  return JSON.parse(localStorage.getItem(notesKey)) || [];
};

const saveNotes = (notes) => {
  localStorage.setItem(notesKey, JSON.stringify(notes));
};

const getTheme = () => {
  return JSON.parse(localStorage.getItem(themeKey)) || "light";
};

const saveTheme = (theme) => {
  localStorage.setItem(themeKey, JSON.stringify(theme));
};

export const AppContext = createContext();

function AppContextProvider({ children }) {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState(getNotes());
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState(emptyNote);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(getTheme());
  const [noteColor, setNoteColor] = useState(defaultNoteColor[theme]);
  const [isGrid, setIsGrid] = useState(true);

  const handleEdit = (event, id) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    const tempNote = notes.find((currentNote) => currentNote.id === id);
    setActiveNote(tempNote);
    setNoteColor(tempNote.color);
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
    const close = (e) => {
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
