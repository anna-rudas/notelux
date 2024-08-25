import React, { useContext } from "react";
import ModalContainer from "../../templates/ModalContainer";
import { deleteNoteSchema } from "../../../utilities/validationSchemas";
import { deleteNoteInDb } from "../../../firestore/noteService";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";
import { FirebaseError } from "firebase/app";
import { evalErrorCode } from "../../../utilities/helpers";

function DeleteNoteModal() {
  const { setToastMessageContent } = useContext(AppContext);
  const { activeNote, resetDefaultNoteState, setIsDeleteNoteModalOpen } =
    useContext(DashboardContext);

  const handleDeleteNoteSubmit = async () => {
    if (activeNote) {
      try {
        await deleteNoteInDb(activeNote);
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: false,
          description: "Note deleted successfully",
        });
        resetDefaultNoteState();
        setIsDeleteNoteModalOpen(false);
      } catch (error: unknown) {
        console.error("Failed to delete note in database: ", error);
        if (error instanceof FirebaseError) {
          setToastMessageContent({
            actionButtonText: "",
            isPersisting: false,
            showMessage: true,
            isError: true,
            description: `Failed to delete note: ${evalErrorCode(error.code)}`,
          });
        }
      }
    }
  };

  return (
    <ModalContainer
      title="Are you sure you want to delete this note?"
      handleSubmit={handleDeleteNoteSubmit}
      handleCancel={() => {
        setIsDeleteNoteModalOpen(false);
      }}
      primaryButtonText="Delete"
      initialFormValues={{}}
      validationSchema={deleteNoteSchema}
    ></ModalContainer>
  );
}

export default DeleteNoteModal;
