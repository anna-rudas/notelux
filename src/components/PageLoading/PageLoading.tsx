import React from "react";
import { className } from "../../utilities/helpers";
import * as shared from "../../assets/styles/shared.module.css";
import * as style from "./PageLoading.module.css";
import LoadingIcon from "../../assets/icons/LoadingIcon";

function PageLoading() {
  return (
    <div {...className(shared.wrapper)}>
      <div {...className(style.loadingContainer)}>
        <span {...className(shared.titleText)}>Loading...</span>
        <LoadingIcon
          {...className(shared.loadingIcon, shared.loadingAnimation)}
        />
      </div>
    </div>
  );
}

export default PageLoading;
