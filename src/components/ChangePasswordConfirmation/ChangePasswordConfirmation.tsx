import React, { useContext } from "react";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context";
import ModalContainer from "../ModalContainer";

type EmailChangeConfirmationProps = {
  handleSubmit: () => void;
  setIsModalOpen: (value: boolean) => void;
  setNewItem: (value: string) => void;
};

function ChangePasswordConfirmation({
  handleSubmit,
  setIsModalOpen,
  setNewItem,
}: EmailChangeConfirmationProps) {
  const { setPassword, isLoading } = useContext(AppContext);
  return (
    <ModalContainer
      title="Set your new password"
      subtitle="Confirm using your old password"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Change password"
    >
      <GeneralInput
        setInputValue={setNewItem}
        placeholder="New password"
        isDisabled={isLoading}
        isPassword={true}
      />
      <GeneralInput
        isDisabled={isLoading}
        setInputValue={setPassword}
        placeholder="Old password"
        isPassword={true}
      />
    </ModalContainer>
  );
}

export default ChangePasswordConfirmation;
