import React from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { changePasswordSchema } from "../../validationSchemas";
import { FormikValues } from "formik";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  setIsModalOpen: (value: boolean) => void;
};

function ChangePasswordConfirmation({
  handleSubmit,
  setIsModalOpen,
}: EmailChangeConfirmationProps) {
  return (
    <ModalContainer
      title="Set your new password"
      subtitle="Confirm using your old password"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Change password"
      initialFormValues={{ newPassword: "", oldPassword: "" }}
      validationSchema={changePasswordSchema}
    >
      <GeneralInput
        type="password"
        config={{ name: "newPassword" }}
        placeholder="New password"
      />
      <GeneralInput
        type="password"
        config={{ name: "oldPassword" }}
        placeholder="Old password"
      />
    </ModalContainer>
  );
}

export default ChangePasswordConfirmation;
