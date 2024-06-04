import React, { useContext } from "react";
import { AppContext } from "../../context";
import GeneralInput from "../GeneralInput";
import ModalContainer from "../ModalContainer";

type DeleteConfirmationProps = {
  handleSubmit: () => void;
  setIsModalOpen: (value: boolean) => void;
};

function DeleteUserConfirmation({
  handleSubmit,
  setIsModalOpen,
}: DeleteConfirmationProps) {
  const { setEmail, setPassword, user } = useContext(AppContext);

  return (
    <ModalContainer
      title="Please confirm using your password"
      handleSubmit={handleSubmit}
      setIsModalOpen={setIsModalOpen}
      primaryButtonText="Delete account"
    >
      <GeneralInput
        setInputValue={setEmail}
        inputValue={user?.email}
        placeholder="Email"
        isDisabled={true}
      />
      <GeneralInput
        setInputValue={setPassword}
        placeholder="Password"
        isPassword={true}
      />
    </ModalContainer>
  );
}

export default DeleteUserConfirmation;
