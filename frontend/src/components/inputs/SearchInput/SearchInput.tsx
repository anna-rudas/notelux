import React, { useContext, useRef } from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import * as style from "./SearchInput.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import CloseIcon from "../../../assets/icons/CloseIcon";

function SearchInput() {
  const { setTermToSearch, termToSearch } = useContext(AppContext);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const blurInput = () => {
    searchInputRef.current?.blur();
  };

  const clearSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    setTermToSearch("");
    blurInput();
  };

  const handleSearchSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    blurInput();
  };

  return (
    <form {...className(style.searchInputCon)}>
      <button
        type="submit"
        onClick={handleSearchSubmit}
        {...className(buttons.btn, style.searchIconBtn)}
      >
        <SearchIcon {...className(style.searchIcon)} />
      </button>
      <input
        {...className(style.searchInput, textStyles.subtitleText)}
        ref={searchInputRef}
        type="search"
        placeholder="Search"
        value={termToSearch}
        onChange={(event) => {
          setTermToSearch(event.target.value);
        }}
      />

      {termToSearch != "" && (
        <button
          type="submit"
          onClick={clearSearch}
          {...className(buttons.btn, style.clearIconBtn)}
        >
          <CloseIcon {...className(style.clearIcon)} />
        </button>
      )}
    </form>
  );
}

export default SearchInput;
