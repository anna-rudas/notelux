import React, { useContext } from "react";
import * as style from "./DeleteUserConfirmation.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { AppContext } from "../../context";
import GeneralInput from "../GeneralInput";

type DeleteConfirmationProps = {
  handleDelete: () => void;
  setIsDelConfOpen: (value: boolean) => void;
};

function DeleteUserConfirmation({
  handleDelete,
  setIsDelConfOpen,
}: DeleteConfirmationProps) {
  const { setEmail, setPassword, user } = useContext(AppContext);

  return (
    <div {...className(shared.confModalContainer)}>
      <div {...className(shared.shadow, shared.confModal, style.delUserModal)}>
        <span {...className(shared.secondaryTitleText)}>
          Please confirm using your password
        </span>
        <div {...className(style.inputsCon)}>
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
        </div>
        <div {...className(shared.confModalBtnsCon)}>
          <button
            onClick={handleDelete}
            {...className(shared.btn, shared.buttonPrimary)}
          >
            Delete account
          </button>
          <button
            onClick={() => {
              setIsDelConfOpen(false);
            }}
            {...className(shared.btn, shared.buttonSecondary)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserConfirmation;
