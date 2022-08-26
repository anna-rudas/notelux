import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import EditNote from "./components/EditNote";
import Header from "./components/Header";
import Notes from "./components/Notes";

const emptyNote = {
  title: "",
  body: "",
  id: "",
};

const getNotes = () => {
  if (localStorage.getItem("savedNotes") === null) {
    localStorage.setItem("savedNotes", JSON.stringify([]));
    return [];
  } else {
    const notesLocal = JSON.parse(localStorage.getItem("savedNotes"));
    return notesLocal;
  }
};

const saveNotes = (notes) => {
  localStorage.setItem("savedNotes", JSON.stringify(notes));
};

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(getNotes());
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(emptyNote);
  const [search, setSearch] = useState("");

  const handleEdit = (event, id) => {
    setIsEditing(true);
    setIsOpen(false);
    setEditNote(notes.find((currentNote) => currentNote.id === id));
  };

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  return (
    <div className="wrapper">
      <Header search={search} setSearch={setSearch} />
      <AddNote
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        notes={notes}
        setNotes={setNotes}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
      />
      <Notes notes={notes} handleEdit={handleEdit} search={search} />
      {isEditing && (
        <EditNote
          notes={notes}
          setNotes={setNotes}
          editNote={editNote}
          setEditNote={setEditNote}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
