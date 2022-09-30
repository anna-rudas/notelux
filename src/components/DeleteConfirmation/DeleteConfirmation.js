import React from "react";
import style from "./DeleteConfirmation.module.css";
import shared from "../shared.module.css";
import { className } from "../../helpers";

function DeleteConfirmation({ handleDelete, setIsDelConfOpen }) {
  return (
    <div {...className(style.deleteConfCon)}>
      <div {...className(shared.shadow, style.deleteConf)}>
        <span {...className(style.delText)}>
          Are you sure you want to delete this note?
        </span>
        <div {...className(style.btnsCon)}>
          <button
            onClick={handleDelete}
            {...className(shared.btn, style.btnPrimary)}
          >
            Delete
          </button>
          <button
            onClick={() => {
              setIsDelConfOpen(false);
            }}
            {...className(shared.btn, style.btnSecondary)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
