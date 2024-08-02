import React, { useContext } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./Header.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import NoteLuxLogo from "../../assets/icons/NoteLuxLogo";
import SearchIcon from "../../assets/icons/SearchIcon";
import GridIcon from "../../assets/icons/GridIcon";
import ListIcon from "../../assets/icons/ListIcon";
import SunIcon from "../../assets/icons/SunIcon";
import MoonIcon from "../../assets/icons/MoonIcon";
import { AppContext } from "../../context/context";
import { defaultTheme } from "../../data/constants";
import { Link } from "react-router-dom";
import UserIcon from "../../assets/icons/UserIcon";
import SignInIcon from "../../assets/icons/SignInIcon";
import { useLocation } from "react-router-dom";

type HeaderProps = {
  isLandingPage?: boolean;
  isErrorStyle?: boolean;
};

function Header({ isLandingPage, isErrorStyle }: HeaderProps) {
  const {
    search,
    setSearch,
    user,
    setUser,
    isLoading,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownButtonRef,
  } = useContext(AppContext);

  const location = useLocation();
  const { pathname } = location;
  const isDashboardPage = pathname === "/dashboard";

  const toggleTheme = () => {
    if (user) {
      setUser({
        ...user,
        theme: user.theme === "light" ? "dark" : "light",
      });
    }
  };

  const toggleLayout = () => {
    if (user) {
      setUser({
        ...user,
        layout: user.layout === "grid" ? "list" : "grid",
      });
    }
  };

  return (
    <div
      {...className(
        isLandingPage || !isDashboardPage
          ? style.landingPageHeader
          : style.generalHeader,
        style.header
      )}
    >
      <div {...className(style.logoCon)}>
        <Link
          {...className(style.linkCon, isLoading && shared.disabledLink)}
          to={user ? "/dashboard" : "/"}
        >
          <NoteLuxLogo {...className(style.notesIcon)} />
          <span {...className(style.name, shared.titleText)}>NoteLux</span>
        </Link>
      </div>
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
            {isDashboardPage && (
              <button
                disabled={isLoading}
                {...className(
                  style.iconBtn,
                  isLoading ? shared.btnDisabled : ""
                )}
                onClick={toggleLayout}
                title={user?.layout === "grid" ? "Grid view" : "List view"}
              >
                {user?.layout === "grid" ? (
                  <GridIcon {...className(style.viewIcon)} />
                ) : (
                  <ListIcon {...className(style.viewIcon)} />
                )}
              </button>
            )}
            <button
              disabled={isLoading}
              {...className(style.iconBtn, isLoading ? shared.btnDisabled : "")}
              onClick={toggleTheme}
              title={
                (user?.theme ?? defaultTheme) === "light"
                  ? "Light mode"
                  : "Dark mode"
              }
            >
              {(user?.theme ?? defaultTheme) === "light" ? (
                <SunIcon {...className(style.viewIcon)} />
              ) : (
                <MoonIcon {...className(style.viewIcon)} />
              )}
            </button>
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
