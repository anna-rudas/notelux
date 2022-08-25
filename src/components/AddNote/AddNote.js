import React, { useState } from "react";
import { className } from "../../helpers";
import style from "./AddNote.module.css";
import shared from "../shared.module.css";
import { v4 as uuidv4 } from "uuid";

function AddNote({ notes, setNotes, title, setTitle, body, setBody }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    setNotes([...notes, { title: title, body: body, id: uuidv4() }]);
    setTitle("");
    setBody("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle("");
    setBody("");
    setIsOpen(false);
  };

  return (
    <div {...className(style.addNoteCon)}>
      {!isOpen ? (
        <input
          type="text"
          placeholder="Take a note"
          {...className(style.addNoteInput)}
          onFocus={() => setIsOpen(true)}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          {...className(style.addNoteForm, shared.shadow)}
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            {...className(style.addNoteTitle)}
          />
          <textarea
            placeholder="Take a note"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            {...className(style.addNoteBody)}
          ></textarea>
          <div {...className(style.addNoteSet)}>
            <button {...className(shared.btn, shared.btnPrimary)} type="submit">
              Save
            </button>
            <button
              {...className(shared.btn, shared.btnSecondary)}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddNote;
