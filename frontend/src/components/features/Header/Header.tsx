import React, { useContext } from "react";
import { className } from "../../../utilities/helpers";
import * as style from "./Header.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import { AppContext } from "../../../context/AppContext";
import UserIcon from "../../../assets/icons/UserIcon";
import SignInIcon from "../../../assets/icons/SignInIcon";
import { useLocation } from "react-router-dom";
import AppLogo from "../AppLogo";
import ThemeToggle from "../../buttons/ThemeToggle";
import LayoutToggle from "../../buttons/LayoutToggle";
import SearchInput from "../../inputs/SearchInput";
import SecondaryButton from "../../buttons/SecondaryButton";
import PrimaryButton from "../../buttons/PrimaryButton";

type HeaderProps = {
  useLandingPageStyle?: boolean;
  useUnauthenticatedStyle?: boolean;
};

function Header({ useLandingPageStyle, useUnauthenticatedStyle }: HeaderProps) {
  const { isLoading, setIsDropdownOpen, isDropdownOpen, dropdownButtonRef } =
    useContext(AppContext);

  const location = useLocation();
  const { pathname } = location;
  const isDashboardPage = pathname === "/dashboard";

  if (useUnauthenticatedStyle) {
    return (
      <div {...className(style.flexHeader, style.generalHeader)}>
        <AppLogo />
        {useLandingPageStyle && (
          <div {...className(style.navBtnsContainer)}>
            <SecondaryButton
              navigateTo="/signup"
              buttonText="Create a new account"
            />
            <PrimaryButton navigateTo="/signin" buttonStyle={style.signInBtn}>
              <span>Sign in</span>
              <SignInIcon {...className(style.signInIcon)} />
            </PrimaryButton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...className(
        style.gridHeader,
        style.generalHeader,
        !isDashboardPage && style.flexHeader
      )}
    >
      <AppLogo />
      <>
        {isDashboardPage && <SearchInput />}

        <div {...className(style.setCon)}>
          {isDashboardPage && <LayoutToggle />}
          <ThemeToggle />
          <button
            disabled={isLoading}
            ref={dropdownButtonRef}
            id="account-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            {...className(buttons.btn, style.buttonAccount)}
          >
            <UserIcon {...className(style.accountIcon)} />
          </button>
        </div>
      </>
    </div>
  );
}

export default Header;
