import React from "react";
import ModalContainer from "../ModalContainer";
import { FormikValues } from "formik";
import { deleteNoteSchema } from "../../utilities/validationSchemas";

type DeleteConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
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
      initialFormValues={{}}
      validationSchema={deleteNoteSchema}
    ></ModalContainer>
  );
}

export default DeleteConfirmation;
