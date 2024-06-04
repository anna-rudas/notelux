import React from "react";
import ModalContainer from "../ModalContainer";

type DeleteConfirmationProps = {
  handleSubmit: () => void;
  setIsModalOpen: (value: boolean) => void;
};

function DeleteConfirmation({
  handleSubmit,
  setIsModalOpen,
}: DeleteConfirmationProps) {
  return (
    <ModalContainer
      title="Are you sure you want to delete this note?"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Delete"
    ></ModalContainer>
  );
}

export default DeleteConfirmation;
