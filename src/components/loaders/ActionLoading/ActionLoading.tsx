import React from "react";
import * as style from "./ActionLoading.module.css";
import * as modals from "../../../assets/styles/modals.module.css";
import { className } from "../../../utilities/helpers";
import LoadingIcon from "../../../assets/icons/LoadingIcon";

function ActionLoading() {
  return (
    <div {...className(modals.loadingModal)}>
      <div {...className(style.loadingIconContainer)}>
        <LoadingIcon
          {...className(modals.loadingIcon, modals.loadingAnimation)}
        />
      </div>
    </div>
  );
}

export default ActionLoading;
