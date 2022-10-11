import React, { useContext } from "react";
import { className } from "../../helpers";
import style from "./Header.module.css";
import shared from "../shared.module.css";
import NoteLuxLogo from "../../icons/NoteLuxLogo";
import SearchIcon from "../../icons/SearchIcon";
import GridIcon from "../../icons/GridIcon";
import ListIcon from "../../icons/ListIcon";
import SunIcon from "../../icons/SunIcon";
import MoonIcon from "../../icons/MoonIcon";
import { AppContext } from "../../context";

function Header() {
  const { search, setSearch, isGrid, setIsGrid, theme, setTheme } =
    useContext(AppContext);

  const toggleGrid = () => {
    setIsGrid(!isGrid);
  };

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <div {...className(style.header, shared.shadow)}>
      <div {...className(style.logoCon)}>
        <a {...className(style.linkCon)} href=".">
          <NoteLuxLogo {...className(style.notesIcon)} />
          <span {...className(style.name)}>NoteLux</span>
        </a>
      </div>
      <div {...className(style.searchCon)}>
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
          title={theme === "light" ? "Light mode" : "Dark mode"}
        >
          {theme === "light" ? (
            <SunIcon {...className(style.viewIcon)} />
          ) : (
            <MoonIcon {...className(style.viewIcon)} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Header;
