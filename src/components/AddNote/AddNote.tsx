import React, { useContext } from "react";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as style from "./AddNote.module.css";
import Form from "../Form";
import { AppContext } from "../../context/AppContext";
import { DashboardContext } from "../../context/DashboardContext";
import { v4 as uuidv4 } from "uuid";
import { defaultNoteColor, defaultTheme } from "../../data/constants";
import { addNoteInDb } from "../../firestore/noteService";
import { FirebaseError } from "firebase/app";

function AddNote() {
  const { user, setIsDropdownOpen, setInfoMessage } = useContext(AppContext);
  const {
    activeNote,
    setActiveNote,
    isAddNoteOpen,
    setIsAddNoteOpen,
    resetDefaultNoteState,
  } = useContext(DashboardContext);

  const handleSubmit = async () => {
    if (activeNote) {
      try {
        await addNoteInDb({
          ...activeNote,
          date: new Date().toISOString(),
        });
        setInfoMessage({
          actionButtonText: "",
          isPersisting: false,
          showMsg: true,
          isError: false,
          desc: "Note added successfully",
        });
        resetDefaultNoteState();
      } catch (error: unknown) {
        console.error("Failed to save note in database: ", error);
        if (error instanceof FirebaseError) {
          setInfoMessage({
            actionButtonText: "",
            isPersisting: false,
            showMsg: true,
            isError: true,
            desc: `Failed to save note: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  };

  const handleOpeningAddNote = () => {
    if (user) {
      setActiveNote({
        id: uuidv4(),
        title: "",
        body: "",
        color: defaultNoteColor[user?.theme ? user.theme : defaultTheme],
        date: new Date().toISOString(),
        userId: user.id,
        coUsers: [user.id],
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
      )}
      {isAddNoteOpen && activeNote !== null && (
        <Form
          handleSubmit={handleSubmit}
          handleCancel={resetDefaultNoteState}
          noteFormStyle={style.addNoteForm}
          noteBodyStyle={style.addNoteBody}
        />
      )}
    </div>
  );
}

export default AddNote;
