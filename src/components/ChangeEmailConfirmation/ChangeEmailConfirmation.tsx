import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context/AppContext";
import ModalContainer from "../ModalContainer";
import { changeEmailSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  handleCancel: () => void;
};

function ChangeEmailConfirmation({
  handleSubmit,
  handleCancel,
}: EmailChangeConfirmationProps) {
  const { user } = useContext(AppContext);

  return (
    <ModalContainer
      title="Set your new email and confirm using your password"
      subtitle={`Your current email: ${user?.email}`}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      primaryButtonText="Change email"
      initialFormValues={{ newEmail: "", password: "" }}
      validationSchema={changeEmailSchema}
    >
      <GeneralInput
        type="email"
        config={{ name: "newEmail" }}
        placeholder="New email address"
      />
      <GeneralInput
        type="password"
        config={{ name: "password" }}
        placeholder="Password"
      />
    </ModalContainer>
  );
}

export default ChangeEmailConfirmation;
