import React, { useContext } from "react";
import { className } from "../../helpers";
import * as style from "./Header.module.css";
import * as shared from "../shared.module.css";
import NoteLuxLogo from "../../icons/NoteLuxLogo";
import SearchIcon from "../../icons/SearchIcon";
import GridIcon from "../../icons/GridIcon";
import ListIcon from "../../icons/ListIcon";
import SunIcon from "../../icons/SunIcon";
import MoonIcon from "../../icons/MoonIcon";
import { AppContext } from "../../context";
import { defaultTheme } from "../../constants";
import { Link } from "react-router-dom";
import UserIcon from "../../icons/UserIcon";

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
        isLandingPage ? style.landingPageHeader : style.generalHeader,
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
          <Link to="/signin" {...className(shared.btn, shared.buttonPrimary)}>
            Sign in
          </Link>
        </div>
      )}
      {user && !isErrorStyle && !isLandingPage && (
        <>
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

          <div {...className(style.setCon)}>
            <button
              disabled={isLoading}
              {...className(style.iconBtn)}
              onClick={toggleLayout}
              title={user?.layout === "grid" ? "Grid view" : "List view"}
            >
              {user?.layout === "grid" ? (
                <GridIcon {...className(style.viewIcon)} />
              ) : (
                <ListIcon {...className(style.viewIcon)} />
              )}
            </button>
            <button
              disabled={isLoading}
              {...className(style.iconBtn)}
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
              {...className(shared.btn, style.buttonAccount)}
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
