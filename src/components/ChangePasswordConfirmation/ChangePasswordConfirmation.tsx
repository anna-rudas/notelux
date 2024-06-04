import React, { useContext } from "react";
import * as style from "./ChangePasswordConfirmation.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context";

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
    <div {...className(shared.confModalContainer)}>
      <div {...className(shared.shadow, shared.confModal, style.delUserModal)}>
        <span {...className(shared.secondaryTitleText)}>
          Set your new password and confirm using your old password
        </span>
        <div {...className(style.inputsCon)}>
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
        </div>
        <div {...className(shared.confModalBtnsCon)}>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            {...className(
              shared.btn,
              shared.buttonPrimary,
              isLoading ? shared.btnDisabled : ""
            )}
          >
            Change password
          </button>
          <button
            disabled={isLoading}
            onClick={() => {
              setIsModalOpen(false);
            }}
            {...className(
              shared.btn,
              shared.buttonSecondary,
              isLoading ? shared.btnDisabled : ""
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordConfirmation;
