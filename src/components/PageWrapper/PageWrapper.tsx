import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context/AppContext";
import * as shared from "../../assets/styles/shared.module.css";
import { className } from "../../utilities/helpers";
import { defaultTheme } from "../../data/constants";
import LoadingIcon from "../../assets/icons/LoadingIcon";
import ToastMessage from "../../components/ToastMessage";

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
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      {isLoading && (
        <div {...className(shared.loadingModal)}>
          <div {...className(shared.loadingIconContainer)}>
            <LoadingIcon
              {...className(shared.loadingIcon, shared.loadingAnimation)}
            />
          </div>
        </div>
      )}
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
