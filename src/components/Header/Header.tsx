import React, { useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./Header.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import SearchIcon from "../../assets/icons/SearchIcon";

import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import UserIcon from "../../assets/icons/UserIcon";
import SignInIcon from "../../assets/icons/SignInIcon";
import { useLocation } from "react-router-dom";
import AppLogo from "../AppLogo";
import ThemeToggle from "../ThemeToggle";
import LayoutToggle from "../LayoutToggle";

type HeaderProps = {
  isLandingPage?: boolean;
  isErrorStyle?: boolean;
};

function Header({ isLandingPage, isErrorStyle }: HeaderProps) {
  const {
    search,
    setSearch,
    user,
    isLoading,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownButtonRef,
  } = useContext(AppContext);

  const location = useLocation();
  const { pathname } = location;
  const isDashboardPage = pathname === "/dashboard";

  return (
    <div
      {...className(
        isLandingPage || !isDashboardPage
          ? style.landingPageHeader
          : style.generalHeader,
        style.header
      )}
    >
      <AppLogo />
      {isLandingPage && (
        <div {...className(style.navBtnsContainer)}>
          <Link to="/signup" {...className(shared.btn, shared.buttonSecondary)}>
            Create a new account
          </Link>
          <Link
            to="/signin"
            {...className(shared.btn, shared.buttonPrimary, style.signInBtn)}
          >
            <span>Sign in</span>
            <SignInIcon {...className(style.signInIcon)} />
          </Link>
        </div>
      )}
      {user && !isErrorStyle && !isLandingPage && (
        <>
          {isDashboardPage && (
            <div {...className(style.searchInputCon)}>
              <SearchIcon {...className(style.searchIcon)} />
              <input
                {...className(style.searchInput)}
                type="search"
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          )}

          <div {...className(style.setCon)}>
            {isDashboardPage && <LayoutToggle />}
            <ThemeToggle />
            <button
              disabled={isLoading}
              ref={dropdownButtonRef}
              id="account-btn"
              onClick={() => {
                setTimeout(() => {
                  setIsDropdownOpen(!isDropdownOpen);
                });
              }}
              {...className(
                shared.btn,
                style.buttonAccount,
                isLoading ? shared.btnDisabled : ""
              )}
            >
              <UserIcon {...className(style.accountIcon)} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
