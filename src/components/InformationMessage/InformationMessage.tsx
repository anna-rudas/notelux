import React, { useContext } from "react";
import SuccessIcon from "../../icons/SuccessIcon";
import ErrorIcon from "../../icons/ErrorIcon";
import CloseIcon from "../../icons/CloseIcon";
import { className } from "../../helpers";
import * as style from "./InformationMessage.module.css";
import * as shared from "../shared.module.css";
import { AppContext } from "../../context";

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
  const { setInfoMessage, infoMessage } = useContext(AppContext);

  const handleCloseMsg = () => {
    setInfoMessage({ ...infoMessage, showMsg: false });
  };

  return (
    <div {...className(style.msgContainer)}>
      <div
        {...className(style.msgContent)}
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
            style={
              isError
                ? { backgroundColor: "var(--error-bg)" }
                : { backgroundColor: "var(--success-bg)" }
            }
            {...className(shared.btn, shared.buttonSecondary)}
            onClick={actionButtonHandle}
          >
            {actionButtonText}
          </button>
        ) : (
          <button
            onClick={handleCloseMsg}
            style={
              isError
                ? { backgroundColor: "var(--error-bg)" }
                : { backgroundColor: "var(--success-bg)" }
            }
            {...className(shared.btn, style.buttonClose)}
          >
            <CloseIcon {...className(style.closeIcon)} />
          </button>
        )}
      </div>
    </div>
  );
}

export default InformationMessage;
