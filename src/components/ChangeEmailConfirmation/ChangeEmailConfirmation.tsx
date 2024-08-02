import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context/context";
import ModalContainer from "../ModalContainer";
import { changeEmailSchema } from "../../utilities/validationSchemas";
import { FormikValues } from "formik";

type EmailChangeConfirmationProps = {
  handleSubmit: (v: FormikValues) => void;
  setIsModalOpen: (value: boolean) => void;
};

function ChangeEmailConfirmation({
  handleSubmit,
  setIsModalOpen,
}: EmailChangeConfirmationProps) {
  const { user } = useContext(AppContext);

  return (
    <ModalContainer
      title="Set your new email and confirm using your password"
      subtitle={`Your current email: ${user?.email}`}
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
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
