import React from "react";
import ModalContainer from "../ModalContainer";
import { FormikValues } from "formik";
import { deleteNoteSchema } from "../../utilities/validationSchemas";

type DeleteConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  handleCancel: () => void;
};

function DeleteConfirmation({
  handleSubmit,
  handleCancel,
}: DeleteConfirmationProps) {
  return (
    <ModalContainer
      title="Are you sure you want to delete this note?"
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      primaryButtonText="Delete"
      initialFormValues={{}}
      validationSchema={deleteNoteSchema}
    ></ModalContainer>
  );
}

export default DeleteConfirmation;
