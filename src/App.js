import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import AddNote from "./components/AddNote";
import Header from "./components/Header";
import Notes from "./components/Notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="wrapper">
      <Header />
      <AddNote
        notes={notes}
        setNotes={setNotes}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
      />
      <Notes notes={notes} />
    </div>
  );
}

export default App;

createRoot(document.getElementById("root")).render(<App />);
