import React, { useContext, useEffect } from "react";
import { className } from "../../../utilities/helpers";
import * as style from "./AccountDropdown.module.css";
import * as shared from "../../../assets/styles/shared.module.css";
import * as buttons from "../../../assets/styles/buttons.module.css";
import * as textStyles from "../../../assets/styles/text-styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { FirebaseError } from "firebase/app";
import { signOutUser } from "../../../firestore/authService";
import { evalErrorCode } from "../../../utilities/helpers";
import PrimaryButton from "../../buttons/PrimaryButton";
import { DashboardContext } from "../../../context/DashboardContext";
import FocusTrap from "focus-trap-react";

function AccountDropdown() {
  const {
    user,
    setUser,
    setIsDropdownOpen,
    isDropdownOpen,
    dropdownRef,
    dropdownButtonRef,
    isLoading,
    authenticatedUser,
    setIsLoading,
    setAuthenticatedUser,
    setToastMessageContent,
  } = useContext(AppContext);
  const { setIsCreateAccountModalOpen } = useContext(DashboardContext);
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
      setAuthenticatedUser(null);
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

  if (user === null) {
    return null;
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        allowOutsideClick: true,
        onDeactivate: () => {
          setIsDropdownOpen(false);
        },
      }}
    >
      <div
        ref={dropdownRef}
        id="account-modal"
        {...className(style.dropdownCon, shared.shadow)}
      >
        <span {...className(style.emailText)}>{user.email}</span>
        <span {...className(textStyles.titleText)}>
          Hello, {user.username}!
        </span>
        <div {...className(style.dropdownItemCon)}>
          <Link
            to="/dashboard"
            {...className(style.dropdownItem, textStyles.subtitleText)}
          >
            Dashboard
          </Link>
          {authenticatedUser?.isAnonymous ? (
            <button
              disabled={isLoading}
              onClick={() => setIsCreateAccountModalOpen(true)}
              {...className(
                buttons.btn,
                style.dropdownItem,
                textStyles.subtitleText
              )}
            >
              Account settings
            </button>
          ) : (
            <Link
              to="/settings"
              {...className(style.dropdownItem, textStyles.subtitleText)}
            >
              Account settings
            </Link>
          )}
          <div {...className(shared.divider)} />
          {authenticatedUser?.isAnonymous ? (
            <PrimaryButton
              buttonText="Create account"
              buttonStyle={style.btn}
              navigateTo="/create-account"
            />
          ) : (
            <button
              disabled={isLoading}
              onClick={handleSignOutUser}
              {...className(
                buttons.btn,
                style.dropdownItem,
                textStyles.subtitleText
              )}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </FocusTrap>
  );
}

export default AccountDropdown;
