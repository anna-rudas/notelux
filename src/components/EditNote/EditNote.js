import React from "react";
import { className } from "../../helpers";
import style from "./EditNote.module.css";
import Form from "../Form";

function EditNote({
  activeNote,
  setActiveNote,
  isEditing,
  setIsEditing,
  notes,
  setNotes,
  noteColor,
  setNoteColor,
  resetDefault,
}) {
  const handleSubmit = () => {
    setNotes(
      notes.map((currentNote) => {
        if (currentNote.id === activeNote.id) {
          currentNote.title = activeNote.title;
          currentNote.body = activeNote.body;
          currentNote.color = noteColor;
          currentNote.date = new Date();
        }
        return currentNote;
      })
    );
    resetDefault();
  };

  const setEditNoteValue = (field, value) => {
    setActiveNote({
      ...activeNote,
      [field]: value,
    });
  };

  const handleDelete = () => {
    const newNotesList = notes.filter(
      (currentNote) => currentNote.id !== activeNote.id
    );
    setNotes(newNotesList);
    setIsEditing(false);
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleSubmit}
        handleCancel={resetDefault}
        activeNote={activeNote}
        setFormValue={setEditNoteValue}
        handleDelete={handleDelete}
        noteColor={noteColor}
        setNoteColor={setNoteColor}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
        isEditing={isEditing}
      />
    </div>
  );
}

export default EditNote;
