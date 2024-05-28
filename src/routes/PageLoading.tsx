import React from "react";
import { className } from "../helpers";
import * as shared from "../components/shared.module.css";
import * as style from "./Routes.module.css";
import LoadingIcon from "../icons/LoadingIcon";

function PageLoading() {
  return (
    <div className="wrapper">
      <div {...className(style.loadingContainer)}>
        <span {...className(shared.titleText)}>Loading...</span>
        <LoadingIcon
          {...className(style.loadingIcon, style.loadingAnimation)}
        />
      </div>
    </div>
  );
}

export default PageLoading;
