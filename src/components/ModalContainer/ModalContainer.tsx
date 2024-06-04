import React, { useContext } from "react";
import * as style from "./ModalContainer.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { AppContext } from "../../context";

type ModalContainerProps = {
  handleSubmit: () => void;
  setIsModalOpen: (value: boolean) => void;
  title: string;
  subtitle?: string;
  primaryButtonText: string;
  children?: JSX.Element[];
};

function ModalContainer({
  children,
  handleSubmit,
  setIsModalOpen,
  title,
  subtitle,
  primaryButtonText,
}: ModalContainerProps) {
  const { isLoading } = useContext(AppContext);

  return (
    <div {...className(style.confModalContainer)}>
      <div {...className(shared.shadow, style.confModal)}>
        <span {...className(shared.secondaryTitleText, style.modalText)}>
          {title}
        </span>
        <span {...className(shared.normalText, style.modalText)}>
          {subtitle}
        </span>
        <div {...className(style.inputsCon)}>{children}</div>
        <div {...className(style.confModalBtnsCon)}>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            {...className(
              shared.btn,
              shared.buttonPrimary,
              isLoading ? shared.btnDisabled : ""
            )}
          >
            {primaryButtonText}
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

export default ModalContainer;
