import React, { useContext, useEffect } from "react";
import { className } from "../../helpers";
import * as style from "./AccountDropdown.module.css";
import * as shared from "../shared.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { AppContext } from "../../context";
import { FirebaseError } from "firebase/app";

function AccountDropdown() {
  const {
    user,
    setUser,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownRef,
    dropdownButtonRef,
    isLoading,
    setUserId,
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
      setUserId(null);
      setIsDropdownOpen(false);
      navigate("/signin");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to sign out user: ", error.code);
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      id="account-modal"
      {...className(style.dropdownCon, shared.shadow)}
    >
      <span {...className(style.emailText)}>{user?.email}</span>
      <span {...className(shared.titleText)}>
        Hello, {user?.username !== "" ? user?.username : "guest"}!
      </span>
      <div {...className(style.dropdownItemCon)}>
        <Link to="/settings" {...className(style.dropdownItem)}>
          Account settings
        </Link>
        <div {...className(shared.divider)} />
        <button
          disabled={isLoading}
          onClick={() => {
            handleSignOut();
          }}
          {...className(
            shared.btn,
            style.dropdownItem,
            isLoading ? shared.btnDisabled : ""
          )}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default AccountDropdown;
