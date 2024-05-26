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
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  loggedInStyle: boolean;
};

function Header({ loggedInStyle }: HeaderProps) {
  const { search, setSearch, isGrid, setIsGrid, user, setUser, isLoading } =
    useContext(AppContext);

  const auth = getAuth();
  const navigate = useNavigate();

  const toggleGrid = () => {
    setIsGrid(!isGrid);
  };

  const toggleTheme = () => {
    if (user) {
      setUser({
        ...user,
        theme: user.theme === "light" ? "dark" : "light",
      });
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/signin");
    } catch (error: unknown) {
      if (error) {
        console.error(error);
      }
    }
  };

  return (
    <div {...className(style.header, shared.shadow)}>
      <div {...className(style.logoCon)}>
        <Link
          {...className(style.linkCon, isLoading && shared.disabledLink)}
          to="/"
        >
          <NoteLuxLogo {...className(style.notesIcon)} />
          <span {...className(style.name, shared.titleText)}>NoteLux</span>
        </Link>
      </div>
      {loggedInStyle && (
        <div {...className(shared.generalInput)}>
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
      {loggedInStyle && (
        <div {...className(style.setCon)}>
          <button
            {...className(style.iconBtn)}
            onClick={toggleGrid}
            title={isGrid ? "Grid view" : "List view"}
          >
            {isGrid ? (
              <GridIcon {...className(style.viewIcon)} />
            ) : (
              <ListIcon {...className(style.viewIcon)} />
            )}
          </button>
          <button
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
            onClick={() => {
              handleSignOut();
            }}
            {...className(shared.btn, shared.buttonSecondary)}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
