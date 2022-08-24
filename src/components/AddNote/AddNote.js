import React, { useState } from "react";
import { className } from "../../helpers";
import style from "./AddNote.module.css";
import shared from "../shared.module.css";

function AddNote() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
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
            {...className(style.addNoteTitle)}
          />
          <textarea
            placeholder="Take a note"
            {...className(style.addNoteBody)}
          ></textarea>
          <div {...className(style.addNoteSet)}>
            <button {...className(shared.btn, shared.btnPrimary)} type="submit">
              Save
            </button>
            <button
              {...className(shared.btn, shared.btnSecondary)}
              onClick={() => {
                setIsOpen(false);
              }}
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
