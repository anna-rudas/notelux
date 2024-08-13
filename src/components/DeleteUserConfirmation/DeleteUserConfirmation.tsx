import React from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { FormikValues } from "formik";
import { deleteUserSchema } from "../../utilities/validationSchemas";

type DeleteConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  handleCancel: () => void;
};

function DeleteUserConfirmation({
  handleSubmit,
  handleCancel,
}: DeleteConfirmationProps) {
  return (
    <ModalContainer
      title="Are you sure you want to delete your account?"
      subtitle="Please confirm using your password"
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
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
