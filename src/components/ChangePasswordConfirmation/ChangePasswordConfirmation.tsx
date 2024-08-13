import React from "react";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";
import { changePasswordSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  handleCancel: () => void;
};

function ChangePasswordConfirmation({
  handleSubmit,
  handleCancel,
}: EmailChangeConfirmationProps) {
  return (
    <ModalContainer
      title="Set your new password"
      subtitle="Confirm using your old password"
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
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
