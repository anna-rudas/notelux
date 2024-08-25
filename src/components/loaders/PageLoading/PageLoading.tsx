import React from "react";
import { className } from "../../../utilities/helpers";
import * as shared from "../../../assets/styles/shared.module.css";
import * as style from "./PageLoading.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import * as modals from "../../../assets/styles/modals.module.css";
import LoadingIcon from "../../../assets/icons/LoadingIcon";

function PageLoading() {
  return (
    <div {...className(shared.wrapper)}>
      <div {...className(style.loadingContainer)}>
        <span {...className(textStyles.titleText)}>Loading...</span>
        <LoadingIcon
          {...className(modals.loadingIcon, modals.loadingAnimation)}
        />
      </div>
    </div>
  );
}

export default PageLoading;
