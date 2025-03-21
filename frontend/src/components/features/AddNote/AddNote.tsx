import React, { useContext } from "react";
import { className } from "../../../utilities/helpers";
import * as style from "./AddNote.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import NoteForm from "../../templates/NoteForm";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";
import { v4 as uuidv4 } from "uuid";
import { addNoteInDb } from "../../../services/noteService";

function AddNote() {
  const { user, setIsDropdownOpen, setToastMessageContent, setIsLoading } =
    useContext(AppContext);
  const {
    activeNote,
    setActiveNote,
    isAddNoteOpen,
    setIsAddNoteOpen,
    resetDefaultNoteState,
  } = useContext(DashboardContext);

  if (!user) {
    return null;
  }

  const handleNewNoteSubmit = async () => {
    if (activeNote) {
      setIsLoading(true);
      try {
        await addNoteInDb({
          ...activeNote,
          date: new Date().toISOString(),
        });
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: false,
          description: "Note added successfully",
        });
        resetDefaultNoteState();
      } catch (error) {
        console.error("Failed to save note in database: ", error);
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: true,
          showMessage: true,
          isError: true,
          description: `Failed to save note`,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpeningAddNote = () => {
    setActiveNote({
      id: uuidv4(),
      title: "",
      body: "",
      color: "default",
      date: new Date().toISOString(),
      userId: user.userId,
      coUsers: [user.userId],
    });
    setIsDropdownOpen(false);
    setIsAddNoteOpen(true);
  };

  return (
    <div {...className(style.addNoteCon)}>
      {!isAddNoteOpen && (
        <input
          type="text"
          placeholder="Take a note"
          {...className(style.addNoteInput, textStyles.subtitleText)}
          onFocus={handleOpeningAddNote}
        />
      )}
      {isAddNoteOpen && activeNote !== null && (
        <NoteForm
          handleSubmit={handleNewNoteSubmit}
          handleCancel={resetDefaultNoteState}
          noteFormStyle={style.addNoteForm}
          noteBodyStyle={style.addNoteBody}
        />
      )}
    </div>
  );
}

export default AddNote;
