import React, { useContext, useEffect } from "react";
import { className } from "../../helpers";
import * as style from "./AccountDropdown.module.css";
import * as shared from "../shared.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AppContext } from "../../context";

function AccountDropdown() {
  const {
    setUser,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownRef,
    dropdownButtonRef,
  } = useContext(AppContext);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef && dropdownButtonRef) {
      if (
        dropdownRef.current &&
        dropdownButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    <div
      ref={dropdownRef}
      id="account-modal"
      {...className(style.dropdownCon, shared.shadow)}
    >
      <span {...className(style.emailText)}>test@test.com</span>
      <span {...className(shared.titleText)}>Hello, friend!</span>
      <div {...className(style.dropdownItemCon)}>
        <Link to="" {...className(style.dropdownItem)}>
          Account settings
        </Link>
        <div {...className(style.divider)} />
        <button
          onClick={() => {
            handleSignOut();
          }}
          {...className(shared.btn, style.dropdownItem)}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default AccountDropdown;
