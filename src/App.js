import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Header from "./components/Header";
import Notes from "./components/Notes";
import { emptyNote, storageKey, defaultNoteColor } from "./constants";

const getNotes = () => {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
};

const saveNotes = (notes) => {
  localStorage.setItem(storageKey, JSON.stringify(notes));
};

function App() {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [notes, setNotes] = useState(getNotes());
  const [isEditing, setIsEditing] = useState(false);
  const [activeNote, setActiveNote] = useState(emptyNote);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("light");
  const [noteColor, setnoteColor] = useState(defaultNoteColor[theme]);
  const [isGrid, setIsGrid] = useState(true);

  const handleEdit = (event, id) => {
    setIsEditing(true);
    setIsAddNoteOpen(false);
    const tempNote = notes.find((currentNote) => currentNote.id === id);
    setActiveNote(tempNote);
    setnoteColor(tempNote.color);
  };

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    setnoteColor(defaultNoteColor[theme]);
  }, [theme]);

  return (
    <div className="wrapper" data-theme={theme}>
      <Header
        search={search}
        setSearch={setSearch}
        isGrid={isGrid}
        setIsGrid={setIsGrid}
        theme={theme}
        setTheme={setTheme}
      />
      <AddNote
        isAddNoteOpen={isAddNoteOpen}
        setIsAddNoteOpen={setIsAddNoteOpen}
        notes={notes}
        setNotes={setNotes}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        noteColor={noteColor}
        setnoteColor={setnoteColor}
        theme={theme}
      />
      <Notes
        notes={notes}
        handleEdit={handleEdit}
        search={search}
        isGrid={isGrid}
      />
      {isEditing && (
        <EditNote
          notes={notes}
          setNotes={setNotes}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          noteColor={noteColor}
          setnoteColor={setnoteColor}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
