import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context";
import ModalContainer from "../ModalContainer";

type EmailChangeConfirmationProps = {
  handleSubmit: () => void;
  setIsModalOpen: (value: boolean) => void;
};

function ChangeEmailConfirmation({
  handleSubmit,
  setIsModalOpen,
}: EmailChangeConfirmationProps) {
  const { setEmail, setPassword, user, isLoading } = useContext(AppContext);

  return (
    <ModalContainer
      title="Set your new email and confirm using your password"
      subtitle={`Your current email: ${user?.email}`}
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Change email"
    >
      <GeneralInput
        setInputValue={setEmail}
        placeholder="New email"
        isDisabled={isLoading}
      />
      <GeneralInput
        isDisabled={isLoading}
        setInputValue={setPassword}
        placeholder="Password"
        isPassword={true}
      />
    </ModalContainer>
  );
}

export default ChangeEmailConfirmation;
