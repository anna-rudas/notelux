import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { defaultTheme } from "../../constants";

type ModalContainerProps = {
  children?: JSX.Element;
  isAuthStyle: boolean;
};

function PageWrapper({ children, isAuthStyle }: ModalContainerProps) {
  const { isLoading, isDropdownOpen, user } = useContext(AppContext);
  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      {isLoading && <div {...className(shared.loadingModal)}></div>}
      <Header loggedInStyle={isAuthStyle} />
      {isDropdownOpen && isAuthStyle && <AccountDropdown />}
      <>{children}</>
    </div>
  );
}

export default PageWrapper;
