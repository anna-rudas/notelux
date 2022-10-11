import React, { useState, useContext } from "react";
import { className } from "../../helpers";
import style from "./EditNote.module.css";
import Form from "../Form";
import DeleteConfirmation from "../DeleteConfirmation";
import { AppContext } from "../../context";

function EditNote() {
  const {
    activeNote,
    setActiveNote,
    notes,
    setNotes,
    noteColor,
    resetDefault,
  } = useContext(AppContext);
  const [isDelConfOpen, setIsDelConfOpen] = useState(false);

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

  const setEditNoteValue = (field: string, value: string) => {
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
    resetDefault();
    setIsDelConfOpen(false);
  };

  return (
    <div {...className(style.editNoteCon)}>
      <Form
        handleSubmit={handleSubmit}
        handleCancel={resetDefault}
        setFormValue={setEditNoteValue}
        setIsDelConfOpen={setIsDelConfOpen}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
      />
      {isDelConfOpen && (
        <DeleteConfirmation
          handleDelete={handleDelete}
          setIsDelConfOpen={setIsDelConfOpen}
        />
      )}
    </div>
  );
}

export default EditNote;
