import React from "react";
import SuccessIcon from "../../icons/SuccessIcon";
import ErrorIcon from "../../icons/ErrorIcon";
import CloseIcon from "../../icons/CloseIcon";
import { className } from "../../helpers";
import * as style from "./InformationMessage.module.css";
import * as shared from "../shared.module.css";

type InformationMessageProps = {
  isError: boolean;
  title: string;
  description: string;
  closeMsg: (value: boolean) => void;
  actionButtonHandle?: () => void;
  actionButtonText?: string;
};

function InformationMessage({
  isError,
  title,
  description,
  closeMsg,
  actionButtonHandle,
  actionButtonText,
}: InformationMessageProps) {
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
          <span {...className(shared.secondaryTitleText)}>{title}</span>
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
            onClick={() => closeMsg(false)}
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
