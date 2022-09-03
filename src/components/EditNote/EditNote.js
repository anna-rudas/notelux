import React from "react";
import { className } from "../../helpers";
import style from "./EditNote.module.css";
import Form from "../Form";

function EditNote({
  editNote,
  setEditNote,
  isEditing,
  setIsEditing,
  notes,
  setNotes,
  bgColor,
  setBgColor,
}) {
  const handleCancel = () => {
    setIsEditing(false);
    setBgColor("default");
  };

  const handleSubmit = () => {
    setNotes(
      notes.map((currentNote) => {
        if (currentNote.id === editNote.id) {
          currentNote.title = editNote.title;
          currentNote.body = editNote.body;
          currentNote.color = bgColor;
          currentNote.date = new Date();
        }
        return currentNote;
      })
    );
    setIsEditing(false);
    setBgColor("default");
  };

  const setEditNoteValue = (field, value) => {
    setEditNote({
      ...editNote,
      [field]: value,
    });
  };

  const handleDelete = () => {
    const newNotesList = notes.filter(
      (currentNote) => currentNote.id !== editNote.id
    );
    setNotes(newNotesList);
    setIsEditing(false);
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        note={editNote}
        setFormValue={setEditNoteValue}
        handleDelete={handleDelete}
        bgColor={bgColor}
        setBgColor={setBgColor}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
        isEditing={isEditing}
      />
    </div>
  );
}

export default EditNote;
