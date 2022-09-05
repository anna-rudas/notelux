import React from "react";
import { className } from "../../helpers";
import style from "./AddNote.module.css";
import { v4 as uuidv4 } from "uuid";
import Form from "../Form";
import { emptyNote } from "../../constants";

function AddNote({
  isOpen,
  setIsOpen,
  notes,
  setNotes,
  note,
  setNote,
  bgColor,
  setBgColor,
  theme,
}) {
  const handleSubmit = () => {
    setNotes([
      ...notes,
      { ...note, color: bgColor, id: uuidv4(), date: new Date() },
    ]);
    setNote(emptyNote);
    setIsOpen(false);
    setBgColor(theme === "light" ? "default" : "yellow");
  };

  const handleCancel = () => {
    setNote(emptyNote);
    setIsOpen(false);
    setBgColor(theme === "light" ? "default" : "yellow");
  };

  const setAddNoteValue = (field, value) => {
    setNote({
      ...note,
      [field]: value,
    });
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
        <Form
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          note={note}
          setFormValue={setAddNoteValue}
          bgColor={bgColor}
          setBgColor={setBgColor}
          noteFormStyle={style.addNoteForm}
          noteBodyStyle={style.addNoteBody}
        />
      )}
    </div>
  );
}

export default AddNote;
