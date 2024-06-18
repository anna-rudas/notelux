import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import LoadingIcon from "../../icons/LoadingIcon";
import InformationMessage from "../../components/InformationMessage";

type ModalContainerProps = {
  children?: JSX.Element;
  isLandingPage?: boolean;
  isErrorStyle?: boolean;
  infoMsgAction?: () => void;
};

function PageWrapper({
  children,
  isLandingPage,
  isErrorStyle,
  infoMsgAction,
}: ModalContainerProps) {
  const { isLoading, isDropdownOpen, user, noUserTheme, infoMessage } =
    useContext(AppContext);
  return (
    <div className="wrapper" data-theme={user ? user.theme : noUserTheme}>
      {isLoading && (
        <div {...className(shared.loadingModal)}>
          <div {...className(shared.loadingIconContainer)}>
            <LoadingIcon
              {...className(shared.loadingIcon, shared.loadingAnimation)}
            />
          </div>
        </div>
      )}
      <Header isLandingPage={isLandingPage} isErrorStyle={isErrorStyle} />
      {isDropdownOpen && <AccountDropdown />}
      <>{children}</>
      {infoMessage.showMsg && (
        <InformationMessage
          actionButtonText={infoMessage.actionButtonText}
          actionButtonHandle={infoMsgAction}
          description={infoMessage.desc}
          isError={infoMessage.isError}
        />
      )}
    </div>
  );
}

export default PageWrapper;
