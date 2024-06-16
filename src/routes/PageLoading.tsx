import React, { useContext } from "react";
import { className } from "../helpers";
import * as shared from "../components/shared.module.css";
import * as style from "./Routes.module.css";
import LoadingIcon from "../icons/LoadingIcon";
import { AppContext } from "../context";

function PageLoading() {
  const { user, noUserTheme } = useContext(AppContext);
  return (
    <div className="wrapper" data-theme={user ? user.theme : noUserTheme}>
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
