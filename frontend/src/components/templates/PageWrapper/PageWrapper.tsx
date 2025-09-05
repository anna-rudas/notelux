import React, { useContext } from "react";
import Header from "../../features/Header";
import AccountDropdown from "../../features/AccountDropdown";
import { AppContext } from "../../../context/AppContext";
import { defaultTheme } from "../../../data/constants";
import ToastMessage from "../../features/ToastMessage";
import ActionLoading from "../../loaders/ActionLoading";
import { className } from "../../../utilities/helpers";
import * as shared from "../../../assets/styles/shared.module.css";

type ModalContainerProps = {
  children?: JSX.Element;
  useLandingPageStyle?: boolean;
  useUnauthenticatedStyle?: boolean;
  toastMessageAction?: () => void;
};

function PageWrapper({
  children,
  useLandingPageStyle,
  useUnauthenticatedStyle,
  toastMessageAction,
}: ModalContainerProps) {
  const { isLoading, isDropdownOpen, user, toastMessageContent } =
    useContext(AppContext);
  return (
    <div
      {...className(shared.wrapper)}
      data-theme={useLandingPageStyle ?? user?.theme ?? defaultTheme}
    >
      {isLoading && <ActionLoading />}
      <Header
        useLandingPageStyle={useLandingPageStyle}
        useUnauthenticatedStyle={useUnauthenticatedStyle}
      />
      {isDropdownOpen && <AccountDropdown />}
      <>{children}</>
      {toastMessageContent.showMessage && (
        <ToastMessage
          actionButtonText={toastMessageContent.actionButtonText}
          actionButtonHandle={toastMessageAction}
          description={toastMessageContent.description}
          isError={toastMessageContent.isError}
        />
      )}
    </div>
  );
}

export default PageWrapper;
