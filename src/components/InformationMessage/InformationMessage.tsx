import React, { useContext } from "react";
import SuccessIcon from "../../assets/icons/SuccessIcon";
import ErrorIcon from "../../assets/icons/ErrorIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import { className } from "../../utilities/helpers";
import * as style from "./InformationMessage.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { AppContext } from "../../context/AppContext";

type InformationMessageProps = {
  isError: boolean;
  description: string;
  actionButtonHandle?: () => void;
  actionButtonText?: string;
};

function InformationMessage({
  isError,
  description,
  actionButtonHandle,
  actionButtonText,
}: InformationMessageProps) {
  const { setInfoMessage, infoMessage, isLoading } = useContext(AppContext);

  const handleCloseMsg = () => {
    setInfoMessage({ ...infoMessage, showMsg: false });
  };

  return (
    <div
      {...className(style.msgContent, shared.shadow)}
      style={
        isError
          ? { backgroundColor: "var(--error-bg)" }
          : { backgroundColor: "var(--success-bg)" }
      }
    >
      {isError ? (
        <ErrorIcon {...className(style.icon)} />
      ) : (
        <SuccessIcon {...className(style.icon)} />
      )}
      <div {...className(style.textCon)}>
        <span {...className(shared.secondaryTitleText)}>
          {isError ? "Error" : "Success"}
        </span>
        <span {...className(shared.normalText)}>{description}</span>
      </div>
      {actionButtonText ? (
        <button
          disabled={isLoading}
          style={
            isError
              ? { backgroundColor: "var(--error-bg)" }
              : { backgroundColor: "var(--success-bg)" }
          }
          {...className(
            shared.btn,
            shared.buttonSecondary,
            isLoading ? shared.btnDisabled : ""
          )}
          onClick={actionButtonHandle}
        >
          {actionButtonText}
        </button>
      ) : (
        <button
          disabled={isLoading}
          onClick={handleCloseMsg}
          style={
            isError
              ? { backgroundColor: "var(--error-bg)" }
              : { backgroundColor: "var(--success-bg)" }
          }
          {...className(
            shared.btn,
            style.buttonClose,
            isLoading ? shared.btnDisabled : ""
          )}
        >
          <CloseIcon {...className(style.closeIcon)} />
        </button>
      )}
    </div>
  );
}

export default InformationMessage;
