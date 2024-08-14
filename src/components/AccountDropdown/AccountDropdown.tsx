import React, { useContext, useEffect } from "react";
import { className } from "../../utilities/helpers";
import * as style from "./AccountDropdown.module.css";
import * as shared from "../../assets/styles/shared.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { signOutUser } from "../../firestore/authService";
import { evalErrorCode } from "../../utilities/helpers";

function AccountDropdown() {
  const {
    user,
    setUser,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownRef,
    dropdownButtonRef,
    isLoading,
    setIsLoading,
    setAuthenticatedUserId,
    setToastMessageContent,
  } = useContext(AppContext);
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

  const handleSignOutUser = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setAuthenticatedUserId(null);
      setIsDropdownOpen(false);
      navigate("/signin");
    } catch (error: unknown) {
      console.error("Failed to sign out user: ", error);
      if (error instanceof FirebaseError) {
        setToastMessageContent({
          actionButtonText: "",
          isPersisting: false,
          showMessage: true,
          isError: true,
          description: `Failed to sign out: ${evalErrorCode(error.code)}`,
        });
      }
    } finally {
      setIsLoading(false);
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
        <Link to="/dashboard" {...className(style.dropdownItem)}>
          Dashboard
        </Link>
        <Link to="/settings" {...className(style.dropdownItem)}>
          Account settings
        </Link>
        <div {...className(shared.divider)} />
        <button
          disabled={isLoading}
          onClick={() => {
            handleSignOutUser();
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
