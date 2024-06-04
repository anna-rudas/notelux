import React, { useContext } from "react";
import Header from "../Header";
import AccountDropdown from "../AccountDropdown";
import { AppContext } from "../../context";
import * as shared from "../shared.module.css";
import { className } from "../../helpers";
import { defaultTheme } from "../../constants";

type ModalContainerProps = {
  children?: JSX.Element;
  isAuthStlye: boolean;
};

function PageWrapper({ children, isAuthStlye }: ModalContainerProps) {
  const { isLoading, isDropdownOpen, user } = useContext(AppContext);
  return (
    <div className="wrapper" data-theme={user?.theme ?? defaultTheme}>
      {isLoading && <div {...className(shared.loadingModal)}></div>}
      <Header loggedInStyle={isAuthStlye} />
      {isDropdownOpen && isAuthStlye && <AccountDropdown />}
      <>{children}</>
    </div>
  );
}

export default PageWrapper;
