import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./AddNote.module.css";
import Form from "../Form";
import { AppContext } from "../../context";
import { v4 as uuidv4 } from "uuid";
import { defaultNoteColor, defaultTheme } from "../../constants";

function AddNote() {
  const {
    isAddNoteOpen,
    setIsAddNoteOpen,
    activeNote,
    setActiveNote,
    resetDefault,
    addNoteInDb,
    loadNotesFromDb,
    user,
    setIsDropdownOpen,
  } = useContext(AppContext);

  const handleSubmit = () => {
    if (activeNote) {
      addNoteInDb({
        ...activeNote,
        date: new Date(),
      });
      loadNotesFromDb();
      resetDefault();
    }
  };

  const handleOpeningAddNote = () => {
    if (user) {
      setActiveNote({
        id: uuidv4(),
        title: "",
        body: "",
        color: defaultNoteColor[user?.theme ? user.theme : defaultTheme],
        date: new Date(),
        userId: user.id,
      });
      setIsDropdownOpen(false);
      setIsAddNoteOpen(true);
    }
  };

  return (
    <div {...className(style.addNoteCon)}>
      {!isAddNoteOpen && (
        <input
          type="text"
          placeholder="Take a note"
          {...className(style.addNoteInput)}
          onFocus={handleOpeningAddNote}
        />
      )}{" "}
      {isAddNoteOpen && activeNote !== null && (
        <Form
          handleSubmit={handleSubmit}
          handleCancel={resetDefault}
          noteFormStyle={style.addNoteForm}
          noteBodyStyle={style.addNoteBody}
        />
      )}
    </div>
  );
}

export default AddNote;
