import React, { useContext, useState, useRef } from "react";
import SearchIcon from "../../../assets/icons/SearchIcon";
import { AppContext } from "../../../context/AppContext";
import { className } from "../../../utilities/helpers";
import * as style from "./SearchInput.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import CloseIcon from "../../../assets/icons/CloseIcon";

function SearchInput() {
  const { setTermToSearch } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const blurInput = () => {
    setIsInputFocused(false);
    searchInputRef.current?.blur();
  };

  const clearSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    setTermToSearch("");
    setSearchInput("");
    blurInput();
  };

  const handleSearchSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    setTermToSearch(searchInput);
    blurInput();
  };

  return (
    <form {...className(style.searchInputCon)}>
      <input
        {...className(style.searchInput, textStyles.subtitleText)}
        ref={searchInputRef}
        type="search"
        placeholder="Search"
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
          setIsInputFocused(true);
        }}
        onKeyUp={(event) => {
          if (event.code === "Enter") {
            setTermToSearch(searchInput);
            blurInput();
          }
        }}
      />

      {searchInput != "" && !isInputFocused ? (
        <button
          type="submit"
          onClick={clearSearch}
          {...className(buttons.btn, style.btn)}
        >
          <CloseIcon {...className(style.closeIcon)} />
        </button>
      ) : (
        <button
          type="submit"
          onClick={handleSearchSubmit}
          {...className(buttons.btn, style.btn)}
        >
          <SearchIcon {...className(style.searchIcon)} />
        </button>
      )}
    </form>
  );
}

export default SearchInput;
