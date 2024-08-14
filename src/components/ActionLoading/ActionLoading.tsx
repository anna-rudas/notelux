import React from "react";
import * as shared from "../../assets/styles/shared.module.css";
import * as style from "./ActionLoading.module.css";
import { className } from "../../utilities/helpers";
import LoadingIcon from "../../assets/icons/LoadingIcon";

function ActionLoading() {
  return (
    <div {...className(shared.loadingModal)}>
      <div {...className(style.loadingIconContainer)}>
        <LoadingIcon
          {...className(shared.loadingIcon, shared.loadingAnimation)}
        />
      </div>
    </div>
  );
}

export default ActionLoading;
