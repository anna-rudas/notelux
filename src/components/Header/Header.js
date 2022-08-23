import React, { useState } from "react";
import { className } from "../../helpers";
import style from "./Header.module.css";
import shared from "../shared.module.css";
import MyNotesLogo from "../../icons/MyNotesLogo";
import SearchIcon from "../../icons/SearchIcon";
import GridIcon from "../../icons/GridIcon";
import ListIcon from "../../icons/ListIcon";

function Header() {
  const [isGrid, setIsGrid] = useState(true);

  const toggleGrid = () => {
    setIsGrid(!isGrid);
  };

  return (
    <div {...className(style.header, shared.shadow)}>
      <div {...className(style.logoCon)}>
        <a {...className(style.linkCon)} href=".">
          <MyNotesLogo {...className(style.notesIcon)} />
          <span {...className(style.name)}>MyNotes</span>
        </a>
      </div>
      <div {...className(style.searchCon)}>
        <SearchIcon {...className(style.searchIcon)} />
        <input
          {...className(style.searchInput)}
          type="search"
          placeholder="Search"
        />
      </div>
      <div {...className(style.setCon)}>
        <button {...className(style.iconBtn)} onClick={toggleGrid}>
          {isGrid ? (
            <GridIcon {...className(style.viewIcon)} />
          ) : (
            <ListIcon {...className(style.viewIcon)} />
          )}
        </button>
      </div>
    </div>
  );
}

export default Header;
