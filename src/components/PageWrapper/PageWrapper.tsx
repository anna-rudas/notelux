import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { defaultTheme } from "../../constants";
import LoadingIcon from "../../icons/LoadingIcon";

type ModalContainerProps = {
  children?: JSX.Element;
  isAuthStyle: boolean;
};

function PageWrapper({ children, isAuthStyle }: ModalContainerProps) {
  const { isLoading, isDropdownOpen, user } = useContext(AppContext);
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
      <Header loggedInStyle={isAuthStyle} />
      {isDropdownOpen && isAuthStyle && <AccountDropdown />}
      <>{children}</>
    </div>
  );
}

export default PageWrapper;
