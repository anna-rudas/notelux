import React, { useContext } from "react";
import SuccessIcon from "../../../assets/icons/SuccessIcon";
import ErrorIcon from "../../../assets/icons/ErrorIcon";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { className } from "../../../utilities/helpers";
import * as style from "./ToastMessage.module.css";
import * as shared from "../../../assets/styles/shared.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { AppContext } from "../../../context/AppContext";
import SecondaryButton from "../../buttons/SecondaryButton";

type ToastMessageProps = {
  isError: boolean;
  description: string;
  actionButtonHandle?: () => void;
  actionButtonText?: string;
};

function ToastMessage({
  isError,
  description,
  actionButtonHandle,
  actionButtonText,
}: ToastMessageProps) {
  const { setToastMessageContent, toastMessageContent, isLoading } =
    useContext(AppContext);

  const handleCloseMsg = () => {
    setToastMessageContent({ ...toastMessageContent, showMessage: false });
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
        <span {...className(textStyles.subtitleText)}>
          {isError ? "Error" : "Success"}
        </span>
        <span {...className(textStyles.normalText)}>{description}</span>
      </div>
      {actionButtonText ? (
        <SecondaryButton
          handleClick={actionButtonHandle}
          buttonText={actionButtonText}
          buttonStyle={isError ? style.errorBg : style.successBg}
        />
      ) : (
        <button
          disabled={isLoading}
          onClick={handleCloseMsg}
          style={
            isError
              ? { backgroundColor: "var(--error-bg)" }
              : { backgroundColor: "var(--success-bg)" }
          }
          {...className(buttons.btn, style.buttonClose)}
        >
          <CloseIcon {...className(style.closeIcon)} />
        </button>
      )}
    </div>
  );
}

export default ToastMessage;
