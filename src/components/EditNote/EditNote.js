import React from "react";
import { className } from "../../helpers";
import style from "./EditNote.module.css";
import Form from "../Form";
import { emptyNote, defaultNoteColor } from "../../constants";

function EditNote({
  activeNote,
  setActiveNote,
  isEditing,
  setIsEditing,
  notes,
  setNotes,
  noteColor,
  setnoteColor,
  theme,
}) {
  const handleCancel = () => {
    setIsEditing(false);
    setActiveNote(emptyNote);
    setnoteColor(defaultNoteColor[theme]);
  };

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
    setIsEditing(false);
    setActiveNote(emptyNote);
    setnoteColor(defaultNoteColor[theme]);
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
        handleCancel={handleCancel}
        activeNote={activeNote}
        setFormValue={setEditNoteValue}
        handleDelete={handleDelete}
        noteColor={noteColor}
        setnoteColor={setnoteColor}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
        isEditing={isEditing}
      />
    </div>
  );
}

export default EditNote;
