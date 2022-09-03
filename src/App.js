import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Header from "./components/Header";
import Notes from "./components/Notes";
import { emptyNote } from "./constants";

const getNotes = () => {
  if (localStorage.getItem("savedNotes")) {
    const notesLocal = JSON.parse(localStorage.getItem("savedNotes"));
    return notesLocal;
  } else {
    localStorage.setItem("savedNotes", JSON.stringify([]));
    return [];
  }
};

const saveNotes = (notes) => {
  localStorage.setItem("savedNotes", JSON.stringify(notes));
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(getNotes());
  const [note, setNote] = useState(emptyNote);
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(emptyNote);
  const [search, setSearch] = useState("");
  const [bgColor, setBgColor] = useState("default");
  const [isGrid, setIsGrid] = useState(true);

  const handleEdit = (event, id) => {
    setIsEditing(true);
    setIsOpen(false);
    const tempNote = notes.find((currentNote) => currentNote.id === id);
    setEditNote(tempNote);
    setBgColor(tempNote.color);
  };

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  return (
    <div className="wrapper">
      <Header
        search={search}
        setSearch={setSearch}
        isGrid={isGrid}
        setIsGrid={setIsGrid}
      />
      <AddNote
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        notes={notes}
        setNotes={setNotes}
        note={note}
        setNote={setNote}
        bgColor={bgColor}
        setBgColor={setBgColor}
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
          editNote={editNote}
          setEditNote={setEditNote}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          bgColor={bgColor}
          setBgColor={setBgColor}
        />
      )}
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
