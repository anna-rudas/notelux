import React, { useContext } from "react";
import ModalContainer from "../../templates/ModalContainer";
import { deleteNoteInDb } from "../../../services/noteService";
import { AppContext } from "../../../context/AppContext";
import { DashboardContext } from "../../../context/DashboardContext";

function DeleteNoteModal() {
  const { setToastMessageContent } = useContext(AppContext);
  const { activeNote, resetDefaultNoteState, setIsDeleteNoteModalOpen } =
    useContext(DashboardContext);

  const handleDeleteNoteSubmit = async () => {
    if (activeNote) {
      try {
        await deleteNoteInDb(activeNote.id);
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: false,
          description: "Note deleted successfully",
        });
        resetDefaultNoteState();
        setIsDeleteNoteModalOpen(false);
      } catch (error) {
        console.error("Failed to delete note in database: ", error);
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: true,
          showMessage: true,
          isError: true,
          description: `Failed to delete note`,
        });
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
    ></ModalContainer>
  );
}

export default DeleteNoteModal;
