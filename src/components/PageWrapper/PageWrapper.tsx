import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context/context";
import * as shared from "../../assets/styles/shared.module.css";
import { className } from "../../utilities/helpers";
import { defaultTheme } from "../../data/constants";
import LoadingIcon from "../../assets/icons/LoadingIcon";
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
  const { isLoading, isDropdownOpen, user, infoMessage } =
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
