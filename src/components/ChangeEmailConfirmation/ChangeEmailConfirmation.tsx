import React, { useContext } from "react";
import * as style from "./ChangeEmailConfirmation.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import GeneralInput from "../GeneralInput";
import { AppContext } from "../../context";

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
    <div {...className(shared.confModalContainer)}>
      <div {...className(shared.shadow, shared.confModal, style.delUserModal)}>
        <span {...className(shared.secondaryTitleText)}>
          Set your new email and confirm using your password
        </span>
        <span {...className(shared.normalText)}>
          Your current email: {user?.email}
        </span>
        <div {...className(style.inputsCon)}>
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
            Change email
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

export default ChangeEmailConfirmation;
