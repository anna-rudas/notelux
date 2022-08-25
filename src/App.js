import React, { useState } from "react";
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

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState(emptyNote);

  const handleEdit = (event, id) => {
    setIsEditing(true);
    setIsOpen(false);
    setEditNote(notes.find((currentNote) => currentNote.id === id));
  };

  return (
    <div className="wrapper">
      <Header />
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
      <Notes notes={notes} handleEdit={handleEdit} />
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
