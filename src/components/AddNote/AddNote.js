import React from "react";
import { className } from "../../helpers";
import style from "./AddNote.module.css";
import { v4 as uuidv4 } from "uuid";
import Form from "../Form";

function AddNote({
  isAddNoteOpen,
  setIsAddNoteOpen,
  notes,
  setNotes,
  activeNote,
  setActiveNote,
  noteColor,
  setNoteColor,
  resetDefault,
}) {
  const handleSubmit = () => {
    setNotes([
      ...notes,
      { ...activeNote, color: noteColor, id: uuidv4(), date: new Date() },
    ]);
    resetDefault();
  };

  const setAddNoteValue = (field, value) => {
    setActiveNote({
      ...activeNote,
      [field]: value,
    });
  };

  return (
    <div {...className(style.addNoteCon)}>
      {!isAddNoteOpen ? (
        <input
          type="text"
          placeholder="Take a note"
          {...className(style.addNoteInput)}
          onFocus={() => setIsAddNoteOpen(true)}
        />
      ) : (
        <Form
          handleSubmit={handleSubmit}
          handleCancel={resetDefault}
          activeNote={activeNote}
          setFormValue={setAddNoteValue}
          noteColor={noteColor}
          setNoteColor={setNoteColor}
          noteFormStyle={style.addNoteForm}
          noteBodyStyle={style.addNoteBody}
        />
      )}
    </div>
  );
}

export default AddNote;
