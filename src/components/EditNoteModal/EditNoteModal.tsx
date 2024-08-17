import React, { useContext } from "react";
import { className, evalErrorCode } from "../../utilities/helpers";
import * as style from "./EditNoteModal.module.css";
import NoteForm from "../NoteForm";
import DeleteNoteModal from "../DeleteNoteModal";
import { AppContext } from "../../context/AppContext";
import ShareNoteModal from "../ShareNoteModal";
import { DashboardContext } from "../../context/DashboardContext";
import { updateNoteInDb } from "../../firestore/noteService";
import { FirebaseError } from "firebase/app";

function EditNoteModal() {
  const { setToastMessageContent } = useContext(AppContext);
  const {
    activeNote,
    resetDefaultNoteState,
    isShareNoteModalOpen,
    isDeleteNoteModalOpen,
  } = useContext(DashboardContext);

  const handleEditNoteSubmit = async () => {
    if (activeNote) {
      try {
        await updateNoteInDb({ ...activeNote, date: new Date().toISOString() });
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: false,
          description: "Note updated successfully",
        });
        resetDefaultNoteState();
      } catch (error: unknown) {
        console.error("Failed to update note in database: ", error);
        if (error instanceof FirebaseError) {
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Failed to update note: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  };

  return (
    <div {...className(style.editNoteCon)}>
      <NoteForm
        handleSubmit={handleEditNoteSubmit}
        handleCancel={resetDefaultNoteState}
        noteFormStyle={style.editNoteForm}
        noteBodyStyle={style.editNoteBody}
      />
      {isDeleteNoteModalOpen && <DeleteNoteModal />}
      {isShareNoteModalOpen && <ShareNoteModal />}
    </div>
  );
}

export default EditNoteModal;
