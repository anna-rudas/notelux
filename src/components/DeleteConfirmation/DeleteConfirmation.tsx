import React from "react";
import * as style from "./DeleteConfirmation.module.css";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";

type DeleteConfirmationProps = {
  handleDelete: () => void;
  setIsDelConfOpen: (value: boolean) => void;
};

function DeleteConfirmation({
  handleDelete,
  setIsDelConfOpen,
}: DeleteConfirmationProps) {
  return (
    <div {...className(shared.confModalContainer)}>
      <div {...className(shared.shadow, shared.confModal, style.delNoteModal)}>
        <span {...className(shared.secondaryTitleText)}>
          Are you sure you want to delete this note?
        </span>
        <div {...className(shared.confModalBtnsCon)}>
          <button
            onClick={handleDelete}
            {...className(shared.btn, shared.buttonPrimary)}
          >
            Delete
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

export default DeleteConfirmation;
