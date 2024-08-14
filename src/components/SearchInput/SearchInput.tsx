import React, { useContext } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import { AppContext } from "../../context/AppContext";
import { className } from "../../utilities/helpers";
import * as style from "./SearchInput.module.css";

function SearchInput() {
  const { search, setSearch } = useContext(AppContext);

  return (
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
  );
}

export default SearchInput;