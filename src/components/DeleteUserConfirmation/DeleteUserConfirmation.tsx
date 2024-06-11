import React from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { FormikValues } from "formik";
import { deleteUserSchema } from "../../validationSchemas";

type DeleteConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  setIsModalOpen: (value: boolean) => void;
};

function DeleteUserConfirmation({
  handleSubmit,
  setIsModalOpen,
}: DeleteConfirmationProps) {
  return (
    <ModalContainer
      title="Are you sure you want to delete your account?"
      subtitle="Please confirm using your password"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Delete account"
      initialFormValues={{ password: "" }}
      validationSchema={deleteUserSchema}
    >
      <GeneralInput
        type="password"
        config={{ name: "password" }}
        placeholder="Password"
      />
    </ModalContainer>
  );
}

export default DeleteUserConfirmation;
