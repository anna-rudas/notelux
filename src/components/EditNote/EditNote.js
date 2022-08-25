import React from "react";
import { className } from "../../helpers";
import style from "./EditNote.module.css";
import shared from "../shared.module.css";

function EditNote({ editNote, setEditNote, setIsEditing, notes, setNotes }) {
  const handleCancel = () => {
    setIsEditing(false);
  };

  const saveChanges = () => {
    setNotes(
      notes.map((currentNote) => {
        if (currentNote.id === editNote.id) {
          currentNote.title = editNote.title;
          currentNote.body = editNote.body;
        }
        return currentNote;
      })
    );
    setIsEditing(false);
  };

  const setFormValue = (field, value) => {
    setEditNote({
      ...editNote,
      [field]: value,
    });
  };

  return (
    <div {...className(style.editNoteCon)}>
      <form
        onSubmit={saveChanges}
        {...className(style.editNoteForm, shared.noteForm, shared.shadow)}
      >
        <input
          type="text"
          placeholder="Title"
          value={editNote.title}
          onChange={(event) => setFormValue("title", event.target.value)}
          {...className(shared.noteTitle)}
        />
        <textarea
          placeholder="Take a note"
          value={editNote.body}
          onChange={(event) => setFormValue("body", event.target.value)}
          {...className(style.editNoteBody, shared.noteBody)}
        ></textarea>
        <div {...className(shared.noteSet)}>
          <button {...className(shared.btn, shared.btnPrimary)} type="submit">
            Save changes
          </button>
          <button
            {...className(shared.btn, shared.btnSecondary)}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNote;
